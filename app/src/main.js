import './style.css'

const anchorsUrl = 'data/anchors/phase1.json'
const overviewSurvey = 'CDS/P/DM/flux-color-Rp-G-Bp/I/355/gaiadr3'
const closeUpSurvey = 'P/DSS2/color'
const overviewView = { ra: 266.4168, dec: -29.0078, fov: 150 }
const tweenDuration = 2400
const nasaImageQueries = {
  'galactic-center': 'galactic center milky way',
  'antares-region': 'rho ophiuchi',
  'summer-triangle': 'cygnus milky way',
  'cygnus-rift': 'cygnus dark nebula',
  andromeda: 'andromeda galaxy',
  pleiades: 'pleiades',
  'orion-nebula': 'orion nebula',
  'carina-nebula': 'carina nebula',
  lmc: 'large magellanic cloud',
  smc: 'small magellanic cloud',
}

const surveyBoundary = {
  [overviewSurvey]: {
    title: '真实数据 · Gaia DR3 官方全天图',
    copy: '这层底图来自 ESA Gaia DR3 的官方全天渲染，基于约 18 亿颗被实际测量的恒星位置与亮度。它适合做银河的大尺度总览，而不是深空长曝光照片。近距离下它会显出颗粒感——每个亮点都是一颗被单独测量的恒星，这正是“测量图”和“照片”的区别。',
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
      <div class="topbar-actions">
        <div class="badge">银河总览</div>
        <a class="badge badge-link" href="observatories.html">观星台 →</a>
      </div>
    </header>

    <main class="stage-wrap">
      <section class="stage">
        <div class="hero-view">
          <div class="hero-scene" data-hero-scene>
            <div id="sky-view" aria-label="可交互星空视图"></div>
            <div class="hero-overlay"></div>
            <div class="anchor-layer" data-anchor-layer></div>
            <div class="survey-chip" data-survey-chip hidden>
              <button class="survey-option" type="button" data-survey-choice="dss2">DSS2 照片</button>
              <button class="survey-option" type="button" data-survey-choice="gaia">Gaia 测量图</button>
            </div>
          </div>
          <div class="hero-caption" data-hero-caption>
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
          <div class="panel-copy" data-panel-details>
            这里不再只是静态背景，而是可以从真实天空数据进入的探索界面。
          </div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-nasa-open hidden>在 NASA 图库看这里</button>
          </div>
        </div>
        <div class="panel-section">
          <div class="panel-label">边界</div>
          <div class="panel-value panel-boundary-title" data-panel-boundary-title>真实数据 · Gaia DR3 官方全天图</div>
          <div class="panel-copy" data-panel-boundary-copy></div>
        </div>
        <div class="panel-section">
          <div class="panel-label">天区</div>
          <div class="target-list" data-target-list></div>
        </div>
        <div class="panel-section">
          <div class="panel-label">解释层</div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-toggle-bortle aria-expanded="false">光污染阶梯</button>
          </div>
          <div class="explainer-card" data-bortle-card hidden>
            <img src="explainers/bortle_scale.png" alt="Bortle 光污染等级示意图" />
            <p>Bortle 标尺用 1 到 9 级描述夜空黑暗程度，级别越高，城市灯光对星空的遮蔽越明显。今天许多人看不到照片里的银河，主要不是银河消失了，而是城市光污染把它淹没在夜空背景里。</p>
          </div>
          <div class="panel-copy boundary-note">底图边界说明：Gaia 测量的是恒星位置与亮度，不是深空长曝光照片；DSS2 来自上世纪照相底片数字化，近看会保留底片和拼接痕迹。</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">下一步</div>
          <div class="panel-value" data-panel-next>点击一个天区开始拉近。</div>
          <div class="panel-actions">
            <button class="primary-button" type="button" data-tour-toggle>自动漫游</button>
            <button class="ghost-button" type="button" data-reset-view>重置视野</button>
          </div>
        </div>
      </aside>
    </main>
  </div>
  <div class="modal-backdrop" data-nasa-modal hidden>
    <section class="nasa-modal" role="dialog" aria-label="NASA 图库">
      <div class="nasa-modal-header">
        <h3 data-nasa-title>NASA 图库</h3>
        <button class="modal-close" type="button" data-nasa-close aria-label="关闭 NASA 图库">×</button>
      </div>
      <div class="nasa-modal-body" data-nasa-content></div>
      <p class="nasa-modal-footer">图片版权归 NASA 及其合作机构所有，点击缩略图直接看大图。</p>
    </section>
  </div>
  <div class="lightbox-backdrop" data-nasa-lightbox hidden>
    <figure class="nasa-lightbox" role="dialog" aria-label="NASA 大图">
      <button class="modal-close lightbox-close" type="button" data-lightbox-close aria-label="关闭大图">×</button>
      <div class="lightbox-stage">
        <div class="nasa-state" data-lightbox-state>正在加载大图…</div>
        <img data-lightbox-img alt="" hidden />
      </div>
      <figcaption class="lightbox-caption">
        <span data-lightbox-title></span>
        <a data-lightbox-nasa-link href="#" target="_blank" rel="noreferrer">在 NASA 页面打开 ↗</a>
      </figcaption>
    </figure>
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
const tourButton = document.querySelector('[data-tour-toggle]')
const bortleButton = document.querySelector('[data-toggle-bortle]')
const bortleCard = document.querySelector('[data-bortle-card]')
const targetList = document.querySelector('[data-target-list]')
const surveyChip = document.querySelector('[data-survey-chip]')
const nasaOpenButton = document.querySelector('[data-nasa-open]')
const nasaModal = document.querySelector('[data-nasa-modal]')
const nasaTitle = document.querySelector('[data-nasa-title]')
const nasaContent = document.querySelector('[data-nasa-content]')
const nasaCloseButton = document.querySelector('[data-nasa-close]')
const nasaLightbox = document.querySelector('[data-nasa-lightbox]')
const nasaLightboxImg = document.querySelector('[data-lightbox-img]')
const nasaLightboxState = document.querySelector('[data-lightbox-state]')
const nasaLightboxTitle = document.querySelector('[data-lightbox-title]')
const nasaLightboxLink = document.querySelector('[data-lightbox-nasa-link]')
const nasaLightboxClose = document.querySelector('[data-lightbox-close]')

let selectedId = null
let anchors = []
let aladin = null
let activeSurvey = overviewSurvey
let surveyMode = 'auto'
let currentView = { ...overviewView }
let activeTween = null
let isTouring = false
let tourTimeoutId = null
let tourToken = 0
const nasaCache = new Map()
let nasaRequestToken = 0

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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function updateSurveyChip() {
  const isCloseView = Number.isFinite(currentView.fov) && currentView.fov < 30
  surveyChip.hidden = !isCloseView

  for (const button of surveyChip.querySelectorAll('.survey-option')) {
    const survey = button.dataset.surveyChoice === 'dss2' ? closeUpSurvey : overviewSurvey
    const isSelected = survey === activeSurvey
    button.classList.toggle('is-selected', isSelected)
    button.setAttribute('aria-pressed', String(isSelected))
  }
}

function setActiveSurvey(nextSurvey) {
  if (!aladin) return
  if (nextSurvey !== activeSurvey) {
    activeSurvey = nextSurvey
    aladin.setImageSurvey(activeSurvey)
  }
  renderBoundary()
  updateSurveyChip()
}

function setSurveyForFov(fov = currentView.fov) {
  if (!aladin || !Number.isFinite(fov)) return
  if (surveyMode === 'manual') {
    updateSurveyChip()
    return
  }

  const nextSurvey = fov < 30 ? closeUpSurvey : fov > 50 ? overviewSurvey : activeSurvey
  setActiveSurvey(nextSurvey)
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
  nasaOpenButton.hidden = !anchor
  renderBoundary()
}

function renderNasaState(message) {
  nasaContent.innerHTML = `<div class="nasa-state">${message}</div>`
}

function renderNasaImages(images) {
  if (!images.length) {
    renderNasaState('这个天区在 NASA 图库里没有直接匹配的照片。')
    return
  }

  nasaContent.innerHTML = `
    <div class="nasa-grid">
      ${images
        .map((image, index) => `
          <button class="nasa-card" type="button" data-nasa-index="${index}">
            <img src="${escapeHtml(image.thumbnail)}" alt="${escapeHtml(image.title)}" loading="lazy" />
            <span>${escapeHtml(image.title)}</span>
          </button>
        `)
        .join('')}
    </div>
  `

  for (const card of nasaContent.querySelectorAll('[data-nasa-index]')) {
    card.addEventListener('click', () => openNasaLightbox(images[Number(card.dataset.nasaIndex)]))
  }
}

// NASA asset URLs encode the size as a suffix (~thumb/~small/~medium/~large/
// ~orig); swapping the suffix yields the direct large-image URL without an
// extra API round trip. Fall back through sizes via the img error handler.
function nasaImageCandidates(image) {
  const sizes = ['~large', '~medium', '~orig']
  const candidates = sizes
    .map((size) => image.thumbnail.replace(/~(thumb|small|medium)(?=\.[a-z]+$)/i, size))
    .filter((url) => url !== image.thumbnail)
  candidates.push(image.thumbnail)
  return [...new Set(candidates)]
}

function openNasaLightbox(image) {
  const candidates = nasaImageCandidates(image)
  let attempt = 0

  nasaLightboxTitle.textContent = image.title
  nasaLightboxLink.href = `https://images.nasa.gov/details/${encodeURIComponent(image.nasaId)}`
  nasaLightboxState.hidden = false
  nasaLightboxState.textContent = '正在加载大图…'
  nasaLightboxImg.hidden = true
  nasaLightboxImg.onload = () => {
    nasaLightboxState.hidden = true
    nasaLightboxImg.hidden = false
  }
  nasaLightboxImg.onerror = () => {
    attempt += 1
    if (attempt < candidates.length) {
      nasaLightboxImg.src = candidates[attempt]
    } else {
      nasaLightboxState.textContent = '大图加载失败，可以去 NASA 页面查看。'
    }
  }
  nasaLightboxImg.src = candidates[0]
  nasaLightbox.hidden = false
}

function closeNasaLightbox() {
  nasaLightbox.hidden = true
  nasaLightboxImg.onload = null
  nasaLightboxImg.onerror = null
  nasaLightboxImg.removeAttribute('src')
}

function normalizeNasaItems(items) {
  return items
    .map((item) => {
      const data = item.data?.[0] ?? {}
      const thumbnail = item.links?.[0]?.href
      if (!thumbnail || !data.nasa_id) return null

      return {
        nasaId: data.nasa_id,
        title: data.title || 'NASA 图像',
        thumbnail,
      }
    })
    .filter(Boolean)
    .slice(0, 6)
}

async function loadNasaImages(anchor, token) {
  if (nasaCache.has(anchor.id)) {
    renderNasaImages(nasaCache.get(anchor.id))
    return
  }

  const query = nasaImageQueries[anchor.id] ?? anchor.label
  const url = new URL('https://images-api.nasa.gov/search')
  url.searchParams.set('q', query)
  url.searchParams.set('media_type', 'image')
  url.searchParams.set('page_size', '6')

  renderNasaState('正在向 NASA 查询…')

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`NASA API returned ${response.status}`)
    const payload = await response.json()
    const images = normalizeNasaItems(payload.collection?.items ?? [])
    nasaCache.set(anchor.id, images)
    if (token === nasaRequestToken) renderNasaImages(images)
  } catch {
    if (token === nasaRequestToken) renderNasaState('查询失败，可能是网络问题。')
  }
}

