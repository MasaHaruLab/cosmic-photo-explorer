import './style.css'
import { UI } from './content.js'

const I18N = window.I18N
I18N.register(UI)

// Resolve a bilingual data field ({ zh, en }) to the active language.
const L = (field) =>
  field && typeof field === 'object' && !Array.isArray(field)
    ? field[I18N.getLang()] ?? field.zh
    : field

function fillTemplate(template, params) {
  let out = template
  for (const name in params) out = out.split('{' + name + '}').join(String(params[name]))
  return out
}

// data.group is a stable Chinese key shared between the anchors, the tour
// checkboxes and getTourStops(); only its display label is localized.
const GROUP_KEYS = {
  '夏季银河': 'tour.group.summer',
  '秋冬星空': 'tour.group.autumn',
  '南天深空': 'tour.group.south',
  '深空信使': 'tour.group.probes',
}
function groupLabel(group) {
  return GROUP_KEYS[group] ? I18N.t(GROUP_KEYS[group]) : group
}

const PROBE_LABELS = {
  'voyager-1': { zh: '旅行者 1 号', en: 'Voyager 1' },
  'voyager-2': { zh: '旅行者 2 号', en: 'Voyager 2' },
  'pioneer-10': { zh: '先驱者 10 号', en: 'Pioneer 10' },
  'pioneer-11': { zh: '先驱者 11 号', en: 'Pioneer 11' },
  'new-horizons': { zh: '新视野号', en: 'New Horizons' },
}

const anchorsUrl = 'data/anchors/phase1.json'
const probesUrl = 'data/probes.json'
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
  'winter-triangle': 'winter milky way',
  sirius: 'sirius star',
  horsehead: 'horsehead nebula',
  rosette: 'rosette nebula',
  hyades: 'hyades',
  m35: 'Messier 35',
  'crux-coalsack': 'coalsack nebula',
  'omega-centauri': 'omega centauri',
  '47-tucanae': '47 tucanae',
  tarantula: 'tarantula nebula',
  'alpha-centauri': 'alpha centauri',
  'vela-snr': 'vela supernova remnant',
  'voyager-1': 'voyager spacecraft',
  'voyager-2': 'voyager 2',
  'pioneer-10': 'pioneer 10',
  'pioneer-11': 'pioneer 11 saturn',
  'new-horizons': 'new horizons pluto',
}

// Deep-space probe narratives; distance line is appended at load time from
// the baked Horizons data.
const probeCopy = {
  'voyager-1': {
    summary: {
      zh: '人类飞得最远的造物。1977 年出发，现在在 255 亿公里外，仍在用微弱的信号回话。',
      en: 'The most distant object humanity has ever built. Launched in 1977, it is now 25.5 billion kilometres away and still answering with a faint signal.',
    },
    details: {
      zh: '1990 年它回头拍了那张《暗淡蓝点》——地球只是一粒悬浮在阳光里的尘埃。2012 年它穿出日球层，成为第一个进入星际空间的人造物。丝带上的年度小波浪不是它在抖，是地球带着我们绕太阳转圈的视差——证据就画在天上。',
      en: 'In 1990 it turned back to take the “Pale Blue Dot” — Earth reduced to a mote suspended in a sunbeam. In 2012 it crossed the heliopause to become the first human-made object in interstellar space. The small yearly waves along its ribbon aren’t the probe trembling; they are the parallax of Earth carrying us around the Sun — the proof written across the sky.',
    },
  },
  'voyager-2': {
    summary: {
      zh: '唯一近距离看过天王星和海王星的探测器，比 1 号还早出发两周。',
      en: 'The only probe ever to see Uranus and Neptune up close — and it launched two weeks before Voyager 1.',
    },
    details: {
      zh: '它走了一条更贪心的路线：木星、土星、天王星、海王星四连访，至今无人重复。2018 年它也进入了星际空间。现在朝着南天的孔雀座方向飞去。',
      en: 'It took the greedier route: a grand tour of Jupiter, Saturn, Uranus and Neptune that no craft has repeated since. In 2018 it too entered interstellar space. It is now heading toward Pavo, the Peacock, in the southern sky.',
    },
  },
  'pioneer-10': {
    summary: {
      zh: '第一个穿过小行星带、第一个近距离看木星的探测器，1972 年出发。',
      en: 'The first probe to cross the asteroid belt and the first to see Jupiter up close, launched in 1972.',
    },
    details: {
      zh: '2003 年地球最后一次收到它的信号，之后它安静地继续飞，方向正对金牛座的毕宿五。它带着一块刻着人类男女形象和太阳系位置的金属板——如果有谁捡到它，那是我们的自我介绍。',
      en: 'Earth last heard from it in 2003; since then it has flown on in silence, aimed toward Aldebaran in Taurus. It carries a metal plaque engraved with human figures and the location of our Solar System — should anyone ever find it, that is our introduction.',
    },
  },
  'pioneer-11': {
    summary: {
      zh: '第一个近距离看土星的探测器，也带着那块著名的人类名片金属板。',
      en: 'The first probe to see Saturn up close, and it carries the same famous plaque — humanity’s calling card.',
    },
    details: {
      zh: '1979 年它替人类第一次撩开土星的面纱，为后来的旅行者和卡西尼探路。1995 年失联。它现在朝着天鹰座方向漂流，大约几百万年后会路过那里的一颗恒星。',
      en: 'In 1979 it lifted the veil on Saturn for the first time, scouting the way for the Voyagers and Cassini that followed. Contact was lost in 1995. It now drifts toward Aquila, the Eagle, and in a few million years will pass one of its stars.',
    },
  },
  'new-horizons': {
    summary: {
      zh: '2015 年飞掠冥王星，把一颗模糊的光点变成了有冰川和心形平原的世界。',
      en: 'In 2015 it flew past Pluto, turning a blurry speck of light into a world of glaciers and a heart-shaped plain.',
    },
    details: {
      zh: '它是这五位信使里最年轻的，还在柯伊伯带工作，仍定期回传数据。它出发那年冥王星还是"第九大行星"，飞到一半冥王星被除名——它不在乎，照飞。',
      en: 'It is the youngest of these five messengers, still at work in the Kuiper Belt and still sending data home. Pluto was the “ninth planet” the year it launched; midway through the journey Pluto was reclassified — the probe didn’t care, and flew on.',
    },
  },
}

