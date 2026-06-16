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
        <div class="hero-placeholder">
          <div class="hero-glow"></div>
          <div class="hero-text">
            <div class="hero-kicker">Photoreal stage placeholder</div>
            <h2>Milky Way overview will land here</h2>
            <p>
              This shell is intentionally image-first. Next batches will replace this placeholder
              with real photoreal scene assets, anchor overlays, and cinematic zoom transitions.
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
          <div class="panel-value">Web shell online</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">Next</div>
          <div class="panel-value">Replace placeholder with photoreal hero asset</div>
        </div>
      </aside>
    </main>
  </div>
`
