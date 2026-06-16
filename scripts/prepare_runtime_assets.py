#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets' / 'generated'
HERO = ASSETS / 'hero'
TILES = ASSETS / 'tiles'
MANIFESTS = ROOT / 'data' / 'manifests'


def ensure_dirs() -> None:
    for path in [ASSETS, HERO, TILES, MANIFESTS]:
        path.mkdir(parents=True, exist_ok=True)


def manifest_summary() -> dict:
    summary = {}
    for name in ['scenes.json', 'zoom-paths.json', 'interpretation.json']:
        path = MANIFESTS / name
        if not path.exists():
            summary[name] = {'exists': False, 'entries': 0}
            continue
        try:
            data = json.loads(path.read_text())
            entries = len(data) if isinstance(data, list) else len(data.keys()) if isinstance(data, dict) else 1
            summary[name] = {'exists': True, 'entries': entries}
        except Exception as exc:  # pragma: no cover
            summary[name] = {'exists': True, 'error': str(exc)}
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description='Prepare runtime-facing asset directories for Cosmic Photo Explorer.')
    parser.add_argument('--sync-manifests', action='store_true', help='print manifest presence summary after ensuring directories')
    args = parser.parse_args()

    ensure_dirs()
    print(f'Prepared runtime directories under: {ASSETS}')

    if args.sync_manifests:
        print(json.dumps(manifest_summary(), ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