const surveyBoundaryKeys = {
  [overviewSurvey]: { title: 'boundary.gaiaTitle', copy: 'boundary.gaiaCopy' },
  [closeUpSurvey]: { title: 'boundary.dss2Title', copy: 'boundary.dss2Copy' },
}

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <div>
        <div class="eyebrow" data-i18n="topbar.eyebrow">第一阶段 / 真实数据模式</div>
        <h1 data-i18n="topbar.title">星空照片探索器</h1>
        <p class="subtitle" data-i18n="topbar.subtitle">从真实巡天数据进入银河：先看整片天空，再拉近到可以辨认的天区。</p>
      </div>
      <div class="topbar-actions">
        <div class="badge" data-i18n="nav.overview">银河总览</div>
        <a class="badge badge-link" href="solar.html" data-i18n="nav.solar">太阳系 →</a>
        <a class="badge badge-link" href="stations.html" data-i18n="nav.stations">空间站 →</a>
        <a class="badge badge-link" href="observatories.html" data-i18n="nav.observatories">观星台 →</a>
        <a class="badge badge-link" href="reference.html" data-i18n="nav.reference">来源 →</a>
        <button class="badge badge-toggle" type="button" data-lang-toggle>EN</button>
      </div>
    </header>

    <main class="stage-wrap">
      <section class="stage">
        <div class="hero-view">
          <div class="hero-scene" data-hero-scene>
            <div id="sky-view" data-i18n-attr="aria-label:aria.skyView" aria-label="可交互星空视图"></div>
            <div class="hero-overlay"></div>
            <div class="anchor-layer" data-anchor-layer></div>
            <div class="survey-chip" data-survey-chip hidden>
              <button class="survey-option" type="button" data-survey-choice="dss2" data-i18n="survey.dss2">DSS2 照片</button>
              <button class="survey-option" type="button" data-survey-choice="gaia" data-i18n="survey.gaia">Gaia 测量图</button>
            </div>
          </div>
          <div class="hero-caption" data-hero-caption>
            <div class="hero-kicker" data-i18n="hero.kicker">真实天空 / 可交互巡天底图</div>
            <h2 data-i18n="hero.title">把银河拉近</h2>
            <p data-i18n="hero.text">拖动天空可以自由探索，点击标记会把视野平滑带到对应天区。总览使用 Gaia DR3，近距离自动切到 DSS2。</p>
          </div>
        </div>
      </section>

      <aside class="panel">
        <div class="panel-section">
          <div class="panel-label" data-i18n="panel.mode">模式</div>
          <div class="panel-value" data-i18n="panel.modeValue">真实数据底图</div>
        </div>
        <div class="panel-section">
          <div class="panel-label" data-i18n="panel.status">状态</div>
          <div class="panel-value" data-panel-status>总览模式</div>
        </div>
        <div class="panel-section">
          <div class="panel-label" data-i18n="panel.target">当前目标</div>
          <div class="panel-value panel-title" data-panel-title>正在加载锚点…</div>
          <div class="panel-copy" data-panel-summary></div>
          <div class="panel-copy" data-panel-details>
            这里不再只是静态背景，而是可以从真实天空数据进入的探索界面。
          </div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-nasa-open data-i18n="btn.nasaOpen" hidden>在 NASA 图库看这里</button>
          </div>
          <div class="probe-timeline" data-probe-timeline hidden>
            <div class="panel-label" data-i18n="panel.timeMachine">时间机器</div>
            <input type="range" class="timeline-range" data-timeline-range min="0" max="1000" value="1000" data-i18n-attr="aria-label:aria.timeline" aria-label="轨迹时间轴" />
            <div class="panel-copy timeline-label" data-timeline-label></div>
            <div class="panel-actions timeline-actions">
              <button class="primary-button" type="button" data-probe-play>▶ 从头播放</button>
              <button class="ghost-button" type="button" data-probe-parallax data-i18n="probe.parallaxBtn" aria-expanded="false">为什么是弹簧形？</button>
            </div>
            <div class="explainer-card parallax-card" data-parallax-card hidden>
              <svg class="parallax-diagram" viewBox="0 0 320 132" role="img" aria-label="Parallax diagram">
                <line x1="52" y1="66" x2="300" y2="66" stroke="rgba(255,255,255,0.16)" stroke-dasharray="2 4" />
                <ellipse cx="52" cy="66" rx="26" ry="40" fill="none" stroke="rgba(157,184,255,0.4)" stroke-width="1" />
                <circle cx="52" cy="66" r="7" fill="#ffd479" />
                <text x="52" y="70" text-anchor="middle" font-size="8" fill="#3a2c00">☀</text>
                <line x1="52" y1="26" x2="286" y2="60" stroke="rgba(214,226,255,0.45)" stroke-dasharray="3 3" />
                <line x1="52" y1="106" x2="286" y2="72" stroke="rgba(214,226,255,0.45)" stroke-dasharray="3 3" />
                <circle cx="52" cy="26" r="4" fill="#9db8ff" />
                <text x="42" y="22" text-anchor="end" font-size="9" fill="rgba(198,216,255,0.85)" data-i18n="parallax.jan">1月</text>
                <circle cx="52" cy="106" r="4" fill="#9db8ff" />
                <text x="42" y="110" text-anchor="end" font-size="9" fill="rgba(198,216,255,0.85)" data-i18n="parallax.jul">7月</text>
                <path d="M232 66 q10 -9 20 0 q10 9 20 0 q10 -9 20 0" fill="none" stroke="#d6e2ff" stroke-width="1.6" />
                <circle cx="292" cy="66" r="3.5" fill="#d6e2ff" />
                <text x="256" y="94" text-anchor="middle" font-size="9" fill="rgba(214,226,255,0.85)" data-i18n="parallax.apparent">表观：弹簧</text>
                <text x="150" y="120" text-anchor="middle" font-size="9" fill="rgba(198,216,255,0.6)" data-i18n="parallax.straight">探测器实际沿直线飞离太阳 →</text>
              </svg>
              <p data-i18n-html="parallax.p1"><strong>探测器几乎是沿直线飞离太阳的——它没有在天上画弹簧。</strong>弹簧是我们自己「画」上去的。</p>
              <p data-i18n-html="parallax.p2">地球每年带着我们绕太阳转一整圈，观测点来回摆动约 3 亿公里（±1 个日地距离）。从这个来回移动的位置看同一个探测器，它相对遥远背景星空的方向就每年左右摆一次——这叫<strong>视差</strong>。把探测器缓慢的真实漂移，叠上这一年一次的摆动，画在天上就成了弹簧／螺旋。</p>
              <p data-i18n-html="parallax.p3">离得越近（出发早期）视差环越大，越飞越远环越缩越小。这正是天文学测量恒星距离用的同一招。</p>
            </div>
          </div>
        </div>
        <div class="panel-section">
          <div class="panel-label" data-i18n="panel.boundary">边界</div>
          <div class="panel-value panel-boundary-title" data-panel-boundary-title>真实数据 · Gaia DR3 官方全天图</div>
          <div class="panel-copy" data-panel-boundary-copy></div>
        </div>
        <div class="panel-section">
          <div class="panel-label" data-i18n="panel.regions">天区</div>
          <div class="target-list" data-target-list></div>
        </div>
        <div class="panel-section">
          <div class="panel-label" data-i18n="panel.explain">解释层</div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-toggle-bortle data-i18n="btn.bortle" aria-expanded="false">光污染阶梯</button>
            <button class="ghost-button" type="button" data-toggle-galaxy data-i18n="btn.galaxy" aria-expanded="false">跳出银河系</button>
            <button class="ghost-button" type="button" data-toggle-apod data-i18n="btn.apod" aria-expanded="false">NASA 今天看什么</button>
          </div>
          <div class="explainer-card" data-apod-card hidden>
            <div class="panel-copy" data-apod-content>正在向 NASA 查询今天的天文图…</div>
          </div>
          <div class="explainer-card" data-bortle-card hidden>
            <img src="explainers/bortle_scale.png" data-i18n-attr="alt:img.bortleAlt" alt="Bortle 光污染等级示意图" />
            <p data-i18n="bortle.text">Bortle 标尺用 1 到 9 级描述夜空黑暗程度，级别越高，城市灯光对星空的遮蔽越明显。今天许多人看不到照片里的银河，主要不是银河消失了，而是城市光污染把它淹没在夜空背景里。</p>
          </div>
          <div class="explainer-card" data-galaxy-card hidden>
            <img src="explainers/milky_way_topdown.jpg" data-i18n-attr="alt:img.galaxyAlt" alt="银河系俯视示意图（艺术想象，基于真实测量）" />
            <p data-i18n="galaxy.p1">这是银河系的俯视示意图（NASA/JPL-Caltech/R. Hurt，基于真实测量绘制）。注意"示意"两个字：人类没有任何一张从外面拍的银河系照片——飞得最远的旅行者 1 号走了近 50 年，也才离家 0.003 光年，而想拍到全貌得飞出去几万光年。所有"银河系全景"都是根据真实测量画出来的。</p>
            <p data-i18n="galaxy.p2">但我们有一面真实的镜子：仙女座星系。它在 254 万光年外，和银河系是同类型的旋涡星系——在锚点列表里点开它，看到的那团旋涡，差不多就是别人眼中的我们。这是人类唯一能"看见自己"的方式，而且那是货真价实的照片。</p>
            <p data-i18n="galaxy.p3">Gaia 精确测量的恒星，大多在太阳周围几千光年的范围内。这已经是人类历史上最大的三维星图，但放到直径约十万光年的整个银河系里，仍然只是家门口的一小片。宇宙地图，才刚刚开始画。</p>
          </div>
          <div class="panel-copy boundary-note" data-i18n="boundary.note">底图边界说明：Gaia 测量的是恒星位置与亮度，不是深空长曝光照片；DSS2 来自上世纪照相底片数字化，近看会保留底片和拼接痕迹。</div>
        </div>
        <div class="panel-section">
          <div class="panel-label" data-i18n="panel.next">下一步</div>
          <div class="panel-value" data-panel-next>点击一个天区开始拉近。</div>
          <div class="panel-actions">
            <button class="primary-button" type="button" data-tour-toggle>自动漫游</button>
            <button class="ghost-button" type="button" data-reset-view data-i18n="btn.reset">重置视野</button>
          </div>
          <div class="tour-config" data-tour-config>
            <label><input type="checkbox" data-tour-group="夏季银河" checked /> <span data-i18n="tour.group.summer">夏季银河</span></label>
            <label><input type="checkbox" data-tour-group="秋冬星空" checked /> <span data-i18n="tour.group.autumn">秋冬星空</span></label>
            <label><input type="checkbox" data-tour-group="南天深空" checked /> <span data-i18n="tour.group.south">南天深空</span></label>
            <label><input type="checkbox" data-tour-group="深空信使" /> <span data-i18n="tour.group.probes">深空信使</span></label>
            <label class="tour-dwell"><span data-i18n="tour.dwell">每站停留</span>
              <select data-tour-dwell>
                <option value="4000" data-i18n="tour.dwell4">4 秒</option>
                <option value="6000" selected data-i18n="tour.dwell6">6 秒</option>
                <option value="10000" data-i18n="tour.dwell10">10 秒</option>
              </select>
            </label>
          </div>
        </div>
      </aside>
    </main>
  </div>
  <div class="modal-backdrop" data-nasa-modal hidden>
    <section class="nasa-modal" role="dialog" data-i18n-attr="aria-label:nasa.modalTitle" aria-label="NASA 图库">
      <div class="nasa-modal-header">
        <h3 data-nasa-title>NASA 图库</h3>
        <button class="modal-close" type="button" data-nasa-close data-i18n-attr="aria-label:nasa.close" aria-label="关闭 NASA 图库">×</button>
      </div>
      <div class="nasa-modal-body" data-nasa-content></div>
      <p class="nasa-modal-footer" data-i18n="nasa.footer">图片版权归 NASA 及其合作机构所有，点击缩略图直接看大图。</p>
    </section>
  </div>
  <div class="lightbox-backdrop" data-nasa-lightbox hidden>
    <figure class="nasa-lightbox" role="dialog" data-i18n-attr="aria-label:aria.lightbox" aria-label="NASA full-size image">
      <button class="modal-close lightbox-close" type="button" data-lightbox-close data-i18n-attr="aria-label:lightbox.close" aria-label="关闭大图">×</button>
      <div class="lightbox-stage">
        <div class="nasa-state" data-lightbox-state>正在加载大图…</div>
        <img data-lightbox-img alt="" hidden />
      </div>
      <figcaption class="lightbox-caption">
        <span data-lightbox-title></span>
        <a data-lightbox-nasa-link href="#" target="_blank" rel="noreferrer" data-i18n="lightbox.open">在 NASA 页面打开 ↗</a>
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
const galaxyButton = document.querySelector('[data-toggle-galaxy]')
const galaxyCard = document.querySelector('[data-galaxy-card]')
const apodButton = document.querySelector('[data-toggle-apod]')
const apodCard = document.querySelector('[data-apod-card]')
const apodContent = document.querySelector('[data-apod-content]')
const tourConfig = document.querySelector('[data-tour-config]')
const tourDwellSelect = document.querySelector('[data-tour-dwell]')
const probeTimeline = document.querySelector('[data-probe-timeline]')
const timelineRange = document.querySelector('[data-timeline-range]')
const timelineLabel = document.querySelector('[data-timeline-label]')
const probePlayButton = document.querySelector('[data-probe-play]')
const parallaxButton = document.querySelector('[data-probe-parallax]')
const parallaxCard = document.querySelector('[data-parallax-card]')
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

