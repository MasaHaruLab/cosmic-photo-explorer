# Gaia Local Asset Workflow

This document explains how Gaia-style outputs should enter Cosmic Photo Explorer without coupling the frontend to raw science pipelines.

## Separation of concerns

Reference / research side:
- source repo: `/tmp/gaia_allsky_repo`
- purpose: rendering experiments, scientific exploration, data-heavy processing

Product side:
- target repo: `/Users/ambrosiazheng/cosmic-photo-explorer`
- purpose: runtime-safe assets and product-facing metadata

Do not point the web app at raw Gaia tables.
Do not make the frontend depend on the reference repo being present.

## Asset handoff contract

### 1. Hero image handoff
Place runtime-ready overview imagery under:
- `assets/generated/hero/`

Requirements:
- final or preview JPG/PNG/WebP
- known dimensions
- declared source in `data/manifests/scenes.json`

### 2. Tile handoff
When deeper zoom is needed, export tiles under:
- `assets/generated/tiles/<scene-id>/...`

Requirements:
- stable root path
- declared min/max level
- declared tile size

### 3. Zoom path handoff
If the reference workflow generates crop windows or camera states, translate them into:
- `data/manifests/zoom-paths.json`

Phase 1 still allows simple inferred presets in frontend code, but the desired direction is manifest-backed zoom paths.

### 4. Interpretation handoff
Boundary notes, observational caveats, and truth labels belong in:
- `data/manifests/interpretation.json`

## Recommended replacement procedure

1. create or update source imagery locally
2. export runtime-safe derivatives
3. place them in `assets/generated/...`
4. update manifests in `data/manifests/`
5. run `python3 scripts/prepare_runtime_assets.py --sync-manifests`
6. verify app build and runtime preview

## Product truth rule

Science pipeline output does not become product truth until:
- it is copied into runtime-facing paths
- manifests are updated
- the web app resolves the new assets successfully
