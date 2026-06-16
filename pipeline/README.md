# Pipeline

Local-first asset production entrypoints for Cosmic Photo Explorer.

Goal:
- keep heavy rendering and data prep outside the web runtime
- make asset replacement explicit, repeatable, and low-drama
- bridge Gaia-derived source outputs into lightweight runtime assets

## Phase 1 scope

This phase does not attempt to render Gaia data inside the frontend.
It only defines how locally produced assets enter the runtime.

Current entrypoints:
- `scripts/prepare_runtime_assets.py` — scaffold or refresh runtime-facing directories
- `data/anchors/phase1.json` — phase-1 anchor metadata
- `data/manifests/` — scene / zoom / interpretation manifests
- `docs/gaia-local-asset-workflow.md` — how Gaia-style outputs should flow into this repo

## Expected flow

1. Produce or collect local source assets outside the web app
2. Export hero image(s) into `assets/generated/hero/`
3. Export tile pyramids into `assets/generated/tiles/` when needed
4. Update `data/manifests/scenes.json`
5. Update anchor / zoom / interpretation metadata
6. Run `python3 scripts/prepare_runtime_assets.py --sync-manifests`
7. Verify the web runtime still resolves the active scene

## Non-goals for Phase 1
- no raw Gaia bulk tables in this repo
- no full render farm orchestration
- no irreversible asset mutation scripts

## Reference source
- Gaia reference research repo: `/tmp/gaia_allsky_repo`
- Product implementation repo: `/Users/ambrosiazheng/cosmic-photo-explorer`