// Status / next-step lines are set from JS, so remember the current key+params
// to re-render them when the language flips.
let statusState = { key: 'status.overview', params: {} }
let nextState = { key: 'next.clickRegion', params: {} }
function setStatus(key, params = {}) {
  statusState = { key, params }
  panelStatus.textContent = I18N.t(key, params)
}
function setNext(key, params = {}) {
  nextState = { key, params }
  panelNext.textContent = I18N.t(key, params)
}

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

function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t
  const t3 = t2 * t
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
}

// RA wraps at 360°; unwrap into a continuous run before spline interpolation so
// a probe crossing 0h doesn't smear a horizontal streak across the sky.
function unwrapRaPath(points) {
  const out = []
  let prev = null
  for (const [ra, dec] of points) {
    let r = ra
    if (prev !== null) {
      while (r - prev > 180) r -= 360
      while (r - prev < -180) r += 360
    }
    out.push([r, dec])
    prev = r
  }
  return out
}

function segmentTurnDeg(a, b, c) {
  const v1x = b[0] - a[0]
  const v1y = b[1] - a[1]
  const v2x = c[0] - b[0]
  const v2y = c[1] - b[1]
  const d1 = Math.hypot(v1x, v1y)
  const d2 = Math.hypot(v2x, v2y)
  if (d1 === 0 || d2 === 0) return 0
  const cos = (v1x * v2x + v1y * v2y) / (d1 * d2)
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI
}

