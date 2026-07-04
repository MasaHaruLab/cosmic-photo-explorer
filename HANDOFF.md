# HANDOFF

Updated: 2026-07-04（**星座 3D 侧栏移动端可收起 + 手机默认折叠**，修「文字栏占满屏、挡星图、拖不动」。源 master 352be91 / 部署 gh-pages 9657555，**已推送并线上复验生效**）

## ⭐ 星座 3D 侧栏移动端可收起（2026-07-04，源 352be91 / 部署 9657555）

CEO 反馈：手机（微信 / 手机 Chrome）上「星座其实是障眼法」页的文字栏一直铺满屏幕、完全挡住星图，也用不了拖拽环绕。

**改动（`public/constellations.html` 单文件）：**
- 面板右上加「‹」收起钮 → 面板整体 `translateX(-100% - 30px)` + opacity 0 **向左滑出屏外**（`.panel.collapsed`）。
- 收起后左上冒出「ℹ️ 说明 / ℹ️ Info」再展开标签（`.panel.collapsed ~ .panel-open` 兄弟选择器控制显隐），点它展开。
- **`matchMedia('(max-width: 720px)')` 命中（=手机）时 boot 即默认折叠**；桌面照旧默认展开。i18n 加 `con.panel.open`。

**验证**：浏览器实测收起钮/展开标签显隐、`.collapsed` 最终位（右缘 -12px = 彻底移出左侧屏外）、桌面默认展开；`curl` 线上 constellations.html 命中新代码（10 处）。⚠️ 隐藏标签页会**冻结 CSS transition**（读到中间值像「没动」，见记忆 `feedback_hidden_tab_verification_is_fake_green`）→ 关掉 transition 直接读最终值确认。
⚠️ 微信/手机 Chrome **会缓存旧页**，CEO 端如未回缩需手动刷新 / 清缓存。

---

Updated: 2026-07-03（**主页探测器改造「卫星贴身跟随 + 视差科普卡」+ 星座扩充「猎户座/仙后座」，均已部署**。源 master cb9a0fd / 部署 gh-pages 32c2695，**已推送，Pages 构建 + 新西兰边缘缓存约 10 分钟**）

## ⭐ 当前最新状态（2026-07-03 晚，源 cb9a0fd / 部署 32c2695）—— 取代下方「静态默认」旧方案

**主页「大球」= 可交互 Aladin 天图重新做回默认**（静态默认被 CEO 否决：真实可交互底图才是项目意义）。整页卡死真凶 =
探测器轨迹带每帧 16k+ 顶点钉主线程 → 已用保形 RDP 抽稀根治（背景常驻仅 ~231 顶点）。

**探测器轨迹交互（`src/main.js` / `content.js` / `style.css`，源 bc72d11）：**
- 地图上**只画真实(去视差)直线轨道**，一个 🛰 卫星图标骑在上面，**相机贴身跟随**（否则 195° 弧一掠而过「嗖没影」）。
- 播放**按角距离(arc-length)匀速推进**，不再早快晚慢；卫星播放时**钉画面正中**避免快速平移拖影。时长 84s（CEO 定，×3×3）。
- **表观螺旋(视差圈)不画在地图上**（动态旋转会晕）→ 改成**右栏静态「你知道吗？为什么是螺旋」科普卡 + 简图**（太阳/地球公转/视差 sightline），选中探测器**自动展开**。
- 去视差 = 表观路径按 1 年窗口滑动平均；卫星/相机取全分辨率位置，画线用 RDP 简化。

**星座 3D 扩充（`public/constellations.html`，源 cb9a0fd）：**
- 从「只有北斗七星」→ **三个星座 + 切换器**：北斗七星 / 猎户座 / 仙后座。
- 每个星座**整体等比缩放到统一工作半径(90)** → 复用北斗那套调好的常数（精灵大小/轨道 28-320/阈值）；侧栏仍显示**真实距离**。
- 猎户座是最炸的「散架」（腰带三星 ~1200-2000 光年却从地球看共线）。**猎户/仙后距离标注为视差示意值**（data.md 警告）。

**验证**：build 干净、无 console 报错、切换器 3 星座星数正确(7/7/5)、boot=北斗、探测器选中面板自动弹卡、卫星钉中心。
⚠️ **隐藏标签页测不了的**（假绿灯，见记忆 `feedback_hidden_tab_verification_is_fake_green`）：卫星跟随的**丝滑/匀速手感**、星座**转动散架**的视觉、84s 匀速节奏是否合适 —— 已 `open` 本地预览让 CEO 前台自测。

