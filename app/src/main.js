import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="shell">
    <header class="topbar">
      <div>
        <div class="eyebrow">Phase 1 / Real Mode</div>
        <h1>Cosmic Photo Explorer</h1>
        <p class="subtitle">A photoreal cosmic exploration shell for image-first science storytelling.</p>
      </div>
      <div class="badge">Milky Way Overview</div>
    </header>

    <main class="stage-wrap">
      <section class="stage">
        <div class="hero-view">
          <img
            class="hero-image"
            src="/hero/reference-superlinear-gaia.jpg"
            alt="Photoreal Milky Way overview reference"
          />
          <div class="hero-overlay"></div>
          <div class="hero-caption">
            <div class="hero-kicker">Photoreal hero view / reference-backed</div>
            <h2>Milky Way overview</h2>
            <p>
              The stage now uses a real reference image as the first hero asset instead of a fake placeholder.
              Next batches will add anchor overlays, cinematic zoom transitions, and boundary-aware explanation.
            </p>
          </div>
        </div>
      </section>

      <aside class="panel">
        <div class="panel-section">
          <div class="panel-label">Mode</div>
          <div class="panel-value">Real data layer</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">Status</div>
          <div class="panel-value">Photoreal hero view wired into the shell</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">Next</div>
          <div class="panel-value">Add low-noise target anchors over the hero image</div>
        </div>
      </aside>
    </main>
  </div>
`
