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
// Probe overlay on the overview sky map is parked for a v3 redesign — it read as
// clutter over the real sky (orange ribbons + extra hotspots + a spiral the map
// couldn't honestly draw). Each probe's story now lives on its own page,
// messengers.html ("深空信使"), reachable from the nav badge. Flip to true to
// bring the homepage overlay back once v3 reworks how it's presented.
const SHOW_PROBES = false
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
        <a class="badge badge-link" href="constellations.html" data-i18n="nav.constellations">星座 3D →</a>
        <a class="badge badge-link" href="solar.html" data-i18n="nav.solar">太阳系 →</a>
        <a class="badge badge-link" href="messengers.html" data-i18n="nav.messengers">深空信使 →</a>
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
            <button class="map-fs" type="button" data-fullscreen aria-pressed="false"
              data-i18n-attr="aria-label:aria.fullscreen" aria-label="全屏查看天图">
              <svg class="map-fs-in" viewBox="0 0 24 24" width="18" height="18" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
              <svg class="map-fs-out" viewBox="0 0 24 24" width="18" height="18" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>
            </button>
            <div class="survey-chip" data-survey-chip hidden>
              <button class="survey-option" type="button" data-survey-choice="dss2" data-i18n="survey.dss2">DSS2 照片</button>
              <button class="survey-option" type="button" data-survey-choice="gaia" data-i18n="survey.gaia">Gaia 测量图</button>
            </div>
            <div class="sky-loading" data-sky-loading>
              <div class="sky-loading-spinner" aria-hidden="true"></div>
              <p data-i18n="sky.loading">正在加载天图…</p>
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
            <p class="panel-copy timeline-realorbit" data-i18n-html="probe.realOrbitNote"></p>
            <div class="explainer-card parallax-card" data-parallax-card hidden>
              <p class="parallax-lead" data-i18n-html="parallax.lead"><strong>你知道吗？</strong>地图上卫星飞的是它真实的直线轨道，但我们从地球看到的其实是一条螺旋。</p>
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
            <img src="explainers/bortle_scale.jpg" data-i18n-attr="alt:img.bortleAlt" alt="Bortle 光污染等级示意图" />
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

// RA wraps at 360°; unwrap into a continuous run before decimation so a probe
// crossing 0h doesn't smear a horizontal streak across the sky.
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

// The baked Horizons paths are dense (1500–4000 points each). Drawn as a live
// polyline, Aladin re-projects and re-strokes EVERY vertex EVERY frame on the main
// thread — 16k+ vertices/frame pegged the thread and froze the whole page on any
// drag. So we simplify — but NOT uniformly: a probe's apparent sky-path carries
// yearly parallax coils (Earth's orbit swings the view in a small loop each year),
// the scientific payload of this view, and uniform decimation aliased those smooth
// coils into zigzags. Douglas–Peucker instead drops points on straight runs and
// KEEPS the ones that define each coil — faithful shape at a fraction of the cost.
function simplifyRDP(pts, eps) {
  if (pts.length < 3) return pts.slice()
  const keep = new Uint8Array(pts.length)
  keep[0] = 1
  keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    const ax = pts[a][0]
    const ay = pts[a][1]
    const dx = pts[b][0] - ax
    const dy = pts[b][1] - ay
    const len2 = dx * dx + dy * dy || 1e-9
    let maxD = 0
    let idx = -1
    for (let i = a + 1; i < b; i += 1) {
      const t = ((pts[i][0] - ax) * dx + (pts[i][1] - ay) * dy) / len2
      const cx = ax + t * dx
      const cy = ay + t * dy
      const d = Math.hypot(pts[i][0] - cx, pts[i][1] - cy)
      if (d > maxD) {
        maxD = d
        idx = i
      }
    }
    if (maxD > eps && idx !== -1) {
      keep[idx] = 1
      stack.push([a, idx], [idx, b])
    }
  }
  const out = []
  for (let i = 0; i < pts.length; i += 1) if (keep[i]) out.push(pts[i])
  return out
}

