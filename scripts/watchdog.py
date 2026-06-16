#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

ROOT = Path('/Users/ambrosiazheng/cosmic-photo-explorer')
STATE = ROOT / '.agent' / 'current_batch.json'
HEARTBEAT = ROOT / '.agent' / 'heartbeat.json'
LOG = ROOT / '.agent' / 'watchdog.log'
CHECK_INTERVAL = 60
STALL_SECONDS = 600
WATCH_PATHS = [ROOT / 'app', ROOT / 'docs', ROOT / 'data', ROOT / 'pipeline', ROOT / 'assets']
IGNORE_DIRS = {'.git', 'node_modules', 'dist', '.vite', '__pycache__'}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def run(cmd: list[str]) -> str:
    return subprocess.check_output(cmd, text=True).strip()


def git_head() -> str:
    try:
        return run(['git', '-C', str(ROOT), 'rev-parse', '--short', 'HEAD'])
    except Exception:
        return 'unknown'


def git_dirty_count() -> int:
    try:
        out = run(['git', '-C', str(ROOT), 'status', '--short'])
        if not out:
            return 0
        return len(out.splitlines())
    except Exception:
        return -1


def preview_ok(url: str) -> bool:
    try:
        req = Request(url, method='HEAD')
        with urlopen(req, timeout=5) as resp:
            return 200 <= resp.status < 400
    except (URLError, HTTPError, Exception):
        return False


def latest_repo_activity() -> float:
    latest = 0.0
    for base in WATCH_PATHS:
        if not base.exists():
            continue
        for root, dirs, files in os.walk(base):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            for name in files:
                p = Path(root) / name
                try:
                    latest = max(latest, p.stat().st_mtime)
                except FileNotFoundError:
                    pass
    return latest


def load_state() -> dict:
    if STATE.exists():
        return json.loads(STATE.read_text())
    return {}


def maybe_notify(title: str, message: str):
    try:
        subprocess.run([
            'osascript', '-e',
            f'display notification {json.dumps(message)} with title {json.dumps(title)}'
        ], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass


def main():
    last_alert_key = None
    while True:
        state = load_state()
        preview = preview_ok(state.get('preview_url', 'http://127.0.0.1:4173'))
        head = git_head()
        dirty = git_dirty_count()
        latest_activity = latest_repo_activity()
        age = int(time.time() - latest_activity) if latest_activity else -1
        status = state.get('status')
        activation_evidence = state.get('activation_evidence')
        heartbeat = {
            'checked_at': now_iso(),
            'current_batch': state.get('batch_id'),
            'title': state.get('title'),
            'status': status,
            'reason': state.get('reason'),
            'activation_evidence': activation_evidence,
            'latest_commit': head,
            'dirty_count': dirty,
            'preview_ok': preview,
            'seconds_since_repo_activity': age,
            'stall_threshold_seconds': STALL_SECONDS,
            'health': 'ok'
        }
        if not preview:
            heartbeat['health'] = 'preview_down'
        elif status == 'paused':
            heartbeat['health'] = 'paused'
        elif status == 'blocked':
            heartbeat['health'] = 'blocked'
        elif status == 'in_progress' and not activation_evidence:
            heartbeat['health'] = 'invalid_state'
        elif age >= STALL_SECONDS and status == 'in_progress':
            heartbeat['health'] = 'possible_stall'

        HEARTBEAT.write_text(json.dumps(heartbeat, ensure_ascii=False, indent=2) + '\n')
        with LOG.open('a', encoding='utf-8') as f:
            f.write(json.dumps(heartbeat, ensure_ascii=False) + '\n')

        alert_key = heartbeat['health']
        if alert_key in {'preview_down', 'possible_stall'} and alert_key != last_alert_key:
            maybe_notify('Cosmic Explorer Watchdog', f"{alert_key} | batch={heartbeat.get('current_batch')} | commit={head}")
        last_alert_key = alert_key
        time.sleep(CHECK_INTERVAL)


if __name__ == '__main__':
    main()