function closeNasaModal() {
  nasaRequestToken += 1
  nasaModal.hidden = true
}

function openNasaModal() {
  const anchor = anchors.find((item) => item.id === selectedId)
  if (!anchor) return

  const token = nasaRequestToken + 1
  nasaRequestToken = token
  nasaTitle.textContent = `NASA 图库 · ${anchor.label}`
  nasaModal.hidden = false
  loadNasaImages(anchor, token)
}

function updateSelectedButton() {
  for (const button of layer.querySelectorAll('.anchor-hotspot')) {
    button.classList.toggle('is-selected', button.dataset.anchorId === selectedId)
  }
  for (const button of targetList.querySelectorAll('.target-button')) {
    button.classList.toggle('is-selected', button.dataset.anchorId === selectedId)
  }
}

function cancelActiveTween() {
  if (!activeTween) return
  cancelAnimationFrame(activeTween.frameId)
  activeTween = null
}

function clearTourTimeout() {
  if (!tourTimeoutId) return
  clearTimeout(tourTimeoutId)
  tourTimeoutId = null
}

function stopTour(options = {}) {
  const { cancelTween = true } = options
  if (!isTouring && !tourTimeoutId) return

  tourToken += 1
  isTouring = false
  clearTourTimeout()
  if (cancelTween) cancelActiveTween()
  tourButton.textContent = '自动漫游'
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

function selectAnchor(anchorId, options = {}) {
  const { moveSky = true, fromTour = false } = options
  if (!fromTour) {
    stopTour({ cancelTween: true })
  }

  selectedId = anchorId
  const anchor = anchors.find((item) => item.id === anchorId)
  if (!anchor) return

  updateSelectedButton()
  renderPanel(anchor)

  if (moveSky) {
    surveyMode = 'auto'
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

function renderTargetList() {
  targetList.innerHTML = anchors
    .map((anchor) => `
      <button
        class="target-button${anchor.id === selectedId ? ' is-selected' : ''}"
        type="button"
        data-anchor-id="${anchor.id}"
      >
        ${anchor.label}
      </button>
    `)
    .join('')

  for (const button of targetList.querySelectorAll('.target-button')) {
    button.addEventListener('click', () => selectAnchor(button.dataset.anchorId))
  }
}

function finishTour(token) {
  surveyMode = 'auto'
  panelStatus.textContent = '返回总览'
  panelNext.textContent = '漫游结束后可以重新选择任意天区。'
  tweenToView(overviewView, () => {
    if (token !== tourToken) return
    isTouring = false
    clearTourTimeout()
    tourButton.textContent = '自动漫游'
    panelStatus.textContent = '总览模式'
    panelNext.textContent = '点击一个天区开始拉近。'
    setActiveSurvey(overviewSurvey)
    updateHotspotPositions()
  })
}

function visitTourStop(index, token) {
  if (token !== tourToken || !isTouring) return
  if (index >= anchors.length) {
    finishTour(token)
    return
  }

  const anchor = anchors[index]
  surveyMode = 'auto'
  selectAnchor(anchor.id, { moveSky: false, fromTour: true })
  panelStatus.textContent = `漫游中 (${index + 1}/${anchors.length})：${anchor.label}`
  panelNext.textContent = '自动漫游会停留片刻，然后前往下一站。'

  tweenToView({ ...anchor.sky, fov: anchor.fov }, () => {
    if (token !== tourToken || !isTouring) return
    tourTimeoutId = setTimeout(() => {
      tourTimeoutId = null
      visitTourStop(index + 1, token)
    }, 6000)
  })
}

function startTour() {
  if (!anchors.length) return

  stopTour({ cancelTween: true })
  isTouring = true
  tourToken += 1
  tourButton.textContent = '停止漫游'
  visitTourStop(0, tourToken)
}

function toggleTour() {
  if (isTouring) {
    stopTour({ cancelTween: true })
    const selected = anchors.find((item) => item.id === selectedId)
    panelStatus.textContent = selected ? `已停止：${selected.label}` : '已停止漫游'
    panelNext.textContent = '可以继续拖动天空，或重新开始自动漫游。'
    return
  }

  startTour()
}

function resetView() {
  stopTour({ cancelTween: true })
  surveyMode = 'auto'
  panelStatus.textContent = '总览模式'
  panelNext.textContent = '点击一个天区开始拉近。'
  tweenToView(overviewView, () => {
    setActiveSurvey(overviewSurvey)
    updateHotspotPositions()
  })
}

function setManualSurvey(choice) {
  surveyMode = 'manual'
  setActiveSurvey(choice === 'dss2' ? closeUpSurvey : overviewSurvey)
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

function addSummerTriangleOverlay() {
  try {
    const points = [
      [279.2347, 38.7837],
      [310.358, 45.2803],
      [297.6958, 8.8683],
      [279.2347, 38.7837],
    ]
    const overlay = window.A.graphicOverlay({ color: 'rgba(255,255,255,0.3)', lineWidth: 1 })
    aladin.addOverlay(overlay)

    if (typeof window.A.polyline === 'function') {
      overlay.add(window.A.polyline(points))
      return
    }

    if (typeof window.A.line !== 'function') return
    for (let index = 0; index < points.length - 1; index += 1) {
      overlay.add(window.A.line(points[index], points[index + 1]))
    }
  } catch {
    // The narrative anchors still work if the optional overlay API is unavailable.
  }
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
  addSummerTriangleOverlay()
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
  renderTargetList()
  if (selectedId) {
    selectAnchor(selectedId, { moveSky: false })
  }
  await initAladin()
}

resetButton.addEventListener('click', resetView)
tourButton.addEventListener('click', toggleTour)
bortleButton.addEventListener('click', toggleBortleCard)
nasaOpenButton.addEventListener('click', openNasaModal)
nasaCloseButton.addEventListener('click', closeNasaModal)
nasaModal.addEventListener('click', (event) => {
  if (event.target === nasaModal) closeNasaModal()
})
nasaLightboxClose.addEventListener('click', closeNasaLightbox)
nasaLightbox.addEventListener('click', (event) => {
  if (event.target === nasaLightbox) closeNasaLightbox()
})
window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  if (!nasaLightbox.hidden) {
    closeNasaLightbox()
  } else if (!nasaModal.hidden) {
    closeNasaModal()
  }
})
for (const button of surveyChip.querySelectorAll('.survey-option')) {
  button.addEventListener('click', () => setManualSurvey(button.dataset.surveyChoice))
}

// Hero caption auto-hide: the intro text should never sit on top of the sky
// once the user is exploring. Hide on first interaction or after an idle
// delay; hovering the bottom of the stage brings it back.
const heroCaption = document.querySelector('[data-hero-caption]')
const heroSceneEl = document.querySelector('[data-hero-scene]')
let captionTimer = 0

function hideCaption() {
  heroCaption.classList.add('is-hidden')
}

function showCaption(autoHideAfter) {
  heroCaption.classList.remove('is-hidden')
  clearTimeout(captionTimer)
  if (autoHideAfter) captionTimer = setTimeout(hideCaption, autoHideAfter)
}

heroSceneEl.addEventListener('pointerdown', hideCaption, true)
heroSceneEl.addEventListener('mousemove', (event) => {
  const rect = heroSceneEl.getBoundingClientRect()
  if (event.clientY > rect.top + rect.height * 0.8) {
    showCaption(0)
  } else if (!heroCaption.classList.contains('is-hidden')) {
    clearTimeout(captionTimer)
    captionTimer = setTimeout(hideCaption, 1200)
  }
})
heroSceneEl.addEventListener('mouseleave', () => {
  if (!heroCaption.classList.contains('is-hidden')) {
    clearTimeout(captionTimer)
    captionTimer = setTimeout(hideCaption, 1200)
  }
})
showCaption(6000)

// debug handle for headless QA (read-only introspection)
window.__cosmicDebug = {
  get aladin() { return aladin },
  get currentView() { return currentView },
  get activeSurvey() { return activeSurvey },
  get surveyMode() { return surveyMode },
}

init().catch((error) => {
  panelStatus.textContent = '出错'
  panelTitle.textContent = '锚点或星图加载失败'
  panelSummary.textContent = '无法加载第一阶段的天区数据。'
  panelDetails.textContent = String(error)
  panelNext.textContent = '请先修复数据或 Aladin Lite 加载问题。'
})
