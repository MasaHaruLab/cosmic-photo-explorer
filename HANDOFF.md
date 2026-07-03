# HANDOFF

Updated: 2026-07-03（整站双语 + 探测器模拟器 + 移动端切换钮修复，**全部已部署上线**）

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

**Increment B（进行中）：火星 + 月球地面 360° 沉浸式全景**。素材注意：Mastcam-Z 360 全景
（mastcamz.asu.edu，署名 NASA/JPL-Caltech/ASU/MSSS）是**柱面投影、单文件 166–181MB**，需下采样 +
投影处理（柱面≠等距圆柱，垂直 FOV 有限）；月球地面全景源（阿波罗全景）待定。做法拟同引擎 Three.js
内球模态（相机在球心，等距圆柱贴内壁 BackSide），复用 A 的模态外壳。

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