### 📦 v2 版待办（2026-07-03 收口，本次不做，全部移入 v2）
CEO 定：**本轮到此收口，网站初步做好、已上线**；以下体验微调与增强留到 v2 再动。
1. **探测器播放节奏**：84s 恒速是否偏长 / 想让卫星在「现在」（近几年）多停一会儿再收；相机跟随 fov（现 20°）松紧。
2. **卫星图标**：大小 / 颜色是否加强（CEO 要「够大、别小」，现约 40px；可再评）。
3. **门槛1 · 国内访问**：镜像故障切换（澳洲 CSIRO / AWS S3 就近优先、法国兜底）+ 自托管 Gaia DR3 概览瓦片。见下方旧笔记的镜像清单。
4. **星座 3D**：可继续加星座（引擎已通用，追加数据+按钮即可）；猎户/仙后距离目前为视差示意值，v2 可用 HYG/VizieR 重核精确值。
5. **（元）复利**：把 constellations 三星座这套「统一工作半径 + 复用常数」沉淀成可复用套路。

## ⚠️（已作废）主页银河「大球」解卡 —— 静态默认 + 懒加载 Aladin（2026-07-03，源 de2dda9 / 部署 3e5030e）

CEO：主页那个可拖拽的银河「大球」今天下午开始不动了，整个浏览器卡死（按键/滚动全失灵、点击几分钟后才响应）。
根因：`index.html` 每次进主页都同步加载法国 CDS 的 Aladin Lite 天图，它的实时 HiPS 瓦片流会把主线程钉在 100%
→ 前台整页冻住（我们自托管的 Three.js 页面「北斗七星」「太阳系」始终丝滑，反证问题只在 Aladin）。
CEO 拍板：**落地页默认放自托管静态银河图秒开，想玩再点按钮加载可交互天图**（呼应「能搬都搬本地 in case 国内打不开」）。

**改动（master de2dda9，5 文件 + 1 图）：**
- `index.html`：**删掉** head 里同步加载 aladin.js 的 `<script>`（`latest` 别名）——不再自动加载/卡死。
- `public/galaxy-panorama.jpg`：ESO / S. Brunier 银河 360° 全景（CC BY 4.0，540KB，1280×1024，自托管）。
- `src/main.js`：hero 内加 `.sky-static` 覆盖层（静态图 + 「▶ 进入可交互天图」按钮 + CC BY 署名）；新增
  `ensureAladin()` + `loadAladinScript()`——**动态注入版本锁定的 `3.8.1/aladin.js`**（不用 `latest`），
  boot 天图、隐藏静态层、飞到选中目标；`init()` 里删掉开机 `initAladin()`；`selectAnchor` 在 `!aladin`
  时改调 `ensureAladin({flyTo})`；右侧目标列表点击也会触发加载。`applySkyView/tweenToView/refreshSkyState`
  本就 `if(!aladin) return`，所以天图没加载时整页其余功能照常。
- `src/content.js`：`sky.enter/loading/staticNote/staticCredit` 中英双语（EN 零 CJK）。
- `src/style.css`：`.sky-static` 系列（电蓝霓虹按钮，z-index:3 盖住未定位的锚点标记）。

**验证（localhost 生产构建，网络/全局/DOM 事实——隐藏标签页也可靠）：**
① 落地：`window.A` 未加载、`#sky-view` 空、静态图 1280px 完成渲染、按钮就位、54 个目标按钮 → **卡死源默认消失**。
② 点按钮：注入 `3.8.1/aladin.js`、boot 天图（~4.3s）、静态层隐藏、`#sky-view` 挂 13 节点 → 懒加载路径 works。
⚠️ **无法在自动化里判的**：加载后前台拖拽天图的「手感」（隐藏标签页 rAF 暂停=假绿灯，见记忆
`feedback_hidden_tab_verification_is_fake_green`）——但这已不在关键路径（默认根本不加载）。**已 `open` 本地生产
构建到 CEO 默认浏览器让她前台自测**；live 版等 Pages+边缘缓存 catch up。

**待办**：CEO 前台确认解卡 → 若 OK 结案；其余静态页无此问题（本就自托管 Three.js）。

## ⭐ 3D 星座深度查看器 —— 北斗七星「障眼法」（2026-07-03，源 cb8ae61 / 部署 5ec33ca）

