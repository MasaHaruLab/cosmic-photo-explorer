# Architecture

Cosmic Photo Explorer is a web-first, photoreal cosmic exploration product.

Phase 1 architecture:
- Runtime: lightweight web explorer focused on image-first navigation
- Asset source: local-first production pipeline
- Interaction: anchor overlays, cinematic zoom, low-noise UI
- Truth model: explicit split between real-data views and speculative views

Primary layers:
1. Photoreal hero imagery / tiled imagery
2. Anchor metadata overlay
3. Camera/navigation state
4. Explanation + boundary UI
5. Local pipeline contract for asset replacement

Non-goals in phase 1:
- full realtime galaxy engine
- desktop product shell
- free-flight space simulator
