import './style.css'

const anchorsUrl = '/data/anchors/phase1.json'

const zoomPresets = {
  'galactic-center': { scale: 1.85, x: 0.61, y: 0.54 },
  'summer-triangle': { scale: 1.6, x: 0.51, y: 0.37 },
  'solar-system-anchor': { scale: 1.45, x: 0.74, y: 0.57 },
  'antares-region': { scale: 1.72, x: 0.69, y: 0.49 },
}

const app = document.querySelector('#app')

app.innerHTML = `
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
          <div class="hero-scene" data-hero-scene data-zoom-state="overview">
            <img
              class="hero-image"
              src="/hero/reference-superlinear-gaia.jpg"
              alt="Photoreal Milky Way overview reference"
            />
            <div class="hero-overlay"></div>
            <div class="anchor-layer" data-anchor-layer></div>
          </div>
          <div class="hero-caption">
            <div class="hero-kicker">Photoreal hero view / reference-backed</div>
            <h2>Milky Way overview</h2>
            <p>
              The stage now supports a restrained cinematic zoom so anchor selection feels like exploration,
              not a toy overlay sitting on top of a static image.
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
          <div class="panel-value" data-panel-status>Overview mode</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">Selected target</div>
          <div class="panel-value panel-title" data-panel-title>Loading anchors…</div>
          <div class="panel-copy" data-panel-summary></div>
        </div>
        <div class="panel-section">
          <div class="panel-label">Why this matters</div>
          <div class="panel-copy" data-panel-details>
            We are switching from “just a pretty background” to “a guided exploration surface”.
          </div>
        </div>
        <div class="panel-section">
          <div class="panel-label">Next</div>
          <div class="panel-value" data-panel-next>Click a target to begin the first cinematic zoom pass.</div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-reset-view>Reset view</button>
          </div>
        </div>
      </aside>
    </main>
  </div>
`

const layer = document.querySelector('[data-anchor-layer]')
const heroScene = document.querySelector('[data-hero-scene]')
const panelStatus = document.querySelector('[data-panel-status]')
const panelTitle = document.querySelector('[data-panel-title]')
const panelSummary = document.querySelector('[data-panel-summary]')
const panelDetails = document.querySelector('[data-panel-details]')
const panelNext = document.querySelector('[data-panel-next]')
const resetButton = document.querySelector('[data-reset-view]')

let selectedId = null
let anchors = []

function getZoomPreset(anchor) {
  return zoomPresets[anchor.id] ?? {
    scale: 1.55,
    x: anchor.position.x,
    y: anchor.position.y,
  }
}

function applyOverview() {
  heroScene.dataset.zoomState = 'overview'
  heroScene.style.setProperty('--zoom-scale', '1.015')
  heroScene.style.setProperty('--focus-x', '0.5')
  heroScene.style.setProperty('--focus-y', '0.5')
  panelStatus.textContent = 'Overview mode'
  panelNext.textContent = 'Click a target to begin the first cinematic zoom pass.'
}

function applyZoom(anchor) {
  const preset = getZoomPreset(anchor)
  heroScene.dataset.zoomState = 'zoomed'
  heroScene.style.setProperty('--zoom-scale', String(preset.scale))
  heroScene.style.setProperty('--focus-x', String(preset.x))
  heroScene.style.setProperty('--focus-y', String(preset.y))
  panelStatus.textContent = `Zoomed to ${anchor.label}`
  panelNext.textContent = anchor.zoomPresetId
    ? `Zoom preset active: ${anchor.zoomPresetId}`
    : 'Using a first-pass inferred zoom preset from anchor position.'
}

function renderPanel(anchor) {
  panelTitle.textContent = anchor.label
  panelSummary.textContent = anchor.summary
  panelDetails.textContent = anchor.details
}

function selectAnchor(anchorId, options = { applyCinematicZoom: true }) {
  selectedId = anchorId
  const anchor = anchors.find((item) => item.id === anchorId)
  if (!anchor) return

  for (const button of layer.querySelectorAll('.anchor-hotspot')) {
    button.classList.toggle('is-selected', button.dataset.anchorId === anchorId)
  }

  renderPanel(anchor)

  if (options.applyCinematicZoom) {
    applyZoom(anchor)
  }
}

function renderAnchors() {
  layer.innerHTML = anchors
    .map((anchor) => `
      <button
        class="anchor-hotspot${anchor.id === selectedId ? ' is-selected' : ''}"
        type="button"
        data-anchor-id="${anchor.id}"
        style="left:${anchor.position.x * 100}%; top:${anchor.position.y * 100}%;"
        aria-label="${anchor.label}"
        title="${anchor.label}"
      >
        <span class="anchor-dot"></span>
        <span class="anchor-label">${anchor.label}</span>
      </button>
    `)
    .join('')

  for (const button of layer.querySelectorAll('.anchor-hotspot')) {
    button.addEventListener('click', () => selectAnchor(button.dataset.anchorId))
    button.addEventListener('mouseenter', () => {
      const hovered = anchors.find((item) => item.id === button.dataset.anchorId)
      if (hovered) renderPanel(hovered)
    })
  }
}

async function init() {
  applyOverview()
  const response = await fetch(anchorsUrl)
  anchors = await response.json()
  selectedId = anchors[0]?.id ?? null
  renderAnchors()
  if (selectedId) {
    selectAnchor(selectedId, { applyCinematicZoom: false })
  }
}

resetButton.addEventListener('click', () => {
  applyOverview()
  if (selectedId) {
    const anchor = anchors.find((item) => item.id === selectedId)
    if (anchor) renderPanel(anchor)
  }
})

init().catch((error) => {
  panelStatus.textContent = 'Error state'
  panelTitle.textContent = 'Anchor load failed'
  panelSummary.textContent = 'Could not load phase-1 anchor metadata.'
  panelDetails.textContent = String(error)
  panelNext.textContent = 'Fix anchor data wiring before continuing to zoom transitions.'
})
