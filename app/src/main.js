import './style.css'

const anchorsUrl = '/data/anchors/phase1.json'
const overviewSurvey = 'CDS/P/DM/flux-color-Rp-G-Bp/I/355/gaiadr3'
const closeUpSurvey = 'P/DSS2/color'
const overviewView = { ra: 266.4168, dec: -29.0078, fov: 150 }
const tweenDuration = 2400

const surveyBoundary = {
  [overviewSurvey]: {
    title: '真实数据 · Gaia DR3 官方全天图',
    copy: '这层底图来自 ESA Gaia DR3 的官方全天渲染，基于约 18 亿颗被实际测量的恒星位置与亮度。它适合做银河的大尺度总览，而不是深空长曝光照片。',
  },
  [closeUpSurvey]: {
    title: '真实数据 · DSS2 巡天照片',
    copy: '这层底图来自 DSS2 数字化巡天照片，放大到具体天区时能看到真实照相底片记录下的星场。它更适合近距离查看星云、暗云和密集星区。',
  },
}

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <div>
        <div class="eyebrow">第一阶段 / 真实数据模式</div>
        <h1>星空照片探索器</h1>
        <p class="subtitle">从真实巡天数据进入银河：先看整片天空，再拉近到可以辨认的天区。</p>
      </div>
      <div class="badge">银河总览</div>
    </header>

    <main class="stage-wrap">
      <section class="stage">
        <div class="hero-view">
          <div class="hero-scene" data-hero-scene>
            <div id="sky-view" aria-label="可交互星空视图"></div>
            <div class="hero-overlay"></div>
            <div class="anchor-layer" data-anchor-layer></div>
          </div>
          <div class="hero-caption">
            <div class="hero-kicker">真实天空 / 可交互巡天底图</div>
            <h2>把银河拉近</h2>
            <p>拖动天空可以自由探索，点击标记会把视野平滑带到对应天区。总览使用 Gaia DR3，近距离自动切到 DSS2。</p>
          </div>
        </div>
      </section>

      <aside class="panel">
        <div class="panel-section">
          <div class="panel-label">模式</div>
          <div class="panel-value">真实数据底图</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">状态</div>
          <div class="panel-value" data-panel-status>总览模式</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">当前目标</div>
          <div class="panel-value panel-title" data-panel-title>正在加载锚点…</div>
          <div class="panel-copy" data-panel-summary></div>
        </div>
        <div class="panel-section">
          <div class="panel-label">为什么值得看</div>
          <div class="panel-copy" data-panel-details>
            这里不再只是静态背景，而是可以从真实天空数据进入的探索界面。
          </div>
        </div>
        <div class="panel-section">
          <div class="panel-label">边界</div>
          <div class="panel-value panel-boundary-title" data-panel-boundary-title>真实数据 · Gaia DR3 官方全天图</div>
          <div class="panel-copy" data-panel-boundary-copy></div>
        </div>
        <div class="panel-section">
          <div class="panel-label">解释层</div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-toggle-bortle aria-expanded="false">光污染阶梯</button>
          </div>
          <div class="explainer-card" data-bortle-card hidden>
            <img src="/explainers/bortle_scale.png" alt="Bortle 光污染等级示意图" />
            <p>Bortle 标尺用 1 到 9 级描述夜空黑暗程度，级别越高，城市灯光对星空的遮蔽越明显。今天许多人看不到照片里的银河，主要不是银河消失了，而是城市光污染把它淹没在夜空背景里。</p>
          </div>
          <div class="panel-copy boundary-note">底图边界说明：Gaia 测量的是恒星位置与亮度，不是深空长曝光照片；DSS2 来自上世纪照相底片数字化，近看会保留底片和拼接痕迹。</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">下一步</div>
          <div class="panel-value" data-panel-next>点击一个天区开始拉近。</div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-reset-view>重置视野</button>
          </div>
        </div>
      </aside>
    </main>
  </div>