// Earth's parallax repeats once a year, so averaging the apparent path over a full
// year cancels the yearly loop and leaves the probe's true outward drift — the
// straight-ish line it actually flies. Same samples, same clock as the apparent
// path, so a marker on each stays time-synchronised no matter how they curve.
function deParallax(unwrapped) {
  const win = Math.max(3, Math.round(365.25 / PROBE_STEP_DAYS))
  const half = Math.floor(win / 2)
  const n = unwrapped.length
  const out = new Array(n)
  for (let i = 0; i < n; i += 1) {
    let sr = 0
    let sd = 0
    let c = 0
    for (let j = i - half; j <= i + half; j += 1) {
      if (j >= 0 && j < n) {
        sr += unwrapped[j][0]
        sd += unwrapped[j][1]
        c += 1
      }
    }
    out[i] = [sr / c, sd / c]
  }
  return out
}

const nRa = (p) => [normalizeRa(p[0]), p[1]]

// Position along an unwrapped path at fraction 0..1, linearly interpolated so the
// two markers advance by the SAME time even where the drawn polylines differ.
function pointAtFraction(unwrapped, fraction) {
  const t = Math.max(0, Math.min(1, fraction)) * (unwrapped.length - 1)
  const i = Math.floor(t)
  const f = t - i
  const a = unwrapped[i]
  const b = unwrapped[Math.min(i + 1, unwrapped.length - 1)]
  return [normalizeRa(a[0] + (b[0] - a[0]) * f), a[1] + (b[1] - a[1]) * f]
}

// The de-parallaxed drift is smooth, so a modest RDP tolerance tracks it faithfully.
const REAL_EPS = 0.04

// Precompute once: the full-res drift (exact marker positions) and its RDP-
// simplified polyline (the cheap drawn line). Parallax removal averages the
// apparent path over a year; the apparent spiral itself is only ever an
// illustration in the side panel now, so it isn't retained per probe.
//
// Also precompute cumulative ANGULAR distance along the drift. Playing by time
// looks uneven — the probe whips across the sky during its early planetary
// encounters, then crawls once it's far — so we drive the animation by arc length
// instead, giving a constant on-screen pace (and no fast early pan to smear the
// satellite into afterimages).
function buildProbeGeometry(probe) {
  const realFull = deParallax(unwrapRaPath(probe.path))
  probe.realFull = realFull
  probe.realLine = simplifyRDP(realFull, REAL_EPS).map(nRa)
  const cum = new Array(realFull.length)
  cum[0] = 0
  for (let i = 1; i < realFull.length; i += 1) {
    const [ra0, dec0] = realFull[i - 1]
    const [ra1, dec1] = realFull[i]
    const dRa = (ra1 - ra0) * Math.cos((((dec0 + dec1) / 2) * Math.PI) / 180)
    cum[i] = cum[i - 1] + Math.hypot(dRa, dec1 - dec0)
  }
  probe.cumAngular = cum
  probe.totalAngular = cum[cum.length - 1] || 1
}

