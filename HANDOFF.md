# HANDOFF

Updated: 2026-07-02（Phase 3 全部落地，已公开上线）

## 🌐 线上地址（已部署并真浏览器实测）

**https://masaharulab.github.io/cosmic-photo-explorer/**

- CEO 2026-07-02 口头批准公开（"好的 放吧"）。repo 转公开（原为旧冲刺私有备份，
  快进推送无历史丢失），dist 推 `gh-pages` 分支，Pages 已启用。
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
- [ ] **B-T 自动漫游可配置**：分组勾选 + 停留时长。BGM 裁定翻案：CEO 正在亲自做曲
      （2026-07-02 原话"bgm我正在做 你等着"）——预留音频开关位，等她交付文件接入。
- [ ] **B-N APOD 每日一图**（CEO 批"要要要"）：api.nasa.gov/planetary/apod（DEMO_KEY
      免注册），解释层加「NASA 今天看什么」入口弹窗；video 类型给链接。
- [ ] **B-X 丝带时间轴**（CEO 批）：选中信使时出时间滑杆，拖动看丝带从发射日长到今天
      + 当前点标记。数据无需重烘——采样均匀 5d，日期由 index 推算。
- [ ] **B-Z 空间站详情页**（CEO 追加）：国际空间站 + 中国空间站（天宫）。绕地卫星
      钉不上天图（诚实边界），走详情页：照片画廊 + 尽量 3D（ISS 找 NASA 官方 glTF 配
      model-viewer；天宫无公开 3D 则照片墙）。图片搜寻可派非 Anthropic 池。
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
