# Contributing a run

The useful contribution is a run this repository does not have.

## Recipe

Copy an existing file in `examples/` and fill in:

1. `request` — the **exact** payload you submitted. Prompt, model, every parameter.
2. `input` and `output` — public, stable URLs. Self-hosted is fine; a URL that 404s in a month is not.
3. `bytes` and `sha256` — from the file you **downloaded**, never from your request or your local copy.
4. `measured` — from `ffprobe`, not from the request. This is the whole point.
5. `limitations` — at least one. A record with no limitations reads as fabricated because every real run has some.

Then:

```bash
npm run verify     # re-downloads and re-hashes your artifacts
npm run build      # regenerates docs/
```

## Model record

- `status: "verified"` **only** with at least one entry in `evidence.localRuns` pointing at a recipe that has an output hash. The verifier rejects anything else.
- `status: "not-run"` for anything you have not run. Spec and price fields are then **vendor-published figures** and must carry `sourceUrl` and the date you read it.
- Never add a score to a `not-run` record. That is the one rule that keeps this database worth citing.

## Failure record

Must state all four: `symptom`, `reproduction`, `detection`, `mitigation`, plus a `measuredDifference` with both `requested` and `measured`. The verifier enforces this.

## What gets rejected

- Scores without measurements.
- Hashes taken from a request rather than a downloaded file.
- Ranking language (`best`, `outperforms`, `#1`) anywhere in the JSON records — the verifier greps for it.
- Runs using minors, real-person sexualization, impersonation, or media you lack rights to.