// The baked Horizons paths are dense on the near-straight outbound drift but
// still show facets at the tight parallax loops (biggest early, when the probe
// is close). Catmull-Rom passes through the real samples; we only subdivide
// where the track actually bends, so smoothing the loops costs few extra points.
function smoothProbePath(points) {
  if (!Array.isArray(points) || points.length < 4) return points
  const p = unwrapRaPath(points)
  const out = [[normalizeRa(p[0][0]), p[0][1]]]
  for (let i = 0; i < p.length - 1; i += 1) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p[i + 1]
    const turnBefore = i > 0 ? segmentTurnDeg(p[i - 1], p1, p2) : 0
    const turnAfter = i < p.length - 2 ? segmentTurnDeg(p1, p2, p[i + 2]) : 0
    const turn = Math.max(turnBefore, turnAfter)
    const segLen = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    let steps = 1
    if (turn > 4 && segLen > 0.02) steps = Math.min(10, Math.ceil(turn / 2.5))
    for (let s = 1; s <= steps; s += 1) {
      const t = s / steps
      const ra = catmullRom(p0[0], p1[0], p2[0], p3[0], t)
      const dec = catmullRom(p0[1], p1[1], p2[1], p3[1], t)
      out.push([normalizeRa(ra), dec])
    }
  }
  return out
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
  const keys = surveyBoundaryKeys[activeSurvey] ?? surveyBoundaryKeys[overviewSurvey]
  panelBoundaryTitle.textContent = I18N.t(keys.title)
  panelBoundaryCopy.textContent = I18N.t(keys.copy)
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
  panelTitle.textContent = L(anchor.label)
  panelSummary.textContent = L(anchor.summary)
  panelDetails.textContent = L(anchor.details)
  nasaOpenButton.hidden = !anchor
  renderBoundary()
}