`

const layer = document.querySelector('[data-anchor-layer]')
const panelStatus = document.querySelector('[data-panel-status]')
const panelTitle = document.querySelector('[data-panel-title]')
const panelSummary = document.querySelector('[data-panel-summary]')
const panelDetails = document.querySelector('[data-panel-details]')
const panelBoundaryTitle = document.querySelector('[data-panel-boundary-title]')
const panelBoundaryCopy = document.querySelector('[data-panel-boundary-copy]')
const panelNext = document.querySelector('[data-panel-next]')
const resetButton = document.querySelector('[data-reset-view]')
const bortleButton = document.querySelector('[data-toggle-bortle]')
const bortleCard = document.querySelector('[data-bortle-card]')

let selectedId = null
let anchors = []
let aladin = null
let activeSurvey = overviewSurvey
let currentView = { ...overviewView }
let activeTween = null

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2
}

function normalizeRa(ra) {
  return ((ra % 360) + 360) % 360
}

function interpolateRa(startRa, endRa, progress) {
  const delta = ((endRa - startRa + 540) % 360) - 180
  return normalizeRa(startRa + delta * progress)
}

function interpolateLog(start, end, progress) {
  return Math.exp(Math.log(start) + (Math.log(end) - Math.log(start)) * progress)
}

function getAladinCenter() {
  if (!aladin || typeof aladin.getRaDec !== 'function') return null
  // getRaDec returns an array-like, not an Array — index it directly.
  const value = aladin.getRaDec()
  if (!value) return null
  const ra = Number(value[0])
  const dec = Number(value[1])
  return Number.isFinite(ra) && Number.isFinite(dec) ? { ra: normalizeRa(ra), dec } : null
}

function getAladinFov() {
  if (!aladin) return null
  const getter = typeof aladin.getFoV === 'function' ? aladin.getFoV : aladin.getFov
  if (typeof getter !== 'function') return null
  // getFov returns [fovX, fovY]; setFoV drives fovX, and fovY saturates at
  // 180° on portrait stages — track fovX only or wide views read as 180.
  const value = getter.call(aladin)
  const fov = value && typeof value === 'object' ? Number(value[0]) : Number(value)
  return Number.isFinite(fov) && fov > 0 ? fov : null
}

function syncCurrentView() {
  const center = getAladinCenter()
  const fov = getAladinFov()
  if (center) {
    currentView.ra = center.ra
    currentView.dec = center.dec
  }
  if (fov) {
    currentView.fov = fov
  }
}

function renderBoundary() {
  const boundary = surveyBoundary[activeSurvey] ?? surveyBoundary[overviewSurvey]
  panelBoundaryTitle.textContent = boundary.title
  panelBoundaryCopy.textContent = boundary.copy
}

function setSurveyForFov(fov = currentView.fov) {
  if (!aladin || !Number.isFinite(fov)) return

  const nextSurvey = fov < 30 ? closeUpSurvey : fov > 50 ? overviewSurvey : activeSurvey
  if (nextSurvey === activeSurvey) return

  activeSurvey = nextSurvey
  aladin.setImageSurvey(activeSurvey)
  renderBoundary()
}

function updateHotspotPositions() {
  if (!aladin || !anchors.length) return

  const rect = layer.getBoundingClientRect()
  for (const anchor of anchors) {
    const button = layer.querySelector(`[data-anchor-id="${anchor.id}"]`)
    if (!button || !anchor.sky) continue

    // world2pix returns an array-like (not Array) on hit, undefined when the
    // point is outside the projection — so index it, don't Array.isArray it.
    const pixel = aladin.world2pix(anchor.sky.ra, anchor.sky.dec)
    const x = pixel ? Number(pixel[0]) : Number.NaN
    const y = pixel ? Number(pixel[1]) : Number.NaN
    const isVisible = Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= rect.width && y <= rect.height

    button.style.left = `${x}px`
    button.style.top = `${y}px`
    button.style.visibility = isVisible ? 'visible' : 'hidden'
  }
}

function refreshSkyState() {
  syncCurrentView()
  setSurveyForFov()
  updateHotspotPositions()
}

function renderPanel(anchor) {
  panelTitle.textContent = anchor.label
  panelSummary.textContent = anchor.summary
  panelDetails.textContent = anchor.details
  renderBoundary()
}

function updateSelectedButton() {
  for (const button of layer.querySelectorAll('.anchor-hotspot')) {
    button.classList.toggle('is-selected', button.dataset.anchorId === selectedId)
  }
}

function cancelActiveTween() {
  if (!activeTween) return
  cancelAnimationFrame(activeTween.frameId)
  activeTween = null
}

function applySkyView(view) {
  if (!aladin) return
  currentView = {
    ra: normalizeRa(view.ra),
    dec: view.dec,
    fov: view.fov,
  }
  aladin.gotoRaDec(currentView.ra, currentView.dec)
  aladin.setFoV(currentView.fov)
  setSurveyForFov(currentView.fov)
  updateHotspotPositions()
}

function tweenToView(targetView, onComplete) {
  if (!aladin) return
  cancelActiveTween()
  syncCurrentView()

  const startView = { ...currentView }
  const startedAt = performance.now()
  activeTween = { frameId: 0 }

  function step(now) {
    const rawProgress = Math.min((now - startedAt) / tweenDuration, 1)
    const progress = easeInOutCubic(rawProgress)
    const nextView = {
      ra: interpolateRa(startView.ra, targetView.ra, progress),
      dec: startView.dec + (targetView.dec - startView.dec) * progress,
      fov: interpolateLog(startView.fov, targetView.fov, progress),
    }

    applySkyView(nextView)

    if (rawProgress < 1) {
      activeTween.frameId = requestAnimationFrame(step)
      return
    }

    applySkyView(targetView)
    activeTween = null
    onComplete?.()
  }

  activeTween.frameId = requestAnimationFrame(step)
}

function selectAnchor(anchorId, options = { moveSky: true }) {
  selectedId = anchorId
  const anchor = anchors.find((item) => item.id === anchorId)
  if (!anchor) return

  updateSelectedButton()
  renderPanel(anchor)

  if (options.moveSky) {
    panelStatus.textContent = `已拉近：${anchor.label}`
    panelNext.textContent = '可以继续拖动天空，或切换到另一个天区。'
    tweenToView({ ...anchor.sky, fov: anchor.fov }, updateHotspotPositions)
  }
}

function renderAnchors() {
  layer.innerHTML = anchors
    .map((anchor) => `
      <button
        class="anchor-hotspot${anchor.id === selectedId ? ' is-selected' : ''}"
        type="button"
        data-anchor-id="${anchor.id}"
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
    button.addEventListener('mouseleave', () => {
      const selected = anchors.find((item) => item.id === selectedId)
      if (selected) renderPanel(selected)
    })
  }

  updateHotspotPositions()
}

