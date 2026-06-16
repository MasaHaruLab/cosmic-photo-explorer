# Execution Recovery Gate

Use this checklist before resuming product development after any control-layer pause, drift correction, or recovery cycle.

## Pass conditions
- [ ] `.agent/current_batch.json` is the active truth source and matches reality
- [ ] `HANDOFF.md` is synchronized from the truth source
- [ ] knowledge-base execution plan is synchronized from the truth source
- [ ] watchdog heartbeat is `ok` for the active batch
- [ ] active `in_progress` batch includes `activation_evidence`
- [ ] any `paused` or `blocked` batch includes a human-readable `reason`
- [ ] preview URL is reachable: `http://127.0.0.1:4173`
- [ ] repo working tree is either clean or intentionally dirty for the active batch only
- [ ] next product batch has one clearly named first repo action
- [ ] no chat claim is ahead of repo truth

## Resume decision
- If all pass: product development may resume.
- If any fail: do not resume product work; stay in control mode and fix the failing gate.

## First target after gate pass
- Product Batch B6: cinematic target zoom transition

## Stop rule
Do not mark Product Batch B6 `in_progress` until its first real tracked repo change exists and is recorded as `activation_evidence`.
