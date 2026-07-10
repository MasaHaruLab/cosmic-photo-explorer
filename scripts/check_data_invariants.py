#!/usr/bin/env python3
"""Standing instrument: mechanical judge for data/ correctness (loop kit leg 1).

Re-runs the cold-check invariants recorded in HANDOFF (批1a/批3) so any future
data refresh / edit can be gated by `python3 scripts/check_data_invariants.py`.
Exit 0 = green; exit 1 prints every failed invariant.
"""
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FAILS = []


def check(cond, msg):
    if not cond:
        FAILS.append(msg)


def r(pt):
    return math.sqrt(pt[0] ** 2 + pt[1] ** 2 + pt[2] ** 2)


# --- probe_vectors.json ------------------------------------------------------
# Lower bounds = real mission milestones (heliopause / last signal / Arrokoth),
# safe against future re-fetches which only extend the paths outward.
EXPECT = {
    "voyager-1": {"min_end": 121.6, "contact": None},   # heliopause 2012
    "voyager-2": {"min_end": 119.0, "contact": None},   # heliopause 2018
    "pioneer-10": {"min_end": 82.0, "contact": "2003-01-23"},
    "pioneer-11": {"min_end": 44.0, "contact": "1995-11-24"},
    "new-horizons": {"min_end": 43.0, "contact": None},  # Arrokoth 2019
}

pv_path = ROOT / "data" / "probe_vectors.json"
try:
    probes = json.loads(pv_path.read_text())
except Exception as e:  # noqa: BLE001
    print(f"FAIL probe_vectors.json unreadable: {e}")
    sys.exit(1)

ids = {p["id"] for p in probes}
check(ids == set(EXPECT), f"probe ids mismatch: {sorted(ids)}")

for p in probes:
    pid = p["id"]
    exp = EXPECT.get(pid)
    if exp is None:
        continue
    path = p.get("path") or []
    check(len(path) > 100, f"{pid}: path too short ({len(path)})")
    if not path:
        continue
    start_r, end_r = r(path[0]), r(path[-1])
    check(0.95 <= start_r <= 1.10, f"{pid}: start_r={start_r:.3f} not ~1 AU (Earth departure)")
    check(end_r >= exp["min_end"], f"{pid}: end_r={end_r:.1f} < milestone floor {exp['min_end']}")
    check(abs(end_r - p.get("dist_au", -1)) < 0.5, f"{pid}: dist_au={p.get('dist_au')} disagrees with path end {end_r:.1f}")
    check(len(p.get("milestones", [])) >= 3, f"{pid}: <3 milestones")
    check(p.get("last_contact") == exp["contact"], f"{pid}: last_contact={p.get('last_contact')!r}, expected {exp['contact']!r}")
    radii = [r(pt) for pt in path[:: max(1, len(path) // 50)]]
    check(radii[-1] == max(radii), f"{pid}: trajectory not outbound at end (data corruption?)")

# --- other data files: must parse -------------------------------------------
for name in ("planets.json", "probes.json"):
    f = ROOT / "data" / name
    try:
        json.loads(f.read_text())
    except Exception as e:  # noqa: BLE001
        FAILS.append(f"{name} unreadable/invalid: {e}")

if FAILS:
    print(f"RED — {len(FAILS)} invariant(s) failed:")
    for m in FAILS:
        print("  ✗", m)
    sys.exit(1)
print(f"GREEN — {len(probes)} probes, all data invariants hold.")