function resetView() {
  panelStatus.textContent = '总览模式'
  panelNext.textContent = '点击一个天区开始拉近。'
  tweenToView(overviewView, () => {
    activeSurvey = overviewSurvey
    aladin.setImageSurvey(activeSurvey)
    renderBoundary()
    updateHotspotPositions()
  })
}

function bindAladinEvents() {
  aladin.on('positionChanged', refreshSkyState)
  aladin.on('zoomChanged', refreshSkyState)
  window.addEventListener('resize', updateHotspotPositions)
}

function toggleBortleCard() {
  const nextOpen = bortleCard.hidden
  bortleCard.hidden = !nextOpen
  bortleButton.setAttribute('aria-expanded', String(nextOpen))
}

async function initAladin() {
  if (!window.A?.init) {
    throw new Error('Aladin Lite 没有加载成功。')
  }

  await window.A.init
  aladin = window.A.aladin('#sky-view', {
    survey: overviewSurvey,
    target: `${overviewView.ra} ${overviewView.dec}`,
    fov: overviewView.fov,
    cooFrame: 'galactic',
    showFullscreenControl: false,
    showLayersControl: false,
    showGotoControl: false,
    showZoomControl: false,
    showFrame: false,
    showCooGrid: false,
    showSimbadPointerControl: false,
  })

  bindAladinEvents()
  // The `target` init option is parsed in the active cooFrame (galactic here),
  // so re-point explicitly: gotoRaDec is always ICRS.
  requestAnimationFrame(() => applySkyView(overviewView))
}

async function init() {
  renderBoundary()
  const response = await fetch(anchorsUrl)
  anchors = await response.json()
  selectedId = anchors[0]?.id ?? null
  renderAnchors()
  if (selectedId) {
    selectAnchor(selectedId, { moveSky: false })
  }
  await initAladin()
}

resetButton.addEventListener('click', resetView)
bortleButton.addEventListener('click', toggleBortleCard)

// debug handle for headless QA (read-only introspection)
window.__cosmicDebug = {
  get aladin() { return aladin },
  get currentView() { return currentView },
  get activeSurvey() { return activeSurvey },
}

init().catch((error) => {
  panelStatus.textContent = '出错'
  panelTitle.textContent = '锚点或星图加载失败'
  panelSummary.textContent = '无法加载第一阶段的天区数据。'
  panelDetails.textContent = String(error)
  panelNext.textContent = '请先修复数据或 Aladin Lite 加载问题。'
})
