import './style.css'

const anchorsUrl = '/data/anchors/phase1.json'

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
          <img
            class="hero-image"
            src="/hero/reference-superlinear-gaia.jpg"
            alt="Photoreal Milky Way overview reference"
          />
          <div class="hero-overlay"></div>
          <div class="anchor-layer" data-anchor-layer></div>
          <div class="hero-caption">
            <div class="hero-kicker">Photoreal hero view / reference-backed</div>
            <h2>Milky Way overview</h2>
            <p>
              The stage now supports low-noise target anchors so the image can start becoming explorable
              without collapsing into a toy-looking demo.
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
          <div class="panel-value">Anchor overlay enabled on the hero image</div>
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
          <div class="panel-value" data-panel-next>Click a target. Next batch will turn selection into cinematic zoom.</div>
        </div>
      </aside>
    </main>
  </div>
`

const layer = document.querySelector('[data-anchor-layer]')
const panelTitle = document.querySelector('[data-panel-title]')
const panelSummary = document.querySelector('[data-panel-summary]')
const panelDetails = document.querySelector('[data-panel-details]')
const panelNext = document.querySelector('[data-panel-next]')

let selectedId = null
let anchors = []

function renderPanel(anchor) {
  panelTitle.textContent = anchor.label
  panelSummary.textContent = anchor.summary
  panelDetails.textContent = anchor.details
  panelNext.textContent = anchor.zoomPresetId
    ? `Next batch target: wire ${anchor.zoomPresetId} into the zoom transition system.`
    : 'Next batch target: define a cinematic zoom path for this anchor.'
}

function selectAnchor(anchorId) {
  selectedId = anchorId
  const anchor = anchors.find((item) => item.id === anchorId)
  if (!anchor) return

  for (const button of layer.querySelectorAll('.anchor-hotspot')) {
    button.classList.toggle('is-selected', button.dataset.anchorId === anchorId)
  }

  renderPanel(anchor)
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
  const response = await fetch(anchorsUrl)
  anchors = await response.json()
  selectedId = anchors[0]?.id ?? null
  renderAnchors()
  if (selectedId) selectAnchor(selectedId)
}

init().catch((error) => {
  panelTitle.textContent = 'Anchor load failed'
  panelSummary.textContent = 'Could not load phase-1 anchor metadata.'
  panelDetails.textContent = String(error)
  panelNext.textContent = 'Fix anchor data wiring before continuing to zoom transitions.'
})