// Map a time-fraction (0..1 along the samples) to its arc-length position 0..1,
// and back. These let play advance at constant angular speed while the timeline
// slider and date label still read in real (uniform-time) terms.
function arcAtFraction(probe, fraction) {
  const cum = probe.cumAngular
  const t = Math.max(0, Math.min(1, fraction)) * (cum.length - 1)
  const i = Math.floor(t)
  const f = t - i
  const a = cum[i]
  const b = cum[Math.min(i + 1, cum.length - 1)]
  return (a + (b - a) * f) / probe.totalAngular
}
function fractionAtArc(probe, u) {
  const cum = probe.cumAngular
  const target = Math.max(0, Math.min(1, u)) * probe.totalAngular
  let lo = 0
  let hi = cum.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (cum[mid] < target) lo = mid + 1
    else hi = mid
  }
  if (lo === 0) return 0
  const prev = cum[lo - 1]
  const span = cum[lo] - prev || 1
  return (lo - 1 + (target - prev) / span) / (cum.length - 1)
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
  // Keep the travelling markers pinned to the sky as the user pans/zooms.
  const probe = probePaths.find((item) => item.id === selectedId)
  if (probe && !probeTimeline.hidden) {
    updateProbeMarkers(probe, Number(timelineRange.value) / Number(timelineRange.max))
  }
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

  // A probe's whole story — narrative, ▶ play, the timeline scrubber, the
  // "why a spiral?" card — lives in the side panel, which the maximized map
  // covers (z-index:60, inset:0). Selecting a probe is a request to engage that
  // story, so leave fullscreen to reveal it; otherwise the click silently
  // redraws an invisible panel — no visible animation, no explanation.
  if (fsIsOn() && probePaths.some((probe) => probe.id === anchorId)) {
    toggleFullscreen()
  }

  if (moveSky) {
    // First target click on the static landing page boots the live map, then
    // flies to this anchor once it's up. tweenToView is a no-op while !aladin.
    if (!aladin) {
      ensureAladin({ flyTo: anchorId })
      return
    }
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
  window.addEventListener('resize', () => {
    updateHotspotPositions()
    const probe = probePaths.find((item) => item.id === selectedId)
    if (probe && !probeTimeline.hidden) {
      updateProbeMarkers(probe, Number(timelineRange.value) / Number(timelineRange.max))
    }
  })
  const host = document.querySelector('#sky-view')
  if (host) {
    host.addEventListener('mousedown', onSkyDown, true)
    host.addEventListener('mouseup', onSkyUp, true)
    host.addEventListener('mousemove', onRibbonHover)
  }
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

// Pin the Aladin version so a future CDS release can't silently change behaviour
// under us (the `latest` alias used to auto-load and freeze the page).
const ALADIN_SRC = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/3.8.1/aladin.js'
let aladinScriptPromise = null

function loadAladinScript() {
  if (window.A?.init) return Promise.resolve()
  if (aladinScriptPromise) return aladinScriptPromise
  aladinScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = ALADIN_SRC
    script.charset = 'utf-8'
    script.onload = () => resolve()
    script.onerror = () => {
      aladinScriptPromise = null
      reject(new Error(I18N.t('error.aladin')))
    }
    document.head.appendChild(script)
  })
  return aladinScriptPromise
}

