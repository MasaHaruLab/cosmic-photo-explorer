# Known probes — Horizons IDs + verified milestones

All radii below are `r_au` = distance from the Sun at that milestone, as fetched from Horizons
(ecliptic-J2000 VECTORS, `CENTER='500@10'`) and cold-verified against the historical record on
2026-07-06. Use these directly; don't re-derive. `start` in `fetch_probe_vectors.py` = launch +1 day
(SPK coverage starts hours after launch — see Pitfall 1).

## On the page (5 probes)

| id | Horizons | launch | `start` (used) | now (2026) |
|----|----------|--------|----------------|------------|
| voyager-1   | `-31` | 1977-09-05 | 1977-09-06 | 171.1 AU |
| voyager-2   | `-32` | 1977-08-20 | 1977-08-21 | 143.3 AU |
| pioneer-10  | `-23` | 1972-03-02 | 1972-03-04 | 141.3 AU |
| pioneer-11  | `-24` | 1973-04-06 | 1973-04-07 | 117.4 AU |
| new-horizons| `-98` | 2006-01-19 | 2006-01-20 |  65.0 AU |

### Verified milestones (date · r_au · zh)

**Voyager 1** — 1979-03-05 · 5.28 · 掠过木星 | 1980-11-12 · 9.52 · 掠过土星 | 1990-02-14 · 40.37 · 回望「暗淡蓝点」 | 2012-08-25 · 121.58 · 冲出日球层，进入星际空间

**Voyager 2** — 1979-07-09 · 5.31 · 掠过木星 | 1981-08-25 · 9.59 · 掠过土星 | 1986-01-24 · 19.13 · 掠过天王星（唯一到访）| 1989-08-25 · 30.19 · 掠过海王星（唯一到访）| 2018-11-05 · 119.01 · 冲出日球层，进入星际空间

**Pioneer 10** — 1973-12-04 · 5.05 · 首航木星（人类首次）| 1983-06-13 · 30.28 · 越过海王星轨道 | 2003-01-23 · 82.12 · 最后一次信号

**Pioneer 11** — 1974-12-03 · 4.97 · 掠过木星 | 1979-09-01 · 9.38 · 首航土星（人类首次）| 1995-11-24 · 44.44 · 最后一次信号

**New Horizons** — 2007-02-28 · 5.36 · 木星引力加速 | 2015-07-14 · 32.89 · 飞掠冥王星（人类首次）| 2019-01-01 · 43.28 · 飞掠阿罗科斯

### Colors in use (keep new probes distinct from these)
voyager-1 `#4fd8ff` cyan · voyager-2 `#9b7bff` violet · pioneer-10 `#ffb454` amber · pioneer-11 `#ff6f91` rose · new-horizons `#66d99a` sea-green

## Candidate probes not yet on the page (Horizons IDs; look up real milestones before adding)

| candidate | Horizons | note |
|-----------|----------|------|
| Parker Solar Probe | `-96` | inward, not outward — closest-approach ("perihelion") milestones instead of flybys; sub-1 AU, may stress the sqrt compression's inner range |
| Ulysses | `-55` | polar solar orbit — a very different shape (out of the ecliptic on purpose) |
| Cassini | `-82` | ended at Saturn (Grand Finale 2017); a bounded arc, not an escape trajectory |
| Galileo | `-77` | ended at Jupiter (2003); bounded arc |
| Juno | `-61` | Jupiter orbiter; bounded |

Note: orbiters/inward probes (Parker, Cassini, Galileo, Juno) don't "fan out and escape" like the five
interstellar-class probes — their story and framing differ. The page's copy assumes escape trajectories;
adding a bounded-orbit probe means rethinking the narrative, not just the data.