CEO：把星座标出来，星座其实是立体的——点名字飞到地球视角看见整个星座，一转视角连线的「形状」就散开，
看见星星真实的前后关系。「线还连着更直观」。「go 做一个 + 提取 skill 其它复利套用」。

**新页 `public/constellations.html`（自包含，首个星座 = 北斗七星）**：
- 七颗星按 Hipparcos 真实 (RA,Dec,距离) 摆进 3D 空间（80–124 光年）。**相机在原点=地球** → 七星投影成
  熟悉的勺子；拖动环绕 → 形状散开，两端天枢(123ly)、摇光(104ly)先甩出去（真天文：它们不属于大熊座移动星群）。

## ⭐ 3D 星座深度查看器 —— 北斗七星「障眼法」（2026-07-03，源 cb8ae61 / 部署 5ec33ca）

CEO：把星座标出来，星座其实是立体的——点名字飞到地球视角看见整个星座，一转视角连线的「形状」就散开，
看见星星真实的前后关系。「线还连着更直观」。「go 做一个 + 提取 skill 其它复利套用」。

**新页 `public/constellations.html`（自包含，首个星座 = 北斗七星）**：
- 七颗星按 Hipparcos 真实 (RA,Dec,距离) 摆进 3D 空间（80–124 光年）。**相机在原点=地球** → 七星投影成
  熟悉的勺子；拖动环绕 → 形状散开，两端天枢(123ly)、摇光(104ly)先甩出去（真天文：它们不属于大熊座移动星群）。
  **连线始终连着**（CEO 要的：看线被拉长，而非图案消失）。
- 引擎 = vendored Three.js r128 + OrbitControls（自托管，零外部依赖）。坐标转换 x=d·cosδ·cosα 等。
- 「🌍 回到地球视角」按钮：先 damping=false 跑一次 update() 清残余环绕动量再把相机放回原点，snap 干净
  （修了 reset 后 status 不回弹的 bug）。「显示到地球的视线」深度线可切；status 随「是否还在地球视角」实时变。
- 全双语（中文星名 天枢…摇光 + 西名 Dubhe…Alkaid），EN 零 CJK；署名放进面板内（i18n.js 改成
  register 先于 guard，页面可自带 .site-credit 元素仍被本地化）。首页 nav 加「星座 3D →」。

**验证**：Earth view = 正确北斗七星（截图）；**真鼠标拖动 → 勺子散架 + 连线保持 + status 翻「🌀已离开地球视角」
（money-shot 截图确证核心效果 works）**；EN 切换/西名/视线切换/零 CJK（JS 实测）。
⚠️ reset-after-drag 修复=逻辑级；最终自动复验被浏览器自动化 input 卡死挡住（drag+scroll 全失灵，非页面 bug，
是 CDP 会话卡住）——CEO 可 live 自测点「回到地球视角」。

**待办**：① CEO 看 live 效果拍板 ② **提取「3D 星座深度查看器」skill**（数据格式 + 坐标转换 + 地球视角在原点的取景
技巧 + 场景搭建 + 连线保持/形状散开机制，供复用到猎户/金牛/双子…其它星座）③ 满意后 nav 铺到其余 3 个静态页 +
扩更多星座。

## ⭐ 自托管迁移 + 图片瘦身 + 创作者署名（2026-07-03，源 cf815af / 部署 ddeb080）

## ⭐ 自托管迁移 + 图片瘦身 + 创作者署名（2026-07-03，源 cf815af / 部署 ddeb080）

CEO：尽量少依赖外部网站（in case 国内打不开 NASA），能搬的都搬到本地；把大图转 JPG；页脚署名。

**三个原子提交（master）：**
1. `c3f48a8 feat: 自托管 NASA 行星照片 + model-viewer`——两个可搬的外部运行时依赖搬本地：
   - 7 张任务行星照片（水…冥）下载到 `public/planets/`，solar.html 画廊缩略图 + 灯箱从
     images-assets.nasa.gov 改指本地；灯箱署名从一刀切「NASA/JPL-Caltech」改成**分行星准确署名**
     （水=NASA/JHU-APL/Carnegie、土=…/SSI 等，`PHOTO_CREDITS` map）。土星/天王星无 ~large，用 ~orig。
   - model-viewer 组件 vendored 到 `public/vendor/`，stations.html 从 unpkg 改指本地；reference.html
     署名改成文件实际携带的 **BSD-3-Clause**（原写 Apache-2.0 不准）。
   - **唯一剩下的外部嵌入 = Aladin Lite 天图（法国 CDS 斯特拉斯堡）**——月球/火星可拖转互动地图，
     是**在线瓦片流服务**（HiPS，几十 GB–TB 数据），静态站装不下、天生只能连源站。已跟 CEO 解释。
