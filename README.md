# Reproducible AI video prompt recipes

Small, inspectable image-to-video experiments from the Huangguo product family. Every recipe records the exact public input, submitted prompt and parameters, public output, file hashes, measured output properties, post-processing, and known limitations.

These are production records, not benchmark claims. A successful request does not guarantee the requested aspect ratio, identity stability, hand quality, or a clean loop. Validate the downloaded output instead of trusting request parameters alone.

## Verified recipes

| Recipe | Input | Output | What it tests |
| --- | --- | --- | --- |
| [Adult character idle loop](examples/guoguo-idle-loop.json) | [864×1152 reference](https://huangguo.chat/characters-v2/guoguo.jpg) | [10.33 s MP4](https://huangguo.chat/motion/guoguo-idle-h3v3.mp4) | Identity continuity and reversible loop post-processing |
| [Hair-touch reaction](examples/guoguo-hair-reaction.json) | [864×1152 reference](https://huangguo.chat/characters-v2/guoguo.jpg) | [5.17 s MP4](https://huangguo.chat/motion/guoguo-zone-hair-h3v1.mp4) | Hand/face occlusion and a single controlled gesture |
| [Neon-city two-character shot](examples/dushi-neon-couple-wan3.json) | [3840×2160 first frame](https://huangguodrama.ai/landing/hero-4.jpg) | [6.00 s web derivative](https://huangguodrama.ai/evidence/hero-4-preview.mp4) | Two-character proximity, background motion, and derivative provenance |
| [Grok reference-to-video test](examples/guoguo-reference-grok-1.5.json) | [864×1152 reference](https://huangguo.chat/characters-v2/guoguo.jpg) | [4.04 s MP4](https://huangguo.design/evidence/generated/grok-consistent-character.mp4) | Reference adherence and visible identity drift |

Both H3 requests asked for `9:16`, while their measured files are `480×640` (`3:4`). That mismatch is preserved here because it is useful evidence: downstream code should probe output dimensions and crop or pad when a strict delivery ratio is required. The Wan 3.0 record is a separate `16:9`-style workflow whose public MP4 is explicitly labeled as a lossy derivative.

## Verify the public artifacts

Requires Node.js 20 or newer:

```bash
npm run verify
```

The script downloads every declared input and output, then checks byte length and SHA-256. The JSON records conform to [the recipe schema](schema/recipe.schema.json).

## Related live pages

- [Huangguo Chat role-play hub](https://huangguo.chat/play)
- [Huangguo AI video generator](https://huangguo.design/ai-video-generator)
- [Huangguo image-to-video workflow](https://huangguo.design/image-to-video)
- [Huangguo consistent-character workflow](https://huangguo.design/consistent-character-video)
- [Huangguo AI storyboard workflow](https://huangguo.design/ai-storyboard-generator)
- [Huangguo evidence library](https://huangguo.design/examples)
- [Huangguo Drama urban-shot evidence page](https://huangguodrama.ai/tag/dushi/)

Only fictional adult characters and authorized assets should be used. Do not use these recipes for minors, real-person sexualization, impersonation, or media you do not have permission to process.

## 中文说明

这里记录的是可核验的真实生成实验，不是宣传参数：公开输入、提示词、请求参数、输出文件、哈希、实测尺寸和失败边界都保留下来。运行 `npm run verify` 可重新下载并校验当前公开素材。
