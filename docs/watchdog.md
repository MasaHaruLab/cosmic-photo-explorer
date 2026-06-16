# Watchdog

This project includes an independent watchdog process so execution health is not inferred only from chat.

## What it checks
- whether the preview server responds at the configured URL
- current git HEAD
- dirty file count
- seconds since last repository activity in key working directories
- whether an in-progress batch appears stalled

## Files
- `.agent/current_batch.json` — current execution state
- `.agent/heartbeat.json` — latest machine-written health snapshot
- `.agent/watchdog.log` — append-only history
- `scripts/watchdog.py` — watchdog implementation

## Health states
- `ok`
- `preview_down`
- `possible_stall`

## Status semantics
- `pending` = next batch is known but not started yet
- `in_progress` = actual implementation work for this batch has started
- `completed` = batch landed and the next batch should be written separately

Do not mark a batch `in_progress` just because it is next in line.
Only flip to `in_progress` after real repo work for that batch begins.

## Stall rule
If a batch is marked `in_progress` and there has been no repository activity for 10 minutes, the watchdog marks the system as `possible_stall`.

## Notification behavior
On macOS, the watchdog attempts to send a desktop notification when preview goes down or a possible stall is detected.

## Operator rule
Each time the active batch changes, update `.agent/current_batch.json`.
This allows the watchdog to judge whether the system is moving normally.