2. `f6080da perf: Bortle 讲解图 15MB→476KB，删 8.7MB 孤儿`——`bortle_scale.png`（3240×5760，占全站 1/3）
   降到 900×1600 JPEG q85 = 476KB 肉眼无损（瓦片标签仍清晰），main.js 改指 .jpg。`bortle_demo.png`
   （8.7MB，全站零引用的孤儿）删除（git 可恢复）。**dist 从 43MB → 20MB。**
3. `cf815af feat: 全站创作者署名`——共享 i18n.js 的 boot() 注入一次
   「由 AmbrosiaZ 与 Claude Code 共同打造 · 2026」/「Made by AmbrosiaZ & Claude Code · 2026」，
   带 data-i18n 随语言翻转；所有页（静态 + 打包 app 都 load 同一个 i18n.js）一致、未来页免费继承。

**子路径真浏览器实测全通**（localhost dist）：7 张行星照片本地全 servable（满分辨率）、灯箱本地大图 +
分行星署名正确（冥王星 NASA/JHU-APL/SwRI 已核）；stations 3D ISS 模型从本地 vendor+glb 完整加载渲染
（截图确认）；bortle JPG 加载；署名两语翻转、EN 模式全站零 CJK 残留；无任何 images-assets/unpkg 外链。

**部署**：master 已推 origin；dist rsync→gh-pages（**注意保住 `.nojekyll`**，rsync --delete 会误删，已补回）；
ddeb080 已 push。Pages 构建比往常慢（无 error），构建完 live URL：
https://masaharulab.github.io/cosmic-photo-explorer/ ——需 CDN 传播后复验（planets/vendor/bortle.jpg 200、
老 bortle.png 404、i18n.js 含 AmbrosiaZ）。

**注（「鸭哥」= grapeot）**：CEO 口中「鸭哥项目」= 本项目（reference.html 灵感来源署名 grapeot/鸭哥）。

## ⭐ 行星画廊 720°（2026-07-03）— Increment A 可旋转 3D 行星球，已部署 gh-pages 4037429

## ⭐ 行星画廊 720°（2026-07-03）— Increment A 可旋转 3D 行星球，已部署 gh-pages 4037429

CEO：太阳系行星画廊做 720° 全景，「两个都要」= ①全部行星可拖转 3D 球体 ②火星+月球额外地面沉浸式全景。
分两 increment 交付（先球体上线拿价值，再地面全景）。

**Increment A（860c12f 源 / 4037429 部署，已上线）**：太阳系页画廊 6 颗行星（水/金/木/土/天/海）
点开 → 可拖转 3D 球体模态（自转 + 滚轮/双指缩放 + 「看任务原片」回退到 NASA 原图）。
- 引擎 Three.js r128 + OrbitControls，**自托管** `public/vendor/`，**首次开球才懒加载**（不拖慢页面）。
- 贴图 Solar System Scope 等距圆柱全球图（CC BY 4.0）自托管 `public/textures/`；土星环 UV 径向重映射 +
  绕 X 轴 26.7° 倾角（环呈椭圆非边缘线）；headlight 跟相机让正面永远亮。
- **冥王星故意保留原片**（新视野号只拍到一面，球体=半编造，守诚实底线）。
- 全双语（球体 UI + 来源页两张新卡：SSS 贴图、Three.js）；EN 零 CJK 残留。
- 子路径真浏览器实测：球体渲染出正确行星色（土星金 avgRGB[139,131,108]/木星棕）、真鼠标拖动转动
  （azΔ≈20°）、环按行星开关、看原片回退 + 页面 EN 切换全通。土星环椭圆截图已肉眼确认漂亮。