// Lazily boot the live sky map. It stays unloaded on the landing page (a static
// galaxy panorama shows instead) so the heavy CDS tile streaming can never peg
// the main thread before the user opts in. `flyTo` re-points to a target once up.
async function ensureAladin({ flyTo } = {}) {
  if (aladin) {
    if (flyTo) selectAnchor(flyTo)
    return
  }
  const loadingLayer = document.querySelector('[data-sky-loading]')
  try {
    await loadAladinScript()
    await initAladin()
    addProbeRibbons()
  } catch (error) {
    setStatus('error.aladin')
    return
  }
  if (loadingLayer) loadingLayer.classList.add('is-hidden')
  if (flyTo) selectAnchor(flyTo)
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
const PROBE_STEP_DAYS = 5

// The map shows the real outward drift (orange, the path it actually flies). The
// faint background lines are that same drift line, so the idle map reads as a clean
// chart of where the probes really went; the apparent spiral is explained as a
// static diagram in the side panel rather than drawn (dizzying) in motion here.
const REAL_COLOR = 'rgba(255, 150, 60, 0.95)'
const PROBE_BG_COLOR = 'rgba(214, 226, 255, 0.26)'

// Background + hit-test both ride the smooth drift line: a clean arc is an easy
// click target and cheap to keep drawn for all five probes at once.
function ribbonOf(probe) {
  return probe.realLine ?? probe.path
}

let selectedProbeOverlay = null

function addProbeRibbons() {
  for (const probe of probePaths) {
    try {
      const overlay = window.A.graphicOverlay({ color: PROBE_BG_COLOR, lineWidth: 1 })
      aladin.addOverlay(overlay)
      if (typeof window.A.polyline === 'function') {
        overlay.add(window.A.polyline(ribbonOf(probe), { ...overlayHighlight }))
        probeOverlays.set(probe.id, overlay)
      }
    } catch {
      // Ribbons are decoration; anchors still work without the overlay API.
    }
  }
  // The bright pair for the SELECTED probe — real drift + apparent coil. Redrawn
  // only when the selection changes (never per frame), so it never re-pegs the
  // thread the way the old dense live ribbons did.
  try {
    selectedProbeOverlay = window.A.graphicOverlay({ color: 'rgba(255,255,255,0.9)', lineWidth: 2 })
    aladin.addOverlay(selectedProbeOverlay)
  } catch {
    selectedProbeOverlay = null
  }
  // A dedicated top overlay for the hover glow, kept separate from the probe
  // overlays so it never collides with the selection redraw.
  try {
    ribbonHoverOverlay = window.A.graphicOverlay({ color: 'rgba(150, 200, 255, 0.95)', lineWidth: 2.5 })
    aladin.addOverlay(ribbonHoverOverlay)
  } catch {
    ribbonHoverOverlay = null
  }
  ensureMarkerLayer()
}

// Draw (or clear) the bright real+apparent pair for the selected probe. Static —
// the animation only moves the two DOM markers along these fixed lines.
function renderSelectedProbe(probe) {
  if (!selectedProbeOverlay) return
  try {
    selectedProbeOverlay.removeAll()
    if (probe && typeof window.A.polyline === 'function') {
      // Only the real (near-straight) trajectory on the map — the apparent spiral
      // is dizzying in motion, so it lives as a static explainer diagram in the
      // side panel instead. Here the satellite just glides its true path.
      selectedProbeOverlay.add(window.A.polyline(probe.realLine, { color: REAL_COLOR, lineWidth: 2.6 }))
    }
  } catch {
    // Selection highlight is decoration; never break the panel.
  }
}

// --- Two travelling markers (DOM/SVG over the canvas) --------------------------
// The satellite icon rides the real drift line; a gold dot rides the apparent
// path; a faint dashed link between them IS the parallax offset at that instant.
// They're plain SVG positioned by world2pix each frame — far cheaper than redrawing
// Aladin overlays, and lets us use a real icon at a legible size.
let markerLayer = null
let realMarkerEl = null

function ensureMarkerLayer() {
  if (markerLayer) return
  const scene = document.querySelector('[data-hero-scene]')
  if (!scene) return
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'probe-marker-layer')
  svg.dataset.probeMarkers = ''
  svg.innerHTML = `
    <defs>
      <filter id="probe-glow" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g data-real-marker filter="url(#probe-glow)">
      <rect x="-20" y="-4" width="12.5" height="8" rx="1.5" fill="rgba(120,200,255,0.92)" stroke="#eaf6ff" stroke-width="0.9" />
      <rect x="7.5" y="-4" width="12.5" height="8" rx="1.5" fill="rgba(120,200,255,0.92)" stroke="#eaf6ff" stroke-width="0.9" />
      <line x1="-7.5" y1="0" x2="-5.5" y2="0" stroke="#ff9a3c" stroke-width="1.4" />
      <line x1="5.5" y1="0" x2="7.5" y2="0" stroke="#ff9a3c" stroke-width="1.4" />
      <rect x="-5.5" y="-5.5" width="11" height="11" rx="2.2" fill="#ffd9a0" stroke="#ff9a3c" stroke-width="1.6" />
      <circle cx="0" cy="0" r="2.1" fill="#fff3e0" />
    </g>`
  scene.appendChild(svg)
  markerLayer = svg
  realMarkerEl = svg.querySelector('[data-real-marker]')
  hideProbeMarkers()
}

