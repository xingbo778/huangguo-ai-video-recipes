# Measured AI video model database

A public, reproducible record of what AI video models actually returned when we asked them for something — with the request, the output file, its SHA-256, and the mismatch, kept together.

This is **not** a "best AI video generator" listicle. Every number here is either re-downloaded and hash-verified by us, or explicitly labeled as someone else's published figure. There are no quality scores, no rankings, and no winner.

## Why this exists

Most AI video comparison pages are written from vendor marketing and hand-picked reels. When you copy their settings, you get different results and no idea why.

Three concrete examples from our own runs:

- We asked for **9:16** twice and got **480×640 (3:4)** back with an HTTP 200 and no error. Both times.
- We asked for **480P** and the measured long edge was **640**.
- We asked for **5 s** and measured **10.33 s**, because our own palindrome post-processing doubled it.

None of these are bugs in a vendor. They are the normal gap between a request parameter and a delivered file, and you cannot see them unless you probe the output.

## What's in here

| Directory | What it holds |
|---|---|
| `examples/` | 4 recipes. Full request payload, public input and output URLs, byte counts, SHA-256, measured properties, post-processing steps, known limitations. |
| `models/` | 9 model records. 3 with verified local runs, 6 explicitly marked `not-run`. |
| `failures/` | 6 reproducible failure modes with requested/measured, detection, and mitigation. |
| `docs/` | Auto-generated matrix, parameter comparison, and failure catalogue. Regenerate with `npm run build`. |
| `schema/` | JSON Schemas for all three record types. |

## Verified vs not-run

This is the most important distinction in the repository.

**Verified local run** (3 of 9): we hold at least one recipe whose public input and output we re-downloaded and matched by SHA-256. Measured columns in `docs/MODEL_MATRIX.md` come only from these.

**No local run** (6 of 9: Sora 2, Veo 3.1, Kling 3.0, Seedance 2.0, Runway Gen-4.5, Wan open weights): we have **not** run these. Their spec and price columns are vendor-published figures we copied from public documentation with the source URL and the date we read it. They carry **no quality or speed score of any kind**, because we have none to report.

We would rather publish an empty slot than fill it with a guess. If you have run one of these, a PR with a hash beats an opinion.

## The parameter matrix

The clearest output in the repo — what we asked for versus what came back:

| Recipe | Model | Requested | Measured | Mismatch |
|---|---|---|---|---|
| Neon-city two-character shot | `alibaba/wan-3.0/image-to-video` | 720p, 6 s | 720×406, 6.00 s, 15 fps | none observed |
| Hair-touch reaction | `minimax/h3-max/image-to-video` | 9:16, 480P, 5 s | 480×640, 5.17 s, 24 fps | ratio, long edge |
| Idle loop | `minimax/h3-max/image-to-video` | 9:16, 480P, 5 s | 480×640, 10.33 s, 24 fps | ratio, long edge, duration |
| Reference-to-video | `grok-imagine-video-1.5` | 3:4, 480p, 4 s | 480×640, 4.04 s, 24 fps | long edge |

Regenerate it with `npm run build`.

## Failure catalogue

Six modes, each stating what was requested, what was measured, how to detect it, and what to do instead:

1. **Requested 9:16 returned 3:4 with HTTP 200** (high) — reproduced twice, same parameters.
2. **Reference-to-video does not lock the reference as frame one** (high) — reference-to-video is a soft identity hint, not identity verification.
3. **Independent shots cannot verify as one face** (medium) — prompt reuse across shots does not produce a continuous character.
4. **Public artifact is a lossy derivative, not the provider response** (medium) — we publish the master's hash so the gap is auditable.
5. **Palindrome loop doubles duration** (low) — works for breathing, breaks on gestures.
6. **Hand crossing the face is an artifact worst case** (medium).

## Verify everything yourself

```bash
npm run verify          # re-download every recipe artifact, compare bytes and SHA-256
npm run verify:db       # cross-reference integrity, evidence rules, no-ranking-language check
npm run build           # regenerate docs/ from the JSON records
```

`verify:db` fails the build if a model claims `verified` without a hashed recipe, if a failure record omits detection or mitigation, or if any record contains ranking language like "best" or "outperforms". Try it: flip `models/kling-3.0.json` to `status: "verified"` and watch it fail.

## Contributing

The useful contribution is a run we don't have.

1. Copy an existing record in `examples/` and fill in your real request and output.
2. Host the input and output at public, stable URLs.
3. Fill `bytes` and `sha256` from the file you actually downloaded, not from your request.
4. List at least one honest limitation. A record with no limitations looks fabricated, because every real run has some.
5. Run `npm run verify` and `npm run build`.

PRs that add a score without a measurement will be rejected. PRs that add a `not-run` model with sourced public figures are very welcome.

## Character chat acceptance

- [Story-to-character chat acceptance — 45 added characters, source mapping, and actual response samples (中文)](docs/CHAT_CHARACTER_ACCEPTANCE_2026-09-06.md)

## Live pages

- [Huangguo AI video generator](https://huangguo.design/ai-video-generator)
- [Huangguo image-to-video workflow](https://huangguo.design/image-to-video)
- [Huangguo evidence library](https://huangguo.design/examples)
- [Huangguo Chat role-play hub](https://huangguo.chat/play)

## Disclosure

This database is maintained by the team behind the Huangguo product family, and the verified runs come from Huangguo production scripts. That is disclosed rather than hidden, because it is the obvious conflict of interest. It is also why every claim is hash-verifiable: our say-so is not the evidence, the file is.

Vendor-published figures in `not-run` records were read on the `lastReviewedAt` date in each file and can change without notice. Check the `sourceUrl` before relying on any price.

## Use restrictions

Only fictional adult characters and assets you have permission to process. Do not use these recipes for minors, real-person sexualization, impersonation, or media you do not have the rights to.

## License

MIT. Data records in `examples/`, `models/`, and `failures/` are MIT as well; the linked media assets keep their own terms.

## 中文说明

这里只记录可核验的实测结果：请求参数、输出文件、字节数与 SHA-256、实测尺寸时长，以及请求与实际返回之间的偏差。已实测的 3 个模型与 6 个未实测模型严格分开，未实测的不给任何评分。失败案例同样保留，因为可复现的失败比成功宣传更有用。运行 `npm run verify` 可重新下载校验全部公开素材。