**Increment B（1c7c174 源 / 6e1892e 部署，已上线）：火星 + 月球地面 360° 沉浸式全景**。
月球/火星查看器下各加「🥾 站上表面 · 360°」钮 → 同一模态 pano 模式：相机在球心，360°×~vFOV 地面
全景贴在**球带（barrel）内壁**（geo.scale(-1,1,1) 从内看不镜像），拖动环顾 + 闲置缓慢自转。
vFOV 按每张图宽高比算（vaov=360*h/w），任意 360 全景不竖向拉伸。OrbitControls 在 pano 模式禁用、
改手动 lon/lat 驱动相机；pano↔globe 切换双向复位 camera/fov/background/controls。
- 火星：毅力号耶泽罗着陆点 PIA24422（NASA/JPL-Caltech，4646×1371，638KB，vaov106°）。
- 月球：阿波罗17号陶拉斯-利特罗 jsc2004e52775 降到6000宽（NASA/JSC，722KB，vaov66.7°，黑天空正确）。
  注：阿波罗是照片拼接，中间有轻微曝光接缝（诚实产物，非 bug）。
- 素材放弃了 Mastcam-Z（166-181MB 太大），改用 PhotoJournal 轻量版 638KB。
- 全双语（钮/caption/hint + 来源页地面全景卡）；EN 零残留。子路径真浏览器实测：两全景渲染 +
  真鼠标拖动环顾（Δlon≈34°）+ EN + pano↔globe 切换全通，两张全景截图肉眼确认。

**CEO 疑问已答（水星 vs 月球为何几乎一样）**：真实天文——都是无大气、灰色、满坑的岩石天体，本就像双胞胎。
已核文件无张冠李戴（2k_mercury.jpg MESSENGER vs 月球 Apollo/LROC，md5/分辨率/来源都不同）。
出了 scratchpad/mercury-vs-moon.html 侧栏对比 open 给她（月球有月海暗斑、水星没有）。

## ⭐ 静态页 EN 切换失效修复（2026-07-03，已部署 gh-pages a942afe）

CEO 反馈太阳系页 EN 按了无效。根因 = 子路径部署陷阱（**不是缓存/不是内容**）：
`public/` 四页（solar/observatories/stations/reference）用**绝对路径** `<script src="/i18n.js">`
加载引擎。Vite 会把入口 `index.html` 的 `/i18n.js` 重写为 `./i18n.js`，但 `public/` 页原样拷贝，
于是在 GitHub Pages 子路径 `/cosmic-photo-explorer/` 下 `/i18n.js` 指向域根 → **404**，
引擎从未加载 → 四页 EN 切换全死。旧验收只在 dist 根路径预览故没暴露（根路径下 `/i18n.js` 恰好 200）。
修复（3656c55）：四页改 `./i18n.js`。**验收改在子路径复现**（`http.server` 服 dist 父目录、走 `/dist/xxx.html`）：
真浏览器四页 EN 逐一实测——引擎加载、点击翻转 EN↔中文、CJK 残留全 0。线上 a942afe ~24s 生效。
教训：子路径站点验收必须在子路径下测，不能在根路径测（同一 bug 在根路径不可见）。
全局 skill `bilingual-static-site` 的 SKILL.md 里也写了 `src="/i18n.js"` 同款坑，待授权后修。

## ⭐ 移动端语言钮修复（2026-07-03，已部署 gh-pages 9cbf2c9）

CEO 反馈手机上看不到中英切换钮（清缓存 + `?2` 仍无效）。根因 = 真 CSS bug，非缓存：
`@media (max-width:900px)` 里 `.topbar-actions .badge:not(.badge-link){display:none}`
把切换钮也藏了（切换钮是 `.badge.badge-toggle`，属于 `.badge` 但不是 `.badge-link`）。
修复（139f74d）：选择器加 `:not(.badge-toggle)` 排除切换钮。浏览器选择器匹配确定性验证：
旧选择器命中切换钮=true、新选择器命中=false，且 shipped CSS 已是新选择器。构建绿，
已推 gh-pages（9cbf2c9），线上 ~30s 内验证新 bundle `index-DsMOhiRX.css` 生效。

## ⭐ 双语引擎 + 模拟器（2026-07-03，已部署 gh-pages）

CEO 睡前指令：全站中英双语（专业英译非机翻）+ 卫星轨迹点击播放模拟器 + 视差解释卡
+ 空间站详情，「后面全部直接走 不要停 / 你决定最佳方向不要最快方向 token 管够」。
**红线：未授权不推公开**（外部写入需明确授权），故只在本地 master 提交，未动 gh-pages。