function hideProbeMarkers() {
  if (markerLayer) markerLayer.style.display = 'none'
}

// Reposition the satellite to the probe's real (near-straight) position at the
// given time fraction. During play the camera is centred on that same point every
// frame, so we pin the icon to the exact view centre rather than re-deriving it
// through world2pix — that avoids a per-frame projection/camera lag that smeared
// the fast-moving icon into several afterimages. When idle/scrubbing the camera is
// still, so world2pix is exact and lets the icon sit off-centre or hide off-screen.
function updateProbeMarkers(probe, fraction) {
  if (!markerLayer || !aladin || typeof aladin.world2pix !== 'function') return
  if (!probe || !probe.realFull) {
    hideProbeMarkers()
    return
  }
  const host = document.querySelector('#sky-view')
  let px
  let py
  if (probePlaying && host) {
    const rect = host.getBoundingClientRect()
    px = rect.width / 2
    py = rect.height / 2
  } else {
    const re = pointAtFraction(probe.realFull, fraction)
    const rePx = aladin.world2pix(re[0], re[1])
    if (!rePx) {
      hideProbeMarkers()
      return
    }
    px = rePx[0]
    py = rePx[1]
  }
  markerLayer.style.display = ''
  realMarkerEl.setAttribute('transform', `translate(${px}, ${py})`)
}

// A faint coordinate grid for reference while a probe is selected, so you can tell
// where on the sky it is. Off in the overview so the clean landing map stays clean.
let probeGridOn = false
function setProbeGrid(on) {
  if (!aladin || on === probeGridOn) return
  probeGridOn = on
  try {
    if (typeof aladin.setCooGrid === 'function') {
      aladin.setCooGrid({ enabled: on, color: 'rgba(130,170,230,0.22)', labelSize: 10 })
    } else if (on && typeof aladin.showCooGrid === 'function') {
      aladin.showCooGrid()
    } else if (!on && typeof aladin.hideCooGrid === 'function') {
      aladin.hideCooGrid()
    }
  } catch {
    // Grid is optional reference decoration.
  }
}

// The apparent arc spans ~half the sky, but the parallax wobble we want to show is
// under a degree — 500× smaller. No single static frame can hold both scales, so
// during play we RIDE ALONG: keep the smooth (real) position centred at a wobble-
// visible zoom. The apparent dot then loops around that centre (Earth's parallax)
// while the sky slides past, delivering "watch it travel launch→today" AND "see the
// two lines are one object" at once.
const FOLLOW_FOV = 20
function followProbe(probe, fraction) {
  if (!aladin || !probe.realFull) return
  const re = pointAtFraction(probe.realFull, fraction)
  try {
    aladin.gotoRaDec(re[0], re[1])
  } catch {
    // Follow is a nicety; markers/timeline still update from the current view.
  }
}

function setProbeFov(fov) {
  if (!aladin) return
  const setFov = typeof aladin.setFoV === 'function' ? aladin.setFoV : aladin.setFov
  try {
    if (typeof setFov === 'function') setFov.call(aladin, fov)
  } catch {
    // no-op
  }
}

// --- Clicking a trajectory ribbon: name the probe + play its fly-through -------
// The ribbons are thin, so we hit-test by proximity: convert the click to sky
// coordinates and find the nearest ribbon vertex within a slice of the field of
// view. That makes a whole line an easy target instead of a 1px stroke.
let ribbonHoverOverlay = null
let ribbonHoverPending = false

