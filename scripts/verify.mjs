import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const examplesDir = path.join(root, "examples");
const files = (await readdir(examplesDir)).filter((name) => name.endsWith(".json")).sort();

let failures = 0;

for (const file of files) {
  const recipe = JSON.parse(await readFile(path.join(examplesDir, file), "utf8"));
  for (const label of ["input", "output"]) {
    const artifact = recipe[label];
    const response = await fetch(artifact.url, { redirect: "follow" });
    if (!response.ok) {
      console.error(`FAIL ${recipe.id} ${label}: HTTP ${response.status}`);
      failures += 1;
      continue;
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const ok = bytes.length === artifact.bytes && sha256 === artifact.sha256;
    console.log(`${ok ? "PASS" : "FAIL"} ${recipe.id} ${label}: ${bytes.length} bytes ${sha256}`);
    if (!ok) failures += 1;
  }
}

if (failures > 0) process.exitCode = 1;