- **3a4f3f5 整站双语引擎**：`public/i18n.js`（零依赖 classic script，静态页 + 打包 SPA
  共用 `window.I18N`）+ `src/content.js`（UI 文案 `{zh,en}` 唯一事实源）+ `data-i18n`/
  `-html`/`-attr` 声明式本地化 + 长春花蓝切换钮 + `localStorage['cosmic-lang']` 记忆。
  22 锚点 label/summary/details 全 `{zh,en}`。真浏览器实测 ZH↔EN 全量翻译无残留。
- **60c0e3f 三静态页双语**：观星台 / 太阳系 / 空间站，各自内联词典 + 专业英译；
  空间站 `<strong>` 用 `data-i18n-html` 保留，画廊 `data-cap` 用 `data-i18n-attr` 翻译。
- **818c336 来源页 + 翻译指南**：`reference.html`（16 张来源卡：Gaia DR3/DSS2/Aladin/
  JPL Horizons/NASA 图库+APOD/月火表面/model-viewer+ISS glTF+天宫渲染/天文台照片授权/
  Bortle+银河示意/grapeot 致谢）+ `TRANSLATION-GUIDE.md`（双语机制 + 英译标准 + 术语表
  + 「让 Claude 翻新内容」一句话指令）。顶栏「来源 →」链接全站已就位。
- **Batch-1（4f8a4e6，上次会话）探测器模拟器 + 视差**：Catmull-Rom 样条平滑（解 RA 回卷 +
  按转角自适应细分，多边形→丝滑）+「从发射播放」9 秒扫全程 + 视差解释卡（近直线飞、
  弹簧是地球公转视差）。本次实测：选旅行者 1 号 → 面板英文 → 播放 ▶→⏸→▶ 跑通 → 视差卡开合正常。
- **fa5f779 可复用逻辑提取分析** `REUSE-EXTRACTION.md`：只有 A（整站双语引擎）够格提升
  为全局 skill——**创建全局 skill = 持久化自我修改，待 CEO 授权**，其余标为片段/套路。
- 生产构建 QA：`npm run build` 绿；`dist` 全 5 页 200；stations 生产版 EN 零 CJK 残留、
  灯箱读到翻译后的 data-cap。站点默认语言已设回 zh（她先看中文）。

**下一步（等 CEO 醒）**：① 授权后 `cd app && npm run build` → 推 `dist` 到 `gh-pages`
force push 部署（做法见下「更新部署」）；② 授权后用 `skill-creator` 落地 `bilingual-static-site`
全局 skill；③ B-F 公众号复盘仍待写。

## 🌐 线上地址（上次已部署；本次双语改动尚未上线）

**https://masaharulab.github.io/cosmic-photo-explorer/**

- CEO 2026-07-02 口头批准公开（"好的 放吧"）。repo 转公开（原为旧冲刺私有备份，
  快进推送无历史丢失），dist 推 `gh-pages` 分支，Pages 已启用。
- ⚠️ 线上是 2026-07-02 版本；本次会话的双语 + 模拟器改动**只在本地 master，未部署**。
- 线上实测：Gaia 底图加载、10 锚点热点、列表点仙女座 → tween 到位
  (ra 10.68/dec 41.27/fov 3.5) + 自动切 DSS2、观星台页 200。
- **更新部署**：`cd app && npm run build` → 把 `dist/` 内容 commit 到 `gh-pages`
  分支 force push（scratchpad ghp 目录一次性 git init 的做法即可）。

## ▶ 当前队列权威（Phase 4，CEO 2026-07-02 批准："这空那空悟空都要"）

每批生命周期：数据/文案我写（品味活留主循环）→ main.js 改动派 Codex（预设裁定）
→ build 绿 + 前台真浏览器 QA（tween 必前台）→ commit → 推 gh-pages 部署 → CEO 可玩。

- [x] **B-W 冬季星空**（76f31d8 数据 + 7ba84f0 UI，已部署）：6 锚点 + 分组列表 +
      冬季大三角连线 + `group`/`tour` 字段。坐标 CDS Sesame 解析。漫游维持原 10 站。
- [x] **B-S 南天深空**：6 锚点（南十字与煤袋/半人马座ω/杜鹃座47/蜘蛛星云/南门二·比邻星/
      船帆座超新星遗迹），共 22 锚点，前台断言验证通过。
