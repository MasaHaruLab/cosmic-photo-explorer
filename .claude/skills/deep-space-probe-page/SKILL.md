---
name: deep-space-probe-page
description: "给『深空信使 / Deep Space Messengers』页加一艘深空探测器，或从零搭一个『真实三维轨迹的太空俯视图』时用——哪怕只说『把新视野号也加上』『再画一艘先驱者』『用真实数据画XX探测器的航迹』『搞个从Horizons抓轨迹的可视化』，没说出skill名也主动触发。核心范式：从 NASA/JPL Horizons 抓真实日心黄道 XYZ 向量 → sqrt 径向压缩把 1 AU 到 170+ AU 塞进一张图 → 弧长匀速播放（不是按时间，否则外段爬行）→ 里程碑按真实日期挂到轨迹上 → 数据驱动 N 船渲染（加船≈加数据+配色，UI 自动长出来）。自带已验证的取数脚本 + 真实踩过的坑清单。触发场景（任一命中就用，中英不限）：往深空信使页加探测器、加旅行者/先驱者/新视野/帕克/尤利西斯、真实航迹可视化、Horizons 星历取轨迹、日心黄道坐标、探测器飞掠里程碑、太空俯视轨迹图、real trajectory space view、add a probe to the messengers page、fan-out trajectories from Earth。反例（别触发）：判动画跳帧/关键帧补哪片走 trajectory-landmark-judgment；首页那张『从地球看的方向』星图是 fetch_probe_paths.py 的地心 RA/Dec，跟本 skill 的日心 XYZ 是两套东西。"
---

# Deep-Space Probe Page（真实轨迹太空俯视图）

Distilled from building the 深空信使 page in **cosmic-photo-explorer** (2026-07): Voyager 1 & 2 → Pioneer 10 & 11 → New Horizons, all on their *real* 3D trajectories fanning out from Earth, past real planets, out to a heliopause dome.

The page exists to keep a beloved animation — *a satellite riding along its path with a timeline scrubber* — but make it scientifically true instead of a decorative squiggle. This skill is how you extend it or rebuild the idea elsewhere.

**Design boundary (learned the hard way, 2026-07).** The probes live *only* on this dedicated top-down (heliocentric) page. An earlier attempt also overlaid their real trajectories onto the homepage's *geocentric* real-sky map (orange ribbons + probe hotspots + a "why a spiral?" parallax card); the CEO found it cluttered and it was removed — mixing a heliocentric spiral onto a geocentric sky read as noise and quietly conflated two different frames. Keep them apart: the homepage links here via a nav badge, and each probe's story is told *here*, in the 「五位信使」panel section (below), not scattered onto the sky map. (The homepage overlay code is parked behind `SHOW_PROBES=false` in `app/src/main.js` for a possible v3, not deleted.)

**Reference implementation (read these before touching anything):**
- `~/Projects/星空探索/cosmic-photo-explorer/scripts/fetch_probe_vectors.py` — the data pipeline (the deterministic tool; just edit its `PROBES` list).
- `~/Projects/星空探索/cosmic-photo-explorer/app/public/messengers.html` — the three.js render (fully data-driven over `probe_vectors.json`).

---

## Part A — Add a probe to the existing page (照单执行)

The render is **data-driven**: `buildDock()` / `renderPicker()` / `renderMileList()` / `renderProbeIntros()` all loop over the probes array, so the transport row, visibility chip, milestone entries, and intro block grow automatically. Adding a probe is almost purely additive.

**Done = the new probe's tube, satellite, milestones, transport row, chip, AND 「五位信使」intro block all appear and play, with physically correct flyby distances.**

1. **Add one entry to `PROBES`** in `fetch_probe_vectors.py`:
   - `command` = the probe's Horizons ID (spacecraft are negative: Voyager 1 `-31`, Voyager 2 `-32`, Pioneer 10 `-23`, Pioneer 11 `-24`, New Horizons `-98`, Parker `-96`, Ulysses `-55`, Cassini `-82`, Galileo `-77`).
   - `start` = launch date **+1 day** (see Pitfall 1), `stop` = `"NOW"`.
   - `milestones` = the *real* closest-approach / boundary-crossing dates (zh + en). Look them up; don't guess.
2. **Run it** and cold-verify the physics: `python3 scripts/fetch_probe_vectors.py`. Check the printed radii against reality — Jupiter flyby ≈ 5 AU, Saturn ≈ 9.5 AU, Neptune's orbit ≈ 30 AU, Pluto ≈ 33 AU, heliopause ≈ 120 AU. A milestone at the wrong radius = wrong date or wrong index. `references/known-probes.md` has verified numbers.
3. **Add four config maps** in `messengers.html` (search each by name):
   - `PROBE_COLORS[id]` — a distinct hex (avoid clashing with cyan `#4fd8ff` / violet `#9b7bff`; CEO dislikes fluorescent green `恶荧光绿`).
   - `PROBE_GLOW[id]` — `['rgba(r,g,b,0.55)', 'rgba(r,g,b,0)']` from the same color. **Required — no fallback; a missing entry crashes the satellite sprite** (Pitfall 2).
   - `PROBE_SECONDS[id]` — traverse duration; `|| 40` default exists, but tune it (Pitfall 3).
   - `PROBE_STORY[id]` — the probe's own intro: `{ summary: {zh, en}, details: {zh, en} }`. `summary` = the one-line hook, `details` = the character sketch (the Pale Blue Dot, the Pioneer plaque, New Horizons flying on after Pluto's demotion — what makes it a *messenger*, not just a line). Renders in the 「五位信使」panel section via `renderProbeIntros()`. A missing entry = a **silently blank intro** (renderProbeIntros skips unknown ids — no crash, just nothing). This is the probe's voice: **write it, don't auto-generate**; it's the one piece of authored copy per probe.
