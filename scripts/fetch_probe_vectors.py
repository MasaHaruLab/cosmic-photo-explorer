#!/usr/bin/env python3
"""Bake deep-space probe 3D trajectories (heliocentric ecliptic X/Y/Z) from the
JPL Horizons API into static JSON for the "深空信使 / Deep Space Messengers" page.

Unlike fetch_probe_paths.py (geocentric RA/Dec sky directions for the homepage),
this fetches real spatial positions so probes visibly fan out from Earth and pass
real planets. Coordinates: ecliptic J2000, Sun-centered, in AU. +Z = ecliptic north.

Usage: python3 scripts/fetch_probe_vectors.py
Writes data/probe_vectors.json and app/public/data/probe_vectors.json.
"""
import datetime
import json
import pathlib
import urllib.parse
import urllib.request

API = 'https://ssd.jpl.nasa.gov/api/horizons.api'
TODAY = '2026-07-06'
STEP_DAYS = 5

# Real mission milestones (closest-approach / boundary-crossing dates).
PROBES = [
    {"id": "voyager-1", "command": "-31", "label": "旅行者 1 号", "label_en": "Voyager 1",
     "start": "1977-09-06", "stop": "NOW",
     "milestones": [
         {"date": "1979-03-05", "zh": "掠过木星", "en": "Jupiter flyby"},
         {"date": "1980-11-12", "zh": "掠过土星", "en": "Saturn flyby"},
         {"date": "1990-02-14", "zh": "回望「暗淡蓝点」", "en": "Pale Blue Dot"},
         {"date": "2012-08-25", "zh": "冲出日球层，进入星际空间", "en": "Entered interstellar space"},
     ]},
    {"id": "voyager-2", "command": "-32", "label": "旅行者 2 号", "label_en": "Voyager 2",
     "start": "1977-08-21", "stop": "NOW",
     "milestones": [
         {"date": "1979-07-09", "zh": "掠过木星", "en": "Jupiter flyby"},
         {"date": "1981-08-25", "zh": "掠过土星", "en": "Saturn flyby"},
         {"date": "1986-01-24", "zh": "掠过天王星（唯一到访）", "en": "Uranus flyby (only visit)"},
         {"date": "1989-08-25", "zh": "掠过海王星（唯一到访）", "en": "Neptune flyby (only visit)"},
         {"date": "2018-11-05", "zh": "冲出日球层，进入星际空间", "en": "Entered interstellar space"},
     ]},
]


def fetch(command, start, stop):
    params = {
        'format': 'text',
        'COMMAND': f"'{command}'",
        'OBJ_DATA': "'NO'",
        'MAKE_EPHEM': "'YES'",
        'EPHEM_TYPE': "'VECTORS'",
        'CENTER': "'500@10'",       # Sun (body center) -> heliocentric
        'REF_PLANE': "'ECLIPTIC'",  # ecliptic J2000 frame
        'VEC_TABLE': "'1'",         # position only (X, Y, Z)
        'OUT_UNITS': "'AU-D'",      # AU and days
        'START_TIME': f"'{start}'",
        'STOP_TIME': f"'{TODAY if stop == 'NOW' else stop}'",
        'STEP_SIZE': f"'{STEP_DAYS} d'",
        'CSV_FORMAT': "'YES'",
        'VEC_LABELS': "'NO'",
    }
    url = API + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': 'cosmic-photo-explorer/1.0'})
    return urllib.request.urlopen(req, timeout=90).read().decode()


def parse(text):
    """Return list of [x, y, z] in AU, in time order (uniform STEP_DAYS)."""
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
        # VECTORS CSV (VEC_TABLE=1, VEC_LABELS=NO): JDTDB, CalDate, X, Y, Z
        if len(parts) < 5:
            continue
        try:
            x, y, z = float(parts[2]), float(parts[3]), float(parts[4])
        except ValueError:
            continue
        rows.append([round(x, 4), round(y, 4), round(z, 4)])
    return rows


def main():
    out = []
    for probe in PROBES:
        text = fetch(probe['command'], probe['start'], probe['stop'])
        path = parse(text)
        if not path:
            note = [l for l in text.splitlines() if 'No ephemeris' in l or 'Cannot' in l
                    or 'insufficient' in l.lower()][:2]
            print(f"WARN {probe['id']}: no rows. Horizons said: {note}")
            continue
        start_date = datetime.date.fromisoformat(probe['start'])
        n = len(path)
        # Attach real position + timeline fraction to each milestone.
        milestones = []
        for m in probe['milestones']:
            d = datetime.date.fromisoformat(m['date'])
            idx = round((d - start_date).days / STEP_DAYS)
            idx = max(0, min(n - 1, idx))
            milestones.append({
                'date': m['date'], 'zh': m['zh'], 'en': m['en'],
                't': round(idx / (n - 1), 5),
                'pos': path[idx],
                'r_au': round((path[idx][0] ** 2 + path[idx][1] ** 2 + path[idx][2] ** 2) ** 0.5, 2),
            })
        last = path[-1]
        dist_now = round((last[0] ** 2 + last[1] ** 2 + last[2] ** 2) ** 0.5, 1)
        out.append({
            'id': probe['id'],
            'label': probe['label'],
            'label_en': probe['label_en'],
            'start': probe['start'],
            'end': TODAY if probe['stop'] == 'NOW' else probe['stop'],
            'step_days': STEP_DAYS,
            'samples': n,
            'dist_au': dist_now,
            'path': path,
            'milestones': milestones,
        })
        print(f"{probe['id']}: {n} samples, now {dist_now} AU from Sun, "
              f"{len(milestones)} milestones "
              f"(first r={milestones[0]['r_au']} AU, last r={milestones[-1]['r_au']} AU)")
    text = json.dumps(out, ensure_ascii=False) + '\n'
    for p in ['data/probe_vectors.json', 'app/public/data/probe_vectors.json']:
        pathlib.Path(p).write_text(text)
    print(f"wrote {len(out)} probes to data/probe_vectors.json + app/public copy")


if __name__ == '__main__':
    main()