- [x] **B-V 深空信使**（ac372e8，已部署）：五探测器第四组锚点 + JPL Horizons 真实轨迹
      银丝带 overlay（`scripts/fetch_probe_paths.py` 烘焙，月采样，含视差螺旋）。
      前台截图验证：近景辫状螺旋 + 总览五带横跨银河，无 RA 回卷穿帮。事实抽检通过
      （旅行者 1 号 170.1 AU 蛇夫座 / 先驱者 10 号朝毕宿五）。绕地卫星按诚实边界归 B-E。
      刷新数据：重跑该脚本（改 TODAY）+ 重部署。
- [x] **B-E 观星台页「太空里的眼睛」**（f92f621，已部署）：Gaia 卫星本尊/哈勃/韦布/
      悟空号四卡。事实 WebSearch 核验（Gaia 2025-03-27 退役、DR4=2026-12-02；悟空号
      在轨 10 年+、2026-04 上 Nature）。悟空号无合规配图（Commons 只有台风悟空），走纯文字卡。
- [x] **B-P 太阳系**（d8ed8f8，已部署）：`solar.html`——月球（LROC 100m 默认/嫦娥二号
      7m 切换）+ 火星（Viking 彩色/MOLA 高程）双查看器，飞到按钮落点坐标实测精确
      （第谷 -11.36° / 奥林帕斯山 -133.8° 均正中）；7 行星 NASA 画廊+灯箱。
      spike 存 `spike/planets-spike.html`。同笔修复：丝带采样 5d（视差圈全圆滑）+
      悬停高亮从 Aladin 默认绿改为主题长春花蓝（CEO 反馈）。
- [x] **B-T 自动漫游可配置**（a8bfd78，已部署）：分组勾选（南天单选实测 9 站）+
      停留时长 4/6/10s + 空选守卫。BGM：CEO 正在亲自做曲，等文件到再接播放开关。
- [x] **B-N APOD 每日一图**（a8bfd78）：解释层「NASA 今天看什么」卡，实测当日图正常。
- [x] **B-X 丝带时间轴**（a8bfd78）：选中信使出「时间机器」滑杆，拖动丝带按日期
      生长 + 当时方向标记（滑到 30% = 1992 年 4 月实测精确），切走自动复原。
- [x] **B-Z 空间站详情页**（6ac69e0，已部署）：`stations.html`——ISS 用 NASA 官方
      glTF 三维模型（44.5MB 经 gltf-transform Draco+WebP 压到 3.3MB，model-viewer
      点击加载+自动旋转，真浏览器实测几何/贴图完好）+ 两张载人龙绕飞照片；天宫用
      Shujianyang CC BY-SA 4.0 全构型渲染图 + 事实卡（神舟二十三/首位香港航天员/
      一年驻留实验，WebSearch 核验）。ISS 2030 离轨事实核自 NASA 过渡计划。
      注意：NASA GLB 的 CORS 只放行自家域，必须自托管，不能热链。
      三页互链（主页顶栏/太阳系/观星台）。线上资产全 200 字节一致。
- [ ] **B-F 公众号复盘**：全做完后 CEO 主笔身份写"6-16 翻车到公开上线"（yutou-content +
      yutou-voice 强制门），我出草稿她拍板。

注：本会话 auto 模式把 `codex exec` 自主执行拦了（沙箱裁定）——UI 改动临时由主循环
亲手做（量小可控）；图片搜寻类派 GLM/agy 单发问答不受影响。

卡住协议：同一阻塞撞 3 次跳下一批；队列完即结案，不发明任务。

## Phase 3 已完成（2026-07-02，真浏览器实测）

- P3-C（d0598de + 9e72ca8，Codex）：vite base './' 相对路径改造（子路径托管可用）
  + 移动端断点（≤900px 单列：舞台在上、面板在下；390px 宽实测通过）。
- P3-A（f870db3）：观星台页 8 台全部配图（新增 FAST 航拍/Keck/Subaru/帕洛马/
  格林威治报时球，来源 Wikimedia Commons CC + NASA/JPL 公版，页脚全署名）；
  6 个「最新动态」官方直达位（URL 全部 curl 验活，帕洛马新闻页 404 故跳过）；
  页内链接相对化。
- P3-B（b387da9）：解释层新增「跳出银河系」卡——NASA/JPL-Caltech/R. Hurt 银河系
  俯视示意图 + Gaia 测量范围 vs 整个银河系的中文叙事。
- QA：观星台页 8 图零破图、解释卡开合正常、移动端单列布局正常（真 Chrome 实测）。

## Phase 2 已完成（2026-07-02，全部真浏览器实测）

