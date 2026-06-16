# Asset Contract

This document defines the runtime-facing asset contract for Cosmic Photo Explorer.

Principle:
- heavy rendering stays local
- runtime consumes lightweight, stable, replaceable assets
- real-data and speculative assets must never be mixed implicitly

## 1. Asset families

### 1.1 Hero imagery
Purpose:
- provide the first photoreal overview frame
- establish the visual truth of the product

Expected form:
- high-resolution image asset
- optional tiled derivative for deep zoom

Contract:
- one manifest entry per hero view
- explicit `mode`: `real` or `speculative`
- explicit `source`
- explicit pixel dimensions

### 1.2 Tile pyramids
Purpose:
- support smooth image-first navigation without forcing realtime regeneration

Expected form:
- multi-scale image tiles
- level-based directory layout

Contract:
- stable tile root path
- declared min/max zoom level
- declared tile size
- declared bounds if cropped

### 1.3 Anchor metadata
Purpose:
- define clickable targets over the photoreal scene

Expected form:
- small JSON documents
- runtime-safe metadata only

Contract:
- stable id
- display name
- anchor kind
- scene coordinates in the target view
- descriptive text
- optional target zoom preset
- explicit truth mode

### 1.4 Zoom path assets
Purpose:
- allow cinematic target approach without inventing motion ad hoc in the frontend

Expected form:
- JSON path presets
- optional supporting stills / crop targets / focal windows

Contract:
- source scene id
- target anchor id
- timing hints
- easing family
- crop window sequence or normalized camera states

### 1.5 Interpretation assets
Purpose:
- explain what the user is seeing and where the data boundary is

Expected form:
- JSON or markdown-backed structured content

Contract:
- scoped to scene or anchor
- explicit truth label
- optional boundary note
- optional scientific caveat

## 2. Runtime directories

```text
data/
  anchors/
    *.json
  manifests/
    scenes.json
    zoom-paths.json
    interpretation.json
assets/
  placeholders/
  generated/
    hero/
    tiles/
```

`assets/generated/` is ignored in git by default unless a small demo subset is intentionally checked in.

## 3. Scene manifest shape

Proposed fields:

```json
{
  "id": "milky-way-overview-real",
  "title": "Milky Way Overview",
  "mode": "real",
  "source": "gaia-derived",
  "image": {
    "type": "single-image",
    "path": "/assets/generated/hero/milky-way-overview-real.jpg",
    "width": 12000,
    "height": 6000
  },
  "tiles": {
    "enabled": false,
    "root": null,
    "tileSize": null,
    "minLevel": null,
    "maxLevel": null
  },
  "initialView": {
    "center": [0.5, 0.5],
    "zoom": 1.0
  }
}
```

Notes:
- `mode` is mandatory
- `source` is mandatory
- image coordinates are normalized unless otherwise declared

## 4. Anchor shape

Proposed fields:

```json
{
  "id": "galactic-center",
  "sceneId": "milky-way-overview-real",
  "label": "Galactic Center",
  "kind": "region",
  "mode": "real",
  "position": {
    "x": 0.61,
    "y": 0.54,
    "space": "normalized-image"
  },
  "summary": "Bright central region of the Milky Way with dense stellar structure.",
  "details": "This target represents the brightest visually dense area in the rendered Milky Way overview.",
  "zoomPresetId": "zoom-galactic-center"
}
```

## 5. Zoom path shape

Proposed fields:

```json
{
  "id": "zoom-galactic-center",
  "sceneId": "milky-way-overview-real",
  "anchorId": "galactic-center",
  "mode": "real",
  "durationMs": 2600,
  "easing": "easeInOutCubic",
  "targetView": {
    "center": [0.61, 0.54],
    "zoom": 4.2
  }
}
```

Phase 1 keeps this intentionally simple.
A later phase may evolve this into full keyframed paths.

## 6. Runtime mode rules

### Real mode
- only uses real-data-derived imagery and metadata
- can include explanation of observational limits
- must not silently borrow speculative textures

### Speculative mode
- must be explicitly marked
- may use inferred or generated assets
- must preserve the same visual language as real mode
- must declare its basis in interpretation content

## 7. Replacement workflow

When replacing assets:
1. generate locally
2. export to `assets/generated/...`
3. update manifests in `data/manifests/`
4. verify runtime still resolves scene, anchors, and zoom targets

## 8. Phase 1 discipline

For phase 1, prefer:
- one hero real scene
- a handful of anchors
- a handful of zoom presets
- explanation content tied to those anchors

Avoid:
- giant all-at-once schemas
- premature generalization
- runtime dependence on raw Gaia bulk data
