/*
 * Bilingual content store for the main explorer shell — the single source of
 * truth for every UI string in index.html / main.js. Each entry is a
 * { zh, en } pair; main.js registers this into window.I18N and resolves the
 * active language at render time.
 *
 * To add a string: append a { zh, en } entry with a namespaced key, then use
 * it via I18N.t('key') in JS or data-i18n="key" in the template. English must
 * follow TRANSLATION-GUIDE.md (professional, plain, science-museum register).
 */
export const UI = {
  // ---- Top bar & navigation ----
  'topbar.eyebrow': { zh: '第一阶段 / 真实数据模式', en: 'Phase One / Real-Data Mode' },
  'topbar.title': { zh: '星空照片探索器', en: 'Cosmic Photo Explorer' },
  'topbar.subtitle': {
    zh: '从真实巡天数据进入银河：先看整片天空，再拉近到可以辨认的天区。',
    en: 'Step into the Milky Way through real survey data — take in the whole sky first, then zoom in to regions you can name.',
  },
  'nav.overview': { zh: '银河总览', en: 'Galaxy Overview' },
  'nav.constellations': { zh: '星座 →', en: 'Constellations →' },
  'nav.solar': { zh: '太阳系 →', en: 'Solar System →' },
  'nav.messengers': { zh: '深空信使 →', en: 'Deep Space Messengers →' },
  'nav.stations': { zh: '空间站 →', en: 'Space Stations →' },
  'nav.observatories': { zh: '观星台 →', en: 'Observatories →' },
  'nav.reference': { zh: '来源 →', en: 'Sources →' },

  // ---- Hero caption ----
  'hero.kicker': { zh: '真实天空 / 可交互巡天底图', en: 'Real Sky / Interactive Survey Imagery' },
  'hero.title': { zh: '把银河拉近', en: 'Bring the Milky Way Closer' },
  'hero.text': {
    zh: '拖动天空可以自由探索；闲置时，它会沿银河系真实自转方向缓缓转动。总览使用 Gaia DR3，近距离自动切到 DSS2。',
    en: 'Drag the sky to explore freely; when idle, it slowly turns along the Milky Way’s real rotation direction. The overview uses Gaia DR3, and close-ups switch automatically to DSS2.',
  },

  // ---- Sky-map loading state ----
  'sky.loading': { zh: '正在加载天图…', en: 'Loading sky map…' },

  // ---- Survey chip ----
  'survey.dss2': { zh: 'DSS2 照片', en: 'DSS2 Photo' },
  'survey.gaia': { zh: 'Gaia 测量图', en: 'Gaia Map' },

  // ---- Side panel labels ----
  'panel.mode': { zh: '模式', en: 'Mode' },
  'panel.status': { zh: '状态', en: 'Status' },
  'panel.target': { zh: '当前目标', en: 'Current Target' },
  'panel.boundary': { zh: '边界', en: 'What You’re Seeing' },
  'panel.regions': { zh: '天区', en: 'Sky Regions' },
  'panel.explain': { zh: '解释层', en: 'Explainers' },
  'panel.next': { zh: '下一步', en: 'Next' },
  'panel.timeMachine': { zh: '时间机器', en: 'Time Machine' },
  'panel.modeValue': { zh: '真实数据底图', en: 'Real-data base imagery' },
  'panel.loadingAnchor': { zh: '正在加载锚点…', en: 'Loading regions…' },
  'panel.detailsDefault': {
    zh: '这里不再只是静态背景，而是可以从真实天空数据进入的探索界面。',
    en: 'This is no longer a static backdrop — it’s a way into the sky through real observational data.',
  },
  'btn.nasaOpen': { zh: '在 NASA 图库看这里', en: 'See this in the NASA library' },

  // ---- Probe time machine ----
  'probe.play': { zh: '▶ 从头播放', en: '▶ Play from launch' },
  'probe.playing': { zh: '⏸ 暂停', en: '⏸ Pause' },
  'probe.parallaxBtn': { zh: '你知道吗？为什么是螺旋', en: 'Did you know? Why a spiral' },
  'probe.realOrbitNote': {
    zh: '地图上画的是<strong>从地球看过去的方向</strong>（演示效果），所以是螺旋。想看探测器真正的三维轨道 → <a class="inline-link" href="messengers.html">深空信使</a>',
    en: 'The map shows the <strong>direction as seen from Earth</strong> (a demo), which is why it spirals. For each probe’s real 3D orbit → <a class="inline-link" href="messengers.html">Deep Space Messengers</a>',
  },
  'probe.dateLabel': { zh: '{date} · 它当时在天上的这个方向', en: '{date} · where it appeared in the sky then' },
  'probe.todayLabel': { zh: '今天 · 距离约 {dist} AU', en: 'Today · about {dist} AU away' },
  'probe.detailsSuffix': {
    zh: '银色丝带是它 {year} 年出发以来在天幕上划过的真实轨迹（JPL Horizons 数据），此刻距离约 {dist} AU（1 AU = 日地距离）。',
    en: 'The silver ribbon is its real track across the sky since launch in {year} (JPL Horizons data); it is now about {dist} AU away (1 AU = the Earth–Sun distance).',
  },

  // ---- Parallax explainer ----
  'parallax.lead': {
    zh: '你知道吗？地图上卫星飞的是它<strong>真实的直线轨道</strong>。但我们在地球上亲眼看到它划过天空的轨迹，其实是一条<strong>螺旋（弹簧形）</strong>——原因就在下面这张图里。',
    en: 'Did you know? On the map the probe flies its <strong>real, near-straight path</strong>. But the track we actually watch it trace across the sky from Earth is a <strong>spiral (a spring)</strong> — the diagram below shows why.',
  },
  'parallax.jan': { zh: '1月', en: 'Jan' },
  'parallax.jul': { zh: '7月', en: 'Jul' },
  'parallax.apparent': { zh: '表观：弹簧', en: 'Apparent: a spring' },
  'parallax.straight': { zh: '探测器实际沿直线飞离太阳 →', en: 'The probe really flies in a near-straight line away from the Sun →' },
  'parallax.p1': {
    zh: '<strong>探测器几乎是沿直线飞离太阳的——它没有在天上画弹簧。</strong>弹簧是我们自己「画」上去的。',
    en: '<strong>The probe flies in a nearly straight line away from the Sun — it does not trace a spring in the sky.</strong> The spring is something we draw onto it.',
  },
  'parallax.p2': {
    zh: '地球每年带着我们绕太阳转一整圈，观测点来回摆动约 3 亿公里（±1 个日地距离）。从这个来回移动的位置看同一个探测器，它相对遥远背景星空的方向就每年左右摆一次——这叫<strong>视差</strong>。把探测器缓慢的真实漂移，叠上这一年一次的摆动，画在天上就成了弹簧／螺旋。',
    en: 'Once a year the Earth carries us all the way around the Sun, swinging our vantage point back and forth by about 300 million kilometres (±1 Earth–Sun distance). Seen from that moving vantage point, the same probe shifts its direction against the distant background stars once each year — this is <strong>parallax</strong>. Lay that yearly sway on top of the probe’s slow, genuine drift, and on the sky it becomes a spring, or helix.',
  },
  'parallax.p3': {
    zh: '离得越近（出发早期）视差环越大，越飞越远环越缩越小。这正是天文学测量恒星距离用的同一招。',
    en: 'The closer the probe (its early years), the larger the parallax loops; the farther it travels, the tighter they shrink. This is the very same trick astronomers use to measure the distances to stars.',
  },

  // ---- Explainer buttons + cards ----
  'btn.bortle': { zh: '光污染阶梯', en: 'Light-Pollution Ladder' },
  'btn.galaxy': { zh: '跳出银河系', en: 'Step Outside the Galaxy' },
  'btn.apod': { zh: 'NASA 今天看什么', en: 'NASA’s Picture Today' },
  'apod.loading': { zh: '正在向 NASA 查询今天的天文图…', en: 'Asking NASA for today’s astronomy picture…' },
  'apod.imgAlt': { zh: 'NASA 每日一图', en: 'NASA Astronomy Picture of the Day' },
  'apod.titleLine': { zh: '<strong>{title}</strong>（{date}）', en: '<strong>{title}</strong> ({date})' },
  'apod.videoLink': { zh: '今天是段视频，去看 ↗', en: 'Today’s picture is a video — watch it ↗' },
  'apod.explainZh': { zh: '{text}…（英文原文，<a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" rel="noreferrer">APOD 官网 ↗</a>）', en: '{text}… (<a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" rel="noreferrer">full text at APOD ↗</a>)' },
  'apod.failed': { zh: '查询失败——NASA 的免费接口偶尔限流，过一会儿再点一次。', en: 'The query failed — NASA’s free endpoint is occasionally rate-limited; try again in a moment.' },
  'img.bortleAlt': { zh: 'Bortle 光污染等级示意图', en: 'Diagram of the Bortle light-pollution scale' },
  'bortle.text': {
    zh: 'Bortle 标尺用 1 到 9 级描述夜空黑暗程度，级别越高，城市灯光对星空的遮蔽越明显。今天许多人看不到照片里的银河，主要不是银河消失了，而是城市光污染把它淹没在夜空背景里。',
    en: 'The Bortle scale rates how dark the night sky is from 1 to 9 — the higher the number, the more city light drowns out the stars. Most people today can’t see the Milky Way from these photos not because it has vanished, but because urban light pollution washes it into the background glow.',
  },
  'img.galaxyAlt': { zh: '银河系俯视示意图（艺术想象，基于真实测量）', en: 'Top-down illustration of the Milky Way (artist’s impression, grounded in real measurements)' },
  'galaxy.p1': {
    zh: '这是银河系的俯视示意图（NASA/JPL-Caltech/R. Hurt，基于真实测量绘制）。注意"示意"两个字：人类没有任何一张从外面拍的银河系照片——飞得最远的旅行者 1 号走了近 50 年，也才离家 0.003 光年，而想拍到全貌得飞出去几万光年。所有"银河系全景"都是根据真实测量画出来的。',
    en: 'This is a top-down illustration of the Milky Way (NASA/JPL-Caltech/R. Hurt, drawn from real measurements). Note the word “illustration”: there is no photograph of the Milky Way taken from outside it. Voyager 1, our most distant craft, has travelled nearly 50 years and is still only 0.003 light-years from home, while capturing the whole thing would mean flying tens of thousands of light-years out. Every “panorama of the Milky Way” is painted from real measurements.',
  },
  'galaxy.p2': {
    zh: '但我们有一面真实的镜子：仙女座星系。它在 254 万光年外，和银河系是同类型的旋涡星系——在锚点列表里点开它，看到的那团旋涡，差不多就是别人眼中的我们。这是人类唯一能"看见自己"的方式，而且那是货真价实的照片。',
    en: 'But we do have one real mirror: the Andromeda Galaxy. It lies 2.54 million light-years away and is a spiral galaxy of the same kind as ours — open it in the region list, and the spiral you see is roughly what we look like to someone else. It is the only way we can truly “see ourselves,” and it is a genuine photograph.',
  },
  'galaxy.p3': {
    zh: 'Gaia 精确测量的恒星，大多在太阳周围几千光年的范围内。这已经是人类历史上最大的三维星图，但放到直径约十万光年的整个银河系里，仍然只是家门口的一小片。宇宙地图，才刚刚开始画。',
    en: 'The stars Gaia has measured precisely lie mostly within a few thousand light-years of the Sun. It is already the largest three-dimensional star map in human history, yet against the whole Milky Way — about a hundred thousand light-years across — it is still just a patch near our doorstep. The map of the cosmos has only begun to be drawn.',
  },
  'boundary.note': {
    zh: '底图边界说明：Gaia 测量的是恒星位置与亮度，不是深空长曝光照片；DSS2 来自上世纪照相底片数字化，近看会保留底片和拼接痕迹。',
    en: 'About the base imagery: Gaia measures the positions and brightness of stars, not deep-sky long-exposure photos; DSS2 comes from last century’s digitised photographic plates, so close up you’ll still see plate grain and seams.',
  },

  // ---- Next-step actions & tour ----
  'btn.tour': { zh: '自动漫游', en: 'Auto Tour' },
  'btn.tourStop': { zh: '停止漫游', en: 'Stop Tour' },
  'btn.reset': { zh: '重置视野', en: 'Reset View' },
  'tour.group.summer': { zh: '夏季银河', en: 'Summer Milky Way' },
  'tour.group.autumn': { zh: '秋冬星空', en: 'Autumn–Winter Sky' },
  'tour.group.south': { zh: '南天深空', en: 'Southern Deep Sky' },
  'tour.group.probes': { zh: '深空信使', en: 'Deep-Space Messengers' },
  'tour.dwell': { zh: '每站停留', en: 'Dwell per stop' },
  'tour.dwell4': { zh: '4 秒', en: '4 s' },
  'tour.dwell6': { zh: '6 秒', en: '6 s' },
  'tour.dwell10': { zh: '10 秒', en: '10 s' },

  // ---- ARIA / accessibility ----
  'aria.skyView': { zh: '可交互星空视图', en: 'Interactive sky view' },
  'aria.fullscreen': { zh: '全屏查看天图', en: 'View the sky map fullscreen' },
  'aria.fullscreenExit': { zh: '退出全屏', en: 'Exit fullscreen' },
  'aria.timeline': { zh: '轨迹时间轴', en: 'Trajectory timeline' },
  'aria.lightbox': { zh: 'NASA 大图', en: 'NASA full-size image' },

  // ---- NASA modal & lightbox ----
  'nasa.modalTitle': { zh: 'NASA 图库', en: 'NASA Library' },
  'nasa.modalTitleFor': { zh: 'NASA 图库 · {name}', en: 'NASA Library · {name}' },
  'nasa.close': { zh: '关闭 NASA 图库', en: 'Close NASA library' },
  'nasa.footer': { zh: '图片版权归 NASA 及其合作机构所有，点击缩略图直接看大图。', en: 'Images are © NASA and partner institutions; click a thumbnail to open it full size.' },
  'nasa.none': { zh: '这个天区在 NASA 图库里没有直接匹配的照片。', en: 'The NASA library has no direct photo match for this region.' },
  'nasa.querying': { zh: '正在向 NASA 查询…', en: 'Querying NASA…' },
  'nasa.failed': { zh: '查询失败，可能是网络问题。', en: 'The query failed — possibly a network issue.' },
  'nasa.defaultTitle': { zh: 'NASA 图像', en: 'NASA image' },
  'lightbox.loading': { zh: '正在加载大图…', en: 'Loading full-size image…' },
  'lightbox.open': { zh: '在 NASA 页面打开 ↗', en: 'Open on NASA’s site ↗' },
  'lightbox.close': { zh: '关闭大图', en: 'Close full-size image' },
  'lightbox.fail': { zh: '大图加载失败，可以去 NASA 页面查看。', en: 'The full-size image failed to load — try the NASA page instead.' },

  // ---- Boundary (survey) copy ----
  'boundary.gaiaTitle': { zh: '真实数据 · Gaia DR3 官方全天图', en: 'Real data · Gaia DR3 official all-sky map' },
  'boundary.gaiaCopy': {
    zh: '这层底图来自 ESA Gaia DR3 的官方全天渲染，基于约 18 亿颗被实际测量的恒星位置与亮度。它适合做银河的大尺度总览，而不是深空长曝光照片。近距离下它会显出颗粒感——每个亮点都是一颗被单独测量的恒星，这正是"测量图"和"照片"的区别。',
    en: 'This layer is ESA’s official Gaia DR3 all-sky rendering, built from the measured positions and brightness of about 1.8 billion stars. It’s made for the large-scale overview of the Milky Way, not for deep-sky long exposures. Up close it turns grainy — each point is a single, individually measured star, and that is exactly what separates a “measurement map” from a “photograph.”',
  },
  'boundary.dss2Title': { zh: '真实数据 · DSS2 巡天照片', en: 'Real data · DSS2 survey photography' },
  'boundary.dss2Copy': {
    zh: '这层底图来自 DSS2 数字化巡天照片，放大到具体天区时能看到真实照相底片记录下的星场。它更适合近距离查看星云、暗云和密集星区。',
    en: 'This layer is the DSS2 digitised survey photography; zoom into a specific region and you see a star field recorded on real photographic plates. It’s better suited to close-up views of nebulae, dark clouds and dense star regions.',
  },

  // ---- Dynamic status & next-step lines ----
  'status.overview': { zh: '总览模式', en: 'Overview mode' },
  'status.zoomedTo': { zh: '已拉近：{name}', en: 'Zoomed in: {name}' },
  'status.backToOverview': { zh: '返回总览', en: 'Returning to overview' },
  'status.touring': { zh: '漫游中 ({i}/{n})：{name}', en: 'Touring ({i}/{n}): {name}' },
  'status.stopped': { zh: '已停止：{name}', en: 'Stopped: {name}' },
  'status.stoppedTour': { zh: '已停止漫游', en: 'Tour stopped' },
  'status.error': { zh: '出错', en: 'Error' },
  'next.clickRegion': { zh: '点击一个天区开始拉近。', en: 'Click a region to zoom in.' },
  'next.dragOrSwitch': { zh: '可以继续拖动天空，或切换到另一个天区。', en: 'Keep dragging the sky, or switch to another region.' },
  'next.tourEnded': { zh: '漫游结束后可以重新选择任意天区。', en: 'When the tour ends you can pick any region again.' },
  'next.tourDwell': { zh: '自动漫游会停留片刻，然后前往下一站。', en: 'The tour pauses briefly, then moves to the next stop.' },
  'next.pickGroup': { zh: '先在下面勾选至少一组天区，再开始漫游。', en: 'Tick at least one group below before starting the tour.' },
  'next.dragOrRestart': { zh: '可以继续拖动天空，或重新开始自动漫游。', en: 'Keep dragging the sky, or start the tour again.' },

  // ---- Month names for probe dates ----
  'date.format': { zh: '{year} 年 {month} 月', en: '{month} {year}' },
  'month.1': { zh: '1', en: 'January' },
  'month.2': { zh: '2', en: 'February' },
  'month.3': { zh: '3', en: 'March' },
  'month.4': { zh: '4', en: 'April' },
  'month.5': { zh: '5', en: 'May' },
  'month.6': { zh: '6', en: 'June' },
  'month.7': { zh: '7', en: 'July' },
  'month.8': { zh: '8', en: 'August' },
  'month.9': { zh: '9', en: 'September' },
  'month.10': { zh: '10', en: 'October' },
  'month.11': { zh: '11', en: 'November' },
  'month.12': { zh: '12', en: 'December' },

  // ---- Fatal error states ----
  'error.title': { zh: '锚点或星图加载失败', en: 'Failed to load regions or sky map' },
  'error.summary': { zh: '无法加载第一阶段的天区数据。', en: 'Could not load the Phase One region data.' },
  'error.next': { zh: '请先修复数据或 Aladin Lite 加载问题。', en: 'Please fix the data or the Aladin Lite loading issue first.' },
  'error.aladin': { zh: 'Aladin Lite 没有加载成功。', en: 'Aladin Lite failed to load.' },
}