4. **Update the fleet copy** if you changed the probe count — the intro / title / "两艘旅行者" paragraphs are prose, not data. Keep Voyager-only facts (heliopause crossing at ~120 AU) explicitly attributed to the Voyagers.
5. **Verify** — headless WebGL screenshot to confirm all probes render and the dock doesn't overflow (Pitfall 4), then hand a live URL to the human for the motion/aesthetic call (stills can't judge playback).

Because compression, arc-length pacing, milestone attach, camera, and heliopause dome are all shared, the new probe inherits every one of them for free. Don't reimplement them per probe.

---

## Part B — The transferable methodology (rebuild elsewhere)

The reusable core, in the order the data flows:

1. **Fetch real positions, not sky directions.** Horizons `EPHEM_TYPE='VECTORS'`, `CENTER='500@10'` (Sun body center → heliocentric), `REF_PLANE='ECLIPTIC'`, `OUT_UNITS='AU-D'`, `VEC_TABLE='1'` (position only). This gives ecliptic-J2000 X/Y/Z in AU where +Z = ecliptic north — the frame in which probes visibly fan out from a shared ~1 AU origin. (For planets' tilted orbits, `EPHEM_TYPE='ELEMENTS'` gives a/e/i/Ω/ω; draw the ellipse with Rz(Ω)·Rx(i)·Rz(ω)·[perifocal] — see `fetch_planet_positions.py`.)

2. **sqrt radial compression, direction-preserving.** 1 AU (Earth) and 170+ AU (Voyager 1) cannot share one frame linearly. Scale each point's radius by `sqrt`, keep its unit direction: `compress(p) = normalize(p) * BASE * sqrt(|p|)`. Everything spatial (trajectories, planet dots, milestones, heliopause) must pass through the *same* compress() or they won't line up.

3. **Arc-length pacing, not time pacing.** The inner planetary tour is spatially twisty (lots of compressed arc per time-step); the late interstellar cruise is a near-straight slowly-lengthening line. A constant-*time* clock makes the cruise crawl. Instead precompute cumulative *compressed* arc length and advance the satellite linearly in arc — constant on-screen speed. Milestones store their `arcFrac` so "passed?" compares directly against arc-paced progress.

4. **Milestones = real dates snapped to the sample grid.** `idx = round((milestone_date - start) / step_days)`; attach the real position and radius at that index. This is what turns a squiggle into a story ("掠过木星 · 5.28 AU").

5. **Data-driven render.** One JSON array of probes → loop to build tubes (Catmull-Rom through every real sample), satellites, milestone markers, transport rows, chips, and per-probe intro blocks. N probes cost nothing extra in code. This is why Part A is so short. Language toggle re-runs the same render functions (`I18N.onChange` → `renderPicker/renderProbeIntros/renderMileList/buildDock`), so bilingual copy stays a data lookup, never a duplicated DOM.

---

## Pitfalls actually hit (not hypothetical)

1. **SPK coverage starts hours after launch.** Horizons rejects the *whole* request with "No ephemeris for target prior to A.D. <date> <time>" if `START_TIME` is even minutes before coverage. Fix: set `start` to launch date **+1 day**. Losing <1 day at ~1 AU is negligible.
2. **`PROBE_GLOW[id]` has no fallback.** The satellite sprite does `PROBE_GLOW[p.id][0]` — a missing id throws `Cannot read [0] of undefined` and the whole scene fails to build. Always add the glow entry. (`PROBE_COLORS` and `PROBE_SECONDS` do have `||` fallbacks; glow does not.)
3. **Seconds track arc length, not raw distance.** Voyager 2 is *closer* than Voyager 1 but runs *longer* (46 s vs 40 s) because it visited two extra planets → ~15% more compressed arc; equal seconds would make it visibly outrun V1. Tune `PROBE_SECONDS` to keep on-screen speeds matched, or hand the knob to the human.
4. **Headless WebGL needs the right flags.** Plain `--disable-gpu` gives no WebGL (blank). Use `--headless=new --enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader --mute-audio --virtual-time-budget=11000`. This works for messengers.html (self-hosted three.js). It does **not** work for pages pulling an external CDN mid-load (e.g. Aladin on solar.html → blank); use Puppeteer with explicit waits or just verify live there.
5. **Geocentric vs heliocentric is the #1 conceptual trap.** If probes don't share an Earth origin or don't fan out, you're accidentally in a geocentric/sky-direction frame. VECTORS + `CENTER='500@10'` is heliocentric-ecliptic; that's the whole point.
6. **Don't touch the heliopause dome.** `helioSphere` (wireframe SphereGeometry, `rotation.x=π/2`, opacity 0.08) is a CEO favorite — leave it exactly as is when extending.

---

## References

- `references/known-probes.md` — Horizons IDs, launch dates, and verified milestone dates + radii for the probes already on the page and common candidates. Read it before adding a probe so you don't hand-fetch numbers you already have.
