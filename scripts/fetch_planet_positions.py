#!/usr/bin/env python3
"""Bake real planet data for the 深空信使 page:
  - current heliocentric ecliptic position (dot),
  - the real orbit as a 3D polyline at its true inclination (ring),
so the planets sit on tilted, non-coplanar orbits — the way they really are —
instead of a fake flat disc.

Same frame as fetch_probe_vectors.py (ecliptic J2000, Sun-centered, AU).

Usage: python3 scripts/fetch_planet_positions.py
Writes data/planets.json and app/public/data/planets.json.
"""
import json
import math
import pathlib
import urllib.parse
import urllib.request

API = 'https://ssd.jpl.nasa.gov/api/horizons.api'
REF_DATE = '2026-07-06'  # same "now" as the probes' current positions
ORBIT_POINTS = 160       # samples around each orbit ellipse

PLANETS = [
    {"id": "mercury", "command": "199", "zh": "水星", "en": "Mercury"},
    {"id": "venus",   "command": "299", "zh": "金星", "en": "Venus"},
    {"id": "earth",   "command": "399", "zh": "地球", "en": "Earth"},
    {"id": "mars",    "command": "499", "zh": "火星", "en": "Mars"},
    {"id": "jupiter", "command": "599", "zh": "木星", "en": "Jupiter"},
    {"id": "saturn",  "command": "699", "zh": "土星", "en": "Saturn"},
    {"id": "uranus",  "command": "799", "zh": "天王星", "en": "Uranus"},
    {"id": "neptune", "command": "899", "zh": "海王星", "en": "Neptune"},
]


def horizons(command, ephem_type, extra):
    params = {
        'format': 'text',
        'COMMAND': f"'{command}'",
        'OBJ_DATA': "'NO'",
        'MAKE_EPHEM': "'YES'",
        'EPHEM_TYPE': f"'{ephem_type}'",
        'CENTER': "'500@10'",       # Sun (body center) -> heliocentric
        'REF_PLANE': "'ECLIPTIC'",  # ecliptic J2000 frame
        'OUT_UNITS': "'AU-D'",
        'START_TIME': f"'{REF_DATE}'",
        'STOP_TIME': "'2026-07-08'",
        'STEP_SIZE': "'1 d'",
        'CSV_FORMAT': "'YES'",
        **extra,
    }
    url = API + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': 'cosmic-photo-explorer/1.0'})
    return urllib.request.urlopen(req, timeout=60).read().decode()


def first_data_row(text):
    inside = False
    for line in text.splitlines():
        if line.startswith('$$SOE'):
            inside = True
            continue
        if line.startswith('$$EOE'):
            break
        if inside:
            return [p.strip() for p in line.split(',')]
    return None


def position(command):
    # VECTORS, position only: cols JDTDB, CalDate, X, Y, Z
    row = first_data_row(horizons(command, 'VECTORS', {'VEC_TABLE': "'1'", 'VEC_LABELS': "'NO'"}))
    return [round(float(row[2]), 4), round(float(row[3]), 4), round(float(row[4]), 4)]


def elements(command):
    # ELEMENTS CSV cols: JDTDB, CalDate, EC, QR, IN, OM, W, Tp, N, MA, TA, A, AD, PR
    row = first_data_row(horizons(command, 'ELEMENTS', {}))
    return {
        'e': float(row[2]),
        'i': math.radians(float(row[4])),   # inclination
        'om': math.radians(float(row[5])),  # longitude of ascending node (Ω)
        'w': math.radians(float(row[6])),   # argument of periapsis (ω)
        'a': float(row[11]),                # semi-major axis
    }


def orbit_polyline(el):
    """Real orbit as ecliptic 3D points via Rz(Ω)·Rx(i)·Rz(ω)·[perifocal]."""
    a, e, i, om, w = el['a'], el['e'], el['i'], el['om'], el['w']
    ci, si = math.cos(i), math.sin(i)
    co, so = math.cos(om), math.sin(om)
    pts = []
    for k in range(ORBIT_POINTS):
        nu = 2 * math.pi * k / ORBIT_POINTS               # true anomaly
        r = a * (1 - e * e) / (1 + e * math.cos(nu))
        # perifocal, then rotate by ω in-plane
        u = w + nu
        cu, su = math.cos(u), math.sin(u)
        xp, yp = r * cu, r * su
        # Rz(Ω)·Rx(i) applied to (xp, yp, 0)
        x = co * xp - so * ci * yp
        y = so * xp + co * ci * yp
        z = si * yp
        pts.append([round(x, 4), round(y, 4), round(z, 4)])
    return pts


def main():
    out = []
    for p in PLANETS:
        pos = position(p['command'])
        el = elements(p['command'])
        orbit = orbit_polyline(el)
        r = round(math.sqrt(sum(c * c for c in pos)), 3)
        out.append({
            'id': p['id'], 'zh': p['zh'], 'en': p['en'],
            'a_au': round(el['a'], 3),
            'incl_deg': round(math.degrees(el['i']), 2),
            'pos': pos,
            'orbit': orbit,
        })
        print(f"{p['id']:8} a={el['a']:.3f} AU  incl={math.degrees(el['i']):.2f}°  "
              f"pos={pos} r={r} AU  orbit={len(orbit)}pts")
    text = json.dumps({'epoch': REF_DATE, 'planets': out}, ensure_ascii=False) + '\n'
    for path in ['data/planets.json', 'app/public/data/planets.json']:
        pathlib.Path(path).write_text(text)
    print(f"wrote {len(out)} planets @ {REF_DATE} (with real inclined orbits) "
          f"to data/planets.json + app/public copy")


if __name__ == '__main__':
    main()
