# HANDOFF

Updated: 2026-07-02

## ▶ 继续

下一步（Phase 2 候选，按价值排序，未开工）：
1. 锚点侧栏列表：M42 在总览视野外时热点不可见、无法点到——给面板加一个天区列表入口（点列表也能 tween 过去）。
2. 更多锚点 + 每个锚点的近景叙事文案（DSS2 近景很能打，值得多做几个目标）。
3. 解释层扩展：Gaia 观测边界可视化（他仓里 forward-final-frame 的银河系外俯视叙事）。

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