- B4（3beea59）：锚点扩到 10 个天区（银心/心宿二/夏季大三角/天鹅暗隙/仙女座/昴星团/
  M42/船底座/大小麦哲伦云），中文叙事文案；夏季大三角连线 overlay。
- B5（fe84a3a）：天区列表侧栏（修复 M42 总览外点不到）+「自动漫游」十站电影感巡游
  （计数/停止/防陈旧计时器）。
- B6（c7eed0c）：近景「DSS2 照片 ↔ Gaia 测量图」双眼对比 chip（manual/auto 模式，
  tween/重置回 auto）。
- B7（bdb20c1）：观星台门户页 `/observatories.html`——8 个天文台中文介绍+官网直达，
  Rubin/VLT/ALMA 配 CC BY 4.0 官方图（署名在页脚）。Rubin 的 LSST 十年巡天 2026-06-30
  刚启动，文案已带此钩子。
- B8（0467a05）：每个天区「在 NASA 图库看这里」——images-api.nasa.gov 免密钥+CORS，
  弹窗 6 缩略图；点缩略图应用内灯箱直接看大图（尺寸后缀直链+回退链，b91a3e6），保留 NASA 详情页链接。按锚点缓存+防陈旧响应。页头「观星台 →」入口。
- 字幕自动隐藏（94a45ba）：CEO 反馈说明文字挡图——闲置/交互后淡出，悬停舞台底部浮现。

## 当前状态（2026-07-02 重启，全部实测验证）

- **路线已换**：放弃自渲 18 亿星管线（旧败因 = 照片感硬约束撞本地算力墙），改走
  Aladin Lite + 公共 HiPS（Gaia DR3 官方全天图作总览底图，DSS2 彩色巡天作近景）。
  照片感由 ESA/CDS 专业渲染保证，自有价值在锚点/叙事/解释层。
- **已完成并验证**（本地 `npm run build` 全绿；真浏览器前台实测 tween/换底图/热点跟踪）：
  - Batch 0 spike：四种公共底图可用性证明（`spike/`，证据截图在 `spike/evidence/`）。
    设计规则：宽视场用 Gaia/Mellinger（DSS2 有拼版格纹），FOV<30° 切 DSS2，>50° 切回（滞回带防抖）。
  - Batch 1：hero 从静态占位图换成 Aladin Lite 活天空；4 个天区锚点（银心/夏季大三角/
    心宿二·蛇夫座暗云/M42）带 2.4s 电影感 tween（log 空间 FOV 插值 + RA 最短弧）；
    锚点热点用 world2pix 投影跟踪；面板中文文案 + 按底图切换的边界说明。
  - Batch 2：解释层——光污染阶梯卡片（bortle_scale.png 复用自 gaia_allsky/outputs）+ 底图边界说明。
  - QA 修复（90ef995）：Aladin v3 三个 API 坑（target 按当前 cooFrame 解析 / 返回值是类数组
    不是 Array / getFov 的 fovY 竖版饱和 180°）。QA 用 `window.__cosmicDebug` 句柄。
- **学习收尾**：鸭哥 5 篇工作流笔记提炼进鱼头知识库 `02 AI工作流/星空探索/`（6 篇，
  含补写的源头笔记《星空探索——Gaia与宇宙照片》）；本地 125 万亮星小视场渲染 +
  线性画布重 tone + 分位数验证已亲手跑通（`gaia_allsky/outputs/learn_g11_*`）。

## 运行

```bash
cd app && npm run dev        # 开发
cd app && npm run build      # 构建（提交前必须绿）
python3 -m http.server 4311 -d app/dist   # 静态预览
```

## 真值模型

- 本文件 = 人类可读续点；repo git log = 事实源。
- 旧的 `.agent/current_batch.json` 看门狗体系已随重启退役，不再维护。
- 全局对账走 `~/.claude/ACTIVE_TASKS.md` board + `task-doctor`（锚：cosmic-explorer）。

## 历史（2026-06-16 第一次冲刺，为什么重启）

壳和流程机器完成但资产层为零（tiles 空、hero 是参考 JPG），当时 HANDOFF 自报
"Phase 1 完成"不实。根因：计划假设能复用 gaia_allsky 的离线渲染能力，但那条管线
要 6 亿星数据 + 几十~几百 GB 内存 + PixInsight，本地硬件不可行。教训已写进
知识库源头笔记。