// Hit-test in PIXEL space. Aladin's world2pix (ICRS ra/dec → screen) is reliable
// and matches how the ribbons are drawn; pix2world, by contrast, returns a
// different coordinate frame that never lined up with the ribbon points. So we
// project each ribbon vertex to the screen and measure pixel distance to the
// pointer — which also gives an intuitive, fov-independent hit radius.
function probeRibbonAtEvent(event) {
  if (!aladin || typeof aladin.world2pix !== 'function') return null
  const host = document.querySelector('#sky-view')
  const rect = host.getBoundingClientRect()
  const cx = event.clientX - rect.left
  const cy = event.clientY - rect.top
  let best = null
  let bestD = 14 // px hit radius — makes a whole thin line easy to grab
  for (const probe of probePaths) {
    for (const point of ribbonOf(probe)) {
      const px = aladin.world2pix(point[0], point[1])
      if (!px) continue
      const d = Math.hypot(px[0] - cx, px[1] - cy)
      if (d < bestD) {
        bestD = d
        best = probe
      }
    }
  }
  return best
}

// Aladin handles the canvas mouse-up itself and swallows the synthesized `click`,
// so we reconstruct a click from mousedown→mouseup. Listening in the CAPTURE phase
// means we run before Aladin's own handlers can stop the event.
let skyPointerDown = null
function onSkyDown(event) {
  skyPointerDown = { x: event.clientX, y: event.clientY, t: performance.now() }
}
function onSkyUp(event) {
  if (!skyPointerDown) return
  const moved = Math.hypot(event.clientX - skyPointerDown.x, event.clientY - skyPointerDown.y)
  const dt = performance.now() - skyPointerDown.t
  skyPointerDown = null
  if (moved > 6 || dt > 500) return // a drag/pan, not a click
  const probe = probeRibbonAtEvent(event)
  if (!probe) return
  // Keep the wide view (moveSky:false) so the whole arc stays framed while the
  // marker walks it; selectAnchor still opens the probe's info panel + timeline.
  selectAnchor(probe.id, { moveSky: false })
  startProbePlay()
}

function onRibbonHover(event) {
  if (ribbonHoverPending) return
  ribbonHoverPending = true
  requestAnimationFrame(() => {
    ribbonHoverPending = false
    const probe = probeRibbonAtEvent(event)
    const host = document.querySelector('#sky-view')
    if (host) host.style.cursor = probe ? 'pointer' : ''
    if (!ribbonHoverOverlay) return
    ribbonHoverOverlay.removeAll()
    if (probe && typeof window.A.polyline === 'function') {
      ribbonHoverOverlay.add(window.A.polyline(ribbonOf(probe), { color: 'rgba(150, 200, 255, 0.95)', lineWidth: 2.5 }))
    }
  })
}

// The two lines are drawn once (statically) on selection; a time step just moves
// the two markers along them, so the whole track stays visible while they travel.
function drawProbeRibbon(probe, fraction) {
  updateProbeMarkers(probe, fraction)
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
  const probe = probePaths.find((item) => item.id === selectedId)
  renderSelectedProbe(probe || null)
  if (!probe) {
    hideProbeMarkers()
    setProbeGrid(false)
    probeTimeline.hidden = true
    parallaxCard.hidden = true
    parallaxButton.setAttribute('aria-expanded', 'false')
    return
  }
  setProbeGrid(true)
  probeTimeline.hidden = false
  // Auto-open the "why a spiral?" explainer so the diagram is seen, not hidden
  // behind a button — it carries the parallax story the map no longer animates.
  parallaxCard.hidden = false
  parallaxButton.setAttribute('aria-expanded', 'true')
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
    // Scrubbing rides along too, so the pair never scrolls off-screen mid-drag.
    const probe = probePaths.find((item) => item.id === selectedId)
    if (probe) followProbe(probe, Number(timelineRange.value) / Number(timelineRange.max))
    updateTimeline()
  })
})

