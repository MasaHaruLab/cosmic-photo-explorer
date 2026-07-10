---
name: constellation-3d
description: >-
  Build an interactive 3D viewer that reveals a constellation as an illusion of
  perspective — stars placed at their true distances so the familiar figure only
  appears from Earth's viewpoint and pulls apart when you orbit away. Use this
  whenever someone wants to "show a constellation in 3D", "stars at their real
  distances", a "北斗七星/星座 3D" viewer, a "constellations are a trick of
  perspective" demo, a depth/parallax star visualization, or to add another
  constellation (Orion, Cassiopeia, …) to an existing viewer. Also use it when a
  sky map only shows the flat Earth view and the user asks to "rotate" or "see
  the real spatial relationship" of the stars.
---

# Constellation 3D — the perspective-illusion viewer

## The one idea

A constellation is not an object. It is seven-ish unrelated stars at wildly
different distances that happen to line up into a shape **from Earth, and only
from Earth**. Place each star at its true 3D position and one thing falls out for
free: viewed from the origin (Earth), they project into the familiar figure;
orbit the camera even a little and the figure distorts, because the stars were
never near each other. **Keep the connecting lines attached the whole time** —
watching a line stretch as two stars separate in depth is far more intuitive than
making the lines vanish. That contrast *is* the payload; everything else is
framing it well.

The Big Dipper is the canonical first example: its two end stars (Dubhe 123 ly,
Alkaid 104 ly) are genuinely not part of the Ursa Major moving group that holds
the middle five near ~80 ly, so they swing out first — the visualization teaches
real astronomy, not a gimmick.

## How it works (the method)

1. **Data** — for each star: `ra` and `dec` in degrees (J2000), `dist` in
   light-years, `mag` (apparent magnitude), plus display names. And a list of
   `[a,b]` id pairs = the stick-figure lines. See `references/data.md` for the
   format, the ready-made Big Dipper set, and where to source others.
2. **To 3D** — equatorial → Cartesian, 1 unit = 1 ly:
   `x = d·cosδ·cosα, y = d·cosδ·sinα, z = d·sinδ` (α, δ in radians). Because the
   direction of each star from the origin is exactly its (ra, dec), the view from
   `(0,0,0)` reproduces the real sky pattern with no extra work.
3. **Earth view** — put the camera **at the origin**, target = the stars'
   centroid. That single position is the recognizable figure. Orbit (OrbitControls
   around the centroid) moves the camera off Earth's line of sight → the shape
   distorts. Depth only ever shows once you leave the origin.
4. **Lines stay connected** — build them once from the fixed 3D points as
   `LineSegments`. Nothing about the geometry changes when you orbit; only the
   camera moves, so the same lines read as a clean figure from Earth and a skewed
   tangle from the side.
5. **Frame the lesson** — a live status line ("you're on Earth" vs "you've left
   Earth"), a "back to Earth's view" reset, and an optional set of Earth→star
   sightlines as a depth cue. Bilingual labels with distances on each star.

`references/template.html` is a complete, self-contained, drop-in implementation
(one constellation config block at the top; swap it to retarget). Start from it.

## Adding another constellation

Append a second dataset (id, line pairs) and a picker; the engine is identical.
`references/data.md` has Orion and Cassiopeia to get going. Orion is the crowd-
pleaser after the Dipper — its stars span ~250 to ~2000 ly, so it detonates
spectacularly when you orbit.

## Hard-won implementation notes

- **Sprite size is deceptive.** Stars at ~85 units with a 46° FOV: a sprite of
  world-size ~12 fills ~a sixth of the screen (giant fuzzy blobs). Size them
  small — roughly `2 + (3.4 - mag)` world units — so they read as crisp points
  and the lines stay visible. Verify with a screenshot; the math lies about scale.
- **The reset button must flush orbit momentum.** With `enableDamping` on, there
  is residual `sphericalDelta` after a drag; just setting `camera.position` and
  calling `update()` lets the leftover spin drag the camera back off Earth. Fix:
  `enableDamping = false; controls.update();` (zeros the delta) → set position to
  origin, `controls.target` to centroid, `update()` again → restore damping.
- **Camera exactly at the origin is a feature.** A front-side Earth marker sphere
  at the origin is invisible while you're on Earth (you see its back faces, culled)
  and appears as a reference point the moment you orbit away — no special-casing.
- **Self-host the engine.** Vendor `three.min.js` + `OrbitControls.js` (r128 UMD
  attaches `THREE.OrbitControls`) and load them locally. No CDN — the whole viewer
  is then dependency-free and works offline / behind restrictive networks.
- **Testing the orbit is fragile in automation.** OrbitControls calls
  `setPointerCapture`, which throws on a *synthetic* `pointerId`, so scripted
  PointerEvents don't drive it — you need a real trusted drag (e.g. a devtools
  `left_click_drag`), and even that can jam a CDP session's mouse state after a
  few tries. Verify the Earth view and one real drag with screenshots, confirm the
  rest by reading label/camera state, and hand the reset button to a human to
  click. Don't burn a dozen calls fighting a stuck input pipeline.
- **Render on demand, not every frame.** The scene is static — only the camera moves.
  A naive `requestAnimationFrame` loop that always `renderer.render`s pins a CPU core at
  60fps and the page feels "super laggy" / gets hot even while sitting still. Fix: a
  `dirty` flag set by `controls.addEventListener('change', …)` (fires on drag, zoom, and
  every damping step), by toggles, and by resize; the rAF loop still runs `controls.update()`
  each frame but only draws when `dirty`. Idle → zero draw calls. Also cap
  `renderer.setPixelRatio` at ~1.5 by default and expose a manual **HD toggle** (bump to the
  full `devicePixelRatio`) for anyone who wants 4K and doesn't mind the cost.
- **Accuracy matters.** Positions and distances are real science — source them
  from Hipparcos/HYG (see `references/data.md`), cite the catalogue, and mark any
  approximate values (Orion's belt distances carry large uncertainty) rather than
  presenting a guess as fact.
