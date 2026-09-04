import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadDir(dir) {
  const full = path.join(root, dir);
  const files = (await readdir(full)).filter((f) => f.endsWith(".json")).sort();
  return Promise.all(
    files.map(async (f) => ({
      file: `${dir}/${f}`,
      data: JSON.parse(await readFile(path.join(full, f), "utf8")),
    })),
  );
}

const recipes = await loadDir("examples");
const models = await loadDir("models");
const failures = await loadDir("failures");
const problems = [];
const recipeById = new Map(recipes.map((r) => [r.data.id, r.data]));

// 1. Every recipe artifact must still resolve and match its recorded hash online.
for (const { file, data } of recipes) {
  for (const label of ["input", "output"]) {
    const a = data[label];
    if (!a) continue;
    let res;
    try {
      res = await fetch(a.url, { redirect: "follow" });
    } catch (err) {
      problems.push(`${file} ${label}: network error ${err.message}`);
      continue;
    }
    if (!res.ok) {
      problems.push(`${file} ${label}: HTTP ${res.status} for ${a.url}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const sha = createHash("sha256").update(buf).digest("hex");
    if (buf.length !== a.bytes) {
      problems.push(`${file} ${label}: recorded ${a.bytes} bytes, live ${buf.length}`);
    }
    if (sha !== a.sha256) {
      problems.push(`${file} ${label}: recorded sha256 ${a.sha256.slice(0, 12)}..., live ${sha.slice(0, 12)}...`);
    }
  }
}

// 2. A model may only claim "verified" when it points at recipes that themselves have hashes.
for (const { file, data } of models) {
  const runs = data.evidence?.localRuns || [];
  if (data.status === "verified" && runs.length === 0) {
    problems.push(`${file}: status "verified" but no localRuns evidence`);
  }
  for (const run of runs) {
    const recipe = recipeById.get(run.recipeId);
    if (!recipe) {
      problems.push(`${file}: localRuns references unknown recipe "${run.recipeId}"`);
    } else if (!recipe.output?.sha256) {
      problems.push(`${file}: claims verified run "${run.recipeId}" but that recipe has no output hash`);
    }
  }
  if (data.status === "not-run" && runs.length > 0) {
    problems.push(`${file}: status "not-run" but lists localRuns; set status to "verified"`);
  }
}

// 3. Every failure must reference at least one model or recipe, and state both sides.
for (const { file, data } of failures) {
  const refs = (data.relatedModelIds || []).length + (data.relatedRecipeIds || []).length;
  if (refs === 0) problems.push(`${file}: no related model or recipe`);
  if (!data.measuredDifference?.requested || !data.measuredDifference?.measured) {
    problems.push(`${file}: measuredDifference must state requested and measured`);
  }
  if (!data.detection || !data.mitigation) {
    problems.push(`${file}: must state how to detect and how to mitigate`);
  }
}

// 4. No ranking language anywhere in the data files. This database reports measurements, not winners.
const BANNED = /\b(best|fastest|#1|number one|beats|outperforms|winner|highest quality|top-ranked)\b/i;
for (const { file, data } of [...models, ...failures]) {
  const blob = JSON.stringify(data).toLowerCase();
  const hit = blob.match(BANNED);
  if (hit) problems.push(`${file}: ranking language "${hit[0]}" is not allowed in evidence records`);
}

if (problems.length) {
  console.error(`FAIL: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log(
    `PASS: ${recipes.length} recipes re-verified online, ${models.length} models, ${failures.length} failure records, no ranking language.`,
  );
}
