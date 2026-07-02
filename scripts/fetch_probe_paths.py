#!/usr/bin/env python3
"""Bake deep-space probe sky paths (geocentric RA/Dec over mission lifetime)
from the JPL Horizons API into static JSON for the explorer.

Usage: python3 scripts/fetch_probe_paths.py
Writes data/probes.json and app/public/data/probes.json.
"""
import json
import pathlib
import urllib.parse
import urllib.request

API = 'https://ssd.jpl.nasa.gov/api/horizons.api'

# Horizons ephemeris availability bounds (probes lose contact / data ends).
PROBES = [
    {"id": "voyager-1", "command": "-31", "label": "旅行者 1 号",
     "start": "1977-09-06", "stop": "NOW"},
    {"id": "voyager-2", "command": "-32", "label": "旅行者 2 号",
     "start": "1977-08-21", "stop": "NOW"},
    {"id": "pioneer-10", "command": "-23", "label": "先驱者 10 号",
     "start": "1972-03-04", "stop": "NOW"},
    {"id": "pioneer-11", "command": "-24", "label": "先驱者 11 号",
     "start": "1973-04-07", "stop": "NOW"},
    {"id": "new-horizons", "command": "-98", "label": "新视野号",
     "start": "2006-01-20", "stop": "NOW"},
]

TODAY = '2026-07-02'


def fetch(command, start, stop):
    params = {
        'format': 'text',
        'COMMAND': f"'{command}'",
        'OBJ_DATA': "'NO'",
        'MAKE_EPHEM': "'YES'",
        'EPHEM_TYPE': "'OBSERVER'",
        'CENTER': "'500@399'",  # geocentric
        'START_TIME': f"'{start}'",
        'STOP_TIME': f"'{TODAY if stop == 'NOW' else stop}'",
        'STEP_SIZE': "'30 d'",
        'QUANTITIES': "'1,20'",  # astrometric RA/Dec + observer range
        'ANG_FORMAT': "'DEG'",
        'CSV_FORMAT': "'YES'",
    }
    url = API + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': 'cosmic-photo-explorer/1.0'})
    return urllib.request.urlopen(req, timeout=60).read().decode()


def parse(text):
    rows = []
    inside = False
    for line in text.splitlines():
        if line.startswith('$$SOE'):
            inside = True
            continue
        if line.startswith('$$EOE'):
            break
        if not inside:
            continue
        parts = [p.strip() for p in line.split(',')]
        # CSV columns: date, flag1, flag2, RA, DEC, delta, deldot, ...
        if len(parts) < 7:
            continue
        try:
            ra, dec, delta = float(parts[3]), float(parts[4]), float(parts[5])
        except ValueError:
            continue
        rows.append((round(ra, 3), round(dec, 3), delta))
    return rows


def main():
    out = []
    for probe in PROBES:
        text = fetch(probe['command'], probe['start'], probe['stop'])
        rows = parse(text)
        if not rows:
            print(f"WARN {probe['id']}: no rows (Horizons said: "
                  f"{[l for l in text.splitlines() if 'No ephemeris' in l or 'Cannot' in l][:1]})")
            continue
        path = [[r[0], r[1]] for r in rows]
        out.append({
            'id': probe['id'],
            'label': probe['label'],
            'start': probe['start'],
            'end': TODAY if probe['stop'] == 'NOW' else probe['stop'],
            'samples': len(path),
            'dist_au': round(rows[-1][2], 1),
            'current': path[-1],
            'path': path,
        })
        print(f"{probe['id']}: {len(path)} samples, now at "
              f"ra {path[-1][0]} dec {path[-1][1]}, {rows[-1][2]:.1f} AU")
    text = json.dumps(out, ensure_ascii=False) + '\n'
    for p in ['data/probes.json', 'app/public/data/probes.json']:
        pathlib.Path(p).write_text(text)
    print(f"wrote {len(out)} probes to data/probes.json + app/public copy")


if __name__ == '__main__':
    main()