function renderNasaState(message) {
  nasaContent.innerHTML = `<div class="nasa-state">${message}</div>`
}

function renderNasaImages(images) {
  if (!images.length) {
    renderNasaState(I18N.t('nasa.none'))
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
  nasaLightboxState.textContent = I18N.t('lightbox.loading')
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
      nasaLightboxState.textContent = I18N.t('lightbox.fail')
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
        title: data.title || I18N.t('nasa.defaultTitle'),
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

  const query = nasaImageQueries[anchor.id] ?? L(anchor.label)
  const url = new URL('https://images-api.nasa.gov/search')
  url.searchParams.set('q', query)
  url.searchParams.set('media_type', 'image')
  url.searchParams.set('page_size', '6')

  renderNasaState(I18N.t('nasa.querying'))

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`NASA API returned ${response.status}`)
    const payload = await response.json()
    const images = normalizeNasaItems(payload.collection?.items ?? [])
    nasaCache.set(anchor.id, images)
    if (token === nasaRequestToken) renderNasaImages(images)
  } catch {
    if (token === nasaRequestToken) renderNasaState(I18N.t('nasa.failed'))
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
  nasaTitle.textContent = I18N.t('nasa.modalTitleFor', { name: L(anchor.label) })
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
  tourButton.textContent = I18N.t('btn.tour')
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
  syncProbeTimeline()

  if (moveSky) {
    surveyMode = 'auto'
    setStatus('status.zoomedTo', { name: L(anchor.label) })
    setNext('next.dragOrSwitch')
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
        aria-label="${escapeHtml(L(anchor.label))}"
        title="${escapeHtml(L(anchor.label))}"
      >
        <span class="anchor-dot"></span>
        <span class="anchor-label">${escapeHtml(L(anchor.label))}</span>
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
  const parts = []
  let currentGroup = null
  for (const anchor of anchors) {
    if (anchor.group !== currentGroup) {
      currentGroup = anchor.group
      parts.push(`<div class="target-group-label">${escapeHtml(groupLabel(currentGroup))}</div>`)
    }
    parts.push(`
      <button
        class="target-button${anchor.id === selectedId ? ' is-selected' : ''}"
        type="button"
        data-anchor-id="${anchor.id}"
      >
        ${escapeHtml(L(anchor.label))}
      </button>
    `)
  }
  targetList.innerHTML = parts.join('')

  for (const button of targetList.querySelectorAll('.target-button')) {
    button.addEventListener('click', () => selectAnchor(button.dataset.anchorId))
  }
}

function finishTour(token) {
  surveyMode = 'auto'
  setStatus('status.backToOverview')
  setNext('next.tourEnded')
  tweenToView(overviewView, () => {
    if (token !== tourToken) return
    isTouring = false
    clearTourTimeout()
    tourButton.textContent = I18N.t('btn.tour')
    setStatus('status.overview')
    setNext('next.clickRegion')
    setActiveSurvey(overviewSurvey)
    updateHotspotPositions()
  })
}

function getTourStops() {
  const checked = new Set(
    [...tourConfig.querySelectorAll('[data-tour-group]:checked')].map((box) => box.dataset.tourGroup),
  )
  return anchors.filter((item) => checked.has(item.group))
}

function visitTourStop(index, token) {
  if (token !== tourToken || !isTouring) return
  const stops = getTourStops()
  if (index >= stops.length) {
    finishTour(token)
    return
  }

  const anchor = stops[index]
  surveyMode = 'auto'
  selectAnchor(anchor.id, { moveSky: false, fromTour: true })
  setStatus('status.touring', { i: index + 1, n: stops.length, name: L(anchor.label) })
  setNext('next.tourDwell')

  tweenToView({ ...anchor.sky, fov: anchor.fov }, () => {
    if (token !== tourToken || !isTouring) return
    tourTimeoutId = setTimeout(() => {
      tourTimeoutId = null
      visitTourStop(index + 1, token)
    }, Number(tourDwellSelect.value) || 6000)
  })
}

function startTour() {
  if (!getTourStops().length) {
    setNext('next.pickGroup')
    return
  }

  stopTour({ cancelTween: true })
  isTouring = true
  tourToken += 1
  tourButton.textContent = I18N.t('btn.tourStop')
  visitTourStop(0, tourToken)
}

function toggleTour() {
  if (isTouring) {
    stopTour({ cancelTween: true })
    const selected = anchors.find((item) => item.id === selectedId)
    if (selected) setStatus('status.stopped', { name: L(selected.label) })
    else setStatus('status.stoppedTour')
    setNext('next.dragOrRestart')
    return
  }

  startTour()
}

function resetView() {
  stopTour({ cancelTween: true })
  surveyMode = 'auto'
  setStatus('status.overview')
  setNext('next.clickRegion')
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

function toggleGalaxyCard() {
  const nextOpen = galaxyCard.hidden
  galaxyCard.hidden = !nextOpen
  galaxyButton.setAttribute('aria-expanded', String(nextOpen))
}

let apodLoaded = false

async function loadApod() {
  try {
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&thumbs=true')
    if (!response.ok) throw new Error(String(response.status))
    const apod = await response.json()
    const imageUrl = apod.media_type === 'video' ? apod.thumbnail_url : apod.url
    apodContent.innerHTML = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${escapeHtml(I18N.t('apod.imgAlt'))}" />` : ''}
      <p>${I18N.t('apod.titleLine', { title: escapeHtml(apod.title ?? ''), date: escapeHtml(apod.date ?? '') })}</p>
      ${apod.media_type === 'video' ? `<p><a href="${apod.url}" target="_blank" rel="noreferrer">${I18N.t('apod.videoLink')}</a></p>` : ''}
      <p>${I18N.t('apod.explainZh', { text: escapeHtml((apod.explanation ?? '').slice(0, 300)) })}</p>
    `
  } catch {
    apodLoaded = false
    apodContent.textContent = I18N.t('apod.failed')
  }
}

function toggleApodCard() {
  const nextOpen = apodCard.hidden
  apodCard.hidden = !nextOpen
  apodButton.setAttribute('aria-expanded', String(nextOpen))
  if (nextOpen && !apodLoaded) {
    apodLoaded = true
    loadApod()
  }
}

// Aladin's default hover/selection highlight is #00ff00; match the app
// accent instead.
const overlayHighlight = {
  hoverColor: 'rgba(157, 184, 255, 0.85)',
  selectionColor: 'rgba(157, 184, 255, 0.85)',
}

function addTriangleOverlay(points) {
  try {
    const overlay = window.A.graphicOverlay({ color: 'rgba(255,255,255,0.3)', lineWidth: 1 })
    aladin.addOverlay(overlay)

    if (typeof window.A.polyline === 'function') {
      overlay.add(window.A.polyline(points, { ...overlayHighlight }))
      return
    }

    if (typeof window.A.line !== 'function') return
    for (let index = 0; index < points.length - 1; index += 1) {
      overlay.add(window.A.line(points[index], points[index + 1], { ...overlayHighlight }))
    }
  } catch {
    // The narrative anchors still work if the optional overlay API is unavailable.
  }
}

function addSummerTriangleOverlay() {
  addTriangleOverlay([
    [279.2347, 38.7837],
    [310.358, 45.2803],
    [297.6958, 8.8683],
    [279.2347, 38.7837],
  ])
}

function addWinterTriangleOverlay() {
  addTriangleOverlay([
    [101.28716, -16.71612],
    [88.79294, 7.40706],
    [114.8255, 5.22499],
    [101.28716, -16.71612],
  ])
}

async function initAladin() {
  if (!window.A?.init) {
    throw new Error(I18N.t('error.aladin'))
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
  addWinterTriangleOverlay()
  // The `target` init option is parsed in the active cooFrame (galactic here),
  // so re-point explicitly: gotoRaDec is always ICRS.
  requestAnimationFrame(() => applySkyView(overviewView))
}

let probePaths = []

function probesToAnchors(probes) {
  const suffix = UI['probe.detailsSuffix']
  return probes.map((probe) => {
    const copy = probeCopy[probe.id] ?? { summary: { zh: '', en: '' }, details: { zh: '', en: '' } }
    const year = probe.start.slice(0, 4)
    return {
      id: probe.id,
      label: PROBE_LABELS[probe.id] ?? { zh: probe.label, en: probe.label },
      kind: 'probe',
      mode: 'real',
      group: '深空信使',
      tour: false,
      sky: { ra: probe.current[0], dec: probe.current[1] },
      fov: 12,
      summary: copy.summary,
      details: {
        zh: `${copy.details.zh} ${fillTemplate(suffix.zh, { year, dist: probe.dist_au })}`,
        en: `${copy.details.en} ${fillTemplate(suffix.en, { year, dist: probe.dist_au })}`,
      },
    }
  })
}

const probeOverlays = new Map()
const truncatedProbes = new Set()
const PROBE_STEP_DAYS = 5

// Render from the smoothed spline; keep the raw path for date math.
function ribbonOf(probe) {
  return probe.smoothPath ?? probe.path
}

function addProbeRibbons() {
  for (const probe of probePaths) {
    try {
      const overlay = window.A.graphicOverlay({ color: 'rgba(214, 226, 255, 0.34)', lineWidth: 1 })
      aladin.addOverlay(overlay)
      if (typeof window.A.polyline === 'function') {
        overlay.add(window.A.polyline(ribbonOf(probe), { ...overlayHighlight }))
        probeOverlays.set(probe.id, overlay)
      }
    } catch {
      // Ribbons are decoration; anchors still work without the overlay API.
    }
  }
}

// fraction is 0..1 along the whole track; the ribbon is drawn from launch up to
// that point, with a marker at the leading edge.
function drawProbeRibbon(probe, fraction) {
  const overlay = probeOverlays.get(probe.id)
  if (!overlay) return
  try {
    const ribbon = ribbonOf(probe)
    const index = Math.max(1, Math.round(fraction * (ribbon.length - 1)))
    overlay.removeAll()
    overlay.add(window.A.polyline(ribbon.slice(0, index + 1), { ...overlayHighlight }))
    const atEnd = index >= ribbon.length - 1
    if (!atEnd && typeof window.A.circle === 'function') {
      const [ra, dec] = ribbon[index]
      overlay.add(window.A.circle(ra, dec, 0.5, { color: 'rgba(157, 184, 255, 0.9)', ...overlayHighlight }))
    }
    if (atEnd) {
      truncatedProbes.delete(probe.id)
    } else {
      truncatedProbes.add(probe.id)
    }
  } catch {
    // Timeline is decoration on top of decoration; never break selection.
  }
}

function probeDateAtFraction(probe, fraction) {
  const totalDays = (probe.path.length - 1) * PROBE_STEP_DAYS
  const start = new Date(`${probe.start}T00:00:00Z`)
  const date = new Date(start.getTime() + fraction * totalDays * 86400000)
  const month = I18N.t('month.' + (date.getUTCMonth() + 1))
  return I18N.t('date.format', { year: date.getUTCFullYear(), month })
}

function updateTimeline() {
  const probe = probePaths.find((item) => item.id === selectedId)
  if (!probe) return
  const fraction = Number(timelineRange.value) / Number(timelineRange.max)
  drawProbeRibbon(probe, fraction)
  timelineLabel.textContent = fraction >= 0.999
    ? I18N.t('probe.todayLabel', { dist: probe.dist_au })
    : I18N.t('probe.dateLabel', { date: probeDateAtFraction(probe, fraction) })
}

function syncProbeTimeline() {
  stopProbePlay()
  // Restore any ribbon left truncated by a previous drag/play.
  for (const id of [...truncatedProbes]) {
    if (id === selectedId) continue
    const probe = probePaths.find((item) => item.id === id)
    if (probe) drawProbeRibbon(probe, 1)
  }
  const probe = probePaths.find((item) => item.id === selectedId)
  if (!probe) {
    probeTimeline.hidden = true
    parallaxCard.hidden = true
    parallaxButton.setAttribute('aria-expanded', 'false')
    return
  }
  probeTimeline.hidden = false
  timelineRange.value = timelineRange.max
  updateTimeline()
}

let timelineFramePending = false
timelineRange.addEventListener('input', () => {
  stopProbePlay()
  if (timelineFramePending) return
  timelineFramePending = true
  requestAnimationFrame(() => {
    timelineFramePending = false
    updateTimeline()
  })
})

// Play simulator: sweep the whole track from launch to today so the trajectory
// draws itself out, then settle at the present position.
const PROBE_PLAY_DURATION = 9000
let probePlaying = false
let probePlayToken = 0

function setProbePlayLabel() {
  probePlayButton.textContent = I18N.t(probePlaying ? 'probe.playing' : 'probe.play')
}

function stopProbePlay() {
  if (!probePlaying) return
  probePlaying = false
  probePlayToken += 1
  setProbePlayLabel()
}

function startProbePlay() {
  const probe = probePaths.find((item) => item.id === selectedId)
  if (!probe) return
  probePlaying = true
  setProbePlayLabel()
  const token = (probePlayToken += 1)
  const max = Number(timelineRange.max)
  const atEnd = Number(timelineRange.value) >= max
  const startFraction = atEnd ? 0 : Number(timelineRange.value) / max
  const startedAt = performance.now()
  function step(now) {
    if (token !== probePlayToken) return
    const progress = Math.min((now - startedAt) / PROBE_PLAY_DURATION, 1)
    const fraction = startFraction + (1 - startFraction) * progress
    timelineRange.value = String(Math.round(fraction * max))
    updateTimeline()
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      probePlaying = false
      setProbePlayLabel()
    }
  }
  requestAnimationFrame(step)
}

function toggleProbePlay() {
  if (probePlaying) {
    stopProbePlay()
  } else {
    startProbePlay()
  }
}

function toggleParallaxCard() {
  const nextOpen = parallaxCard.hidden
  parallaxCard.hidden = !nextOpen
  parallaxButton.setAttribute('aria-expanded', String(nextOpen))
}

async function init() {
  renderBoundary()
  const response = await fetch(anchorsUrl)
  anchors = await response.json()
  try {
    const probes = await (await fetch(probesUrl)).json()
    for (const probe of probes) {
      probe.smoothPath = smoothProbePath(probe.path)
    }
    probePaths = probes
    anchors.push(...probesToAnchors(probes))
  } catch {
    // Probe layer is optional; the sky anchors must never depend on it.
  }
  selectedId = anchors[0]?.id ?? null
  renderAnchors()
  renderTargetList()
  if (selectedId) {
    selectAnchor(selectedId, { moveSky: false })
  }
  // selectAnchor with moveSky:false doesn't touch the status/next lines, so
  // localize their initial values explicitly (matters when loading in English).
  setStatus('status.overview')
  setNext('next.clickRegion')
  await initAladin()
  addProbeRibbons()
}

resetButton.addEventListener('click', resetView)
tourButton.addEventListener('click', toggleTour)
probePlayButton.addEventListener('click', toggleProbePlay)
parallaxButton.addEventListener('click', toggleParallaxCard)
bortleButton.addEventListener('click', toggleBortleCard)
galaxyButton.addEventListener('click', toggleGalaxyCard)
apodButton.addEventListener('click', toggleApodCard)
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

// Re-render everything that JS controls when the language flips. Static
// [data-i18n] nodes are handled by I18N.apply(); this covers the dynamic parts.
function renderLang() {
  renderBoundary()
  renderAnchors()
  renderTargetList()
  updateSelectedButton()
  const selected = anchors.find((item) => item.id === selectedId)
  if (selected) renderPanel(selected)
  tourButton.textContent = I18N.t(isTouring ? 'btn.tourStop' : 'btn.tour')
  setProbePlayLabel()
  setStatus(statusState.key, statusState.params)
  setNext(nextState.key, nextState.params)
  if (!probeTimeline.hidden) updateTimeline()
  if (apodLoaded) loadApod()
}

I18N.mountToggles()
I18N.apply()
I18N.onChange(renderLang)

// debug handle for headless QA (read-only introspection)
window.__cosmicDebug = {
  get aladin() { return aladin },
  get currentView() { return currentView },
  get activeSurvey() { return activeSurvey },
  get surveyMode() { return surveyMode },
  get lang() { return I18N.getLang() },
}

init().catch((error) => {
  setStatus('status.error')
  panelTitle.textContent = I18N.t('error.title')
  panelSummary.textContent = I18N.t('error.summary')
  panelDetails.textContent = String(error)
  setNext('error.next')
})