// Play simulator: sweep the whole track from launch to today so the trajectory
// draws itself out, then settle at the present position.
const PROBE_PLAY_DURATION = 84000
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
  const max = Number(timelineRange.max)
  const atEnd = Number(timelineRange.value) >= max
  const startFraction = atEnd ? 0 : Number(timelineRange.value) / max
  // A fresh full play-through zooms in and rides along; resuming a paused scrub
  // keeps the current zoom so we don't yank the view mid-inspection.
  if (atEnd) setProbeFov(FOLLOW_FOV)
  followProbe(probe, startFraction)
  setProbeGrid(true)
  probePlaying = true
  setProbePlayLabel()
  const token = (probePlayToken += 1)
  const startedAt = performance.now()
  // Advance by arc length (constant angular speed), not by time — see
  // buildProbeGeometry. startU is the arc position of a resumed scrub.
  const startU = arcAtFraction(probe, startFraction)
  function step(now) {
    if (token !== probePlayToken) return
    const progress = Math.min((now - startedAt) / PROBE_PLAY_DURATION, 1)
    const u = startU + (1 - startU) * progress
    const fraction = fractionAtArc(probe, u)
    timelineRange.value = String(Math.round(fraction * max))
    followProbe(probe, fraction) // ride along: keep the satellite centred as it travels
    updateTimeline()
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      probePlaying = false
      setProbePlayLabel()
      // Settle the icon onto its exact projected spot now the camera has stopped.
      updateProbeMarkers(probe, fraction)
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
  if (SHOW_PROBES) {
    try {
      const probes = await (await fetch(probesUrl)).json()
      for (const probe of probes) {
        buildProbeGeometry(probe)
      }
      probePaths = probes
      anchors.push(...probesToAnchors(probes))
    } catch {
      // Probe layer is optional; the sky anchors must never depend on it.
    }
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
  // Boot the live sky map immediately — the probe-ribbon overload that used to
  // peg the main thread is fixed (ribbons decimated), so the interactive map is
  // safe to be the default landing experience again.
  await ensureAladin()
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

// Sky-map fullscreen. Prefer the real Fullscreen API (true immersive view, Esc to
// exit); fall back to a fixed-position "maximize" where the element API is missing
// or unreliable (notably iPad Safari). Either path enlarges the whole .hero-view, so
// the anchor hotspots and survey chip stay usable, and a resize nudge lets Aladin and
// the hotspot overlay re-flow to the new size.
const fsButton = document.querySelector('[data-fullscreen]')
const fsTarget = document.querySelector('.hero-view')

function fsActiveEl() {
  return document.fullscreenElement || document.webkitFullscreenElement || null
}
let pseudoFull = false
function fsIsOn() {
  return Boolean(fsActiveEl()) || pseudoFull
}

function syncFullscreen() {
  const on = fsIsOn()
  document.body.classList.toggle('map-pseudo-full', pseudoFull)
  fsButton.classList.toggle('is-full', on)
  fsButton.setAttribute('aria-pressed', String(on))
  fsButton.setAttribute('aria-label', I18N.t(on ? 'aria.fullscreenExit' : 'aria.fullscreen'))
  // Let the new size settle, then re-flow the map + overlay markers.
  requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
  setTimeout(() => window.dispatchEvent(new Event('resize')), 260)
}

function toggleFullscreen() {
  if (fsIsOn()) {
    if (fsActiveEl()) {
      (document.exitFullscreen || document.webkitExitFullscreen || (() => {})).call(document)
    }
    if (pseudoFull) {
      pseudoFull = false
      syncFullscreen()
    }
    return
  }
  const request = fsTarget.requestFullscreen || fsTarget.webkitRequestFullscreen
  if (request) {
    try {
      const result = request.call(fsTarget)
      if (result && typeof result.catch === 'function') {
        result.catch(() => { pseudoFull = true; syncFullscreen() })
      }
    } catch {
      pseudoFull = true
      syncFullscreen()
    }
  } else {
    pseudoFull = true
    syncFullscreen()
  }
}

if (fsButton && fsTarget) {
  fsButton.addEventListener('click', toggleFullscreen)
  document.addEventListener('fullscreenchange', syncFullscreen)
  document.addEventListener('webkitfullscreenchange', syncFullscreen)
  // Esc leaves the CSS-fallback maximize (the real API handles Esc itself).
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && pseudoFull) toggleFullscreen()
  })
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
