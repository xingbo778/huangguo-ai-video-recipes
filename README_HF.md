---
title: Measured AI Video Model Database
emoji: 🎬
colorFrom: purple
colorTo: gray
sdk: static
pinned: false
short_description: Reproducible AI video runs with hashes, measured outputs, and failure modes
license: mit
tags:
  - video-generation
  - image-to-video
  - text-to-video
  - benchmark
  - reproducibility
  - ai-video
  - evaluation
---

# Measured AI video model database

Public record of what AI video models actually returned, with the request, the output file, its SHA-256, and the mismatch kept together.

**No quality scores. No rankings. No winner.**

- **4 recipes** — full request payload, public input/output URLs, byte counts, SHA-256, measured properties, limitations
- **9 model records** — **3 with verified local runs**, **6 explicitly marked `not-run`**
- **6 failure modes** — requested vs measured, detection, mitigation

## The distinction that matters

`verified` means we re-downloaded the artifact and matched its SHA-256. `not-run` means we have not run the model, so its spec and price columns are vendor-published figures with a source URL and a read date, and it carries **zero** quality or speed score.

An empty slot is more honest than a guessed number.

## What we caught by measuring instead of trusting

| We asked for | We measured |
|---|---|
| 9:16 (twice) | 480×640 = 3:4, HTTP 200, no error |
| 480P | long edge 640 |
| 5 s | 10.33 s (our own palindrome doubling) |

## Verify it yourself

```bash
npm run verify      # re-download every artifact, compare bytes and SHA-256
npm run verify:db   # integrity, evidence rules, no-ranking-language check
```

`verify:db` fails if a model claims `verified` without a hashed recipe, or if any record contains ranking language such as "best" or "outperforms".

## Contributing

The useful contribution is a run we don't have. Add a recipe with real request, hosted output, hash from the file you actually downloaded, and at least one honest limitation. PRs adding a score without a measurement will be rejected.

**Use restrictions:** fictional adult characters and authorized assets only. No minors, no real-person sexualization, no impersonation, no media you lack rights to.

**Disclosure:** maintained by the team behind the Huangguo product family; verified runs come from Huangguo production scripts. That conflict is exactly why every claim is hash-verifiable.

Source: https://github.com/huangguo-ai/video-recipes
