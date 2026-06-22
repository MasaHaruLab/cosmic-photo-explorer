# Cosmic Photo Explorer：停机复发根因分析与后续执行计划

**Goal:** 先判断这个长项目执行方式是否可行；如果可行，建立一个不会再反复“做一批就停住 / 状态与现实脱节”的执行方案，再恢复开发。

**Conclusion first:**
这个项目本身是可行的。
当前不可接受的不是产品方向，也不是技术路线，而是执行控制环出了问题。
如果不先修执行控制环，继续做功能只会重复浪费时间。

---

## 1. 当前现场事实

代码仓：`/Users/ambrosiazheng/cosmic-photo-explorer`

已落功能：
- Batch 1-5 已有 commit
- 最新功能 commit：`e215a0f feat: add target anchor overlay`

当前机器状态：
- `git status` 干净
- `.agent/current_batch.json` 显示 Batch 6 `zoom-transition` = `pending`
- `HANDOFF.md` 也写明 Batch 6 未启动
- preview 活着，watchdog 活着

已经暴露出的文档漂移：
- 实施计划文件里 `229-305` 行大体正确，但最后“下一步唯一动作”仍旧写着 Batch 5，这说明计划文件不是严格单源更新，存在残留旧状态。

结论：
- 目前不是“项目跑不动”
- 而是“每完成一个 batch 后，没有可靠机制把系统推进到下一个 batch 的真实开工状态”

---

## 2. 根因分析

### Root Cause A：把“对话回合”当作节奏单位，而不是把“batch 连续施工”当作节奏单位

表现：
- 完成一个 batch 后，会自然进入“汇报 / 收口 / 解释”模式
- 但不会在同一控制环里立刻进入下一 batch 的第一步实际实现

结果：
- 功能上已经停了
- 但主观上容易误以为“我还在处理这个项目”

这是最核心的根因。

### Root Cause B：控制环缺了一步——缺少“下一 batch 的立即开工动作”

当前协议写的是：
1. 验证
2. commit
3. 回写计划 / HANDOFF
4. 自动切到下一个 batch

但这里的“自动切到下一个 batch”实际上只做成了“状态切换”，没有做成“立即执行下一 batch 的第一条 repo 改动”。

也就是说，流程只完成了：
- bookkeeping

没有强制完成：
- first implementation action

结果：
- state 已经指向 next batch
- reality 还没有真正开工

### Root Cause C：watchdog 只能监控“真实在跑的 batch 是否 stall”，不能强制“pending batch 必须开工”

watchdog 的能力边界是：
- preview 挂没挂
- repo 最近有没有活动
- in_progress 的 batch 有没有卡住

它做不到的是：
- 发现一个 pending batch 长时间无人开工，然后自动纠正执行行为

所以 watchdog 不是错，但它不是“连续施工调度器”。

### Root Cause D：状态文件、HANDOFF、实施计划不是单一真源，更新时存在残留字段

证据：
- `current_batch.json` 正确
- `HANDOFF.md` 基本正确
- 但知识库里的实施计划仍残留旧的“下一步唯一动作 = Batch 5”

这说明目前不是 single-source-of-truth，而是：
- repo 现场状态一份
- repo handoff 一份
- 知识库计划一份
- 对话口头状态一份

多份状态一旦没有严格同步，就会重新制造漂移。

### Root Cause E：缺少“停机许可条件”的硬门槛

现在虽然写了“除非阻塞不应停”，但没有硬门槛来判定：
- 什么叫允许停
- 什么叫不允许停
- 停之前必须留下什么证据

结果就是：
- 汇报本身会被误判为一个合理停点

---

## 3. 这是不是说明我做不了长项目？

不是。

更准确地说：
- 当前这套“边做边聊”的控制逻辑，不足以稳定支撑长项目连续执行
- 但项目本身、功能拆分、技术难度，都没有显示出“不可做”

所以结论不是“不可行”，而是：
- 可行，但必须先把执行控制系统重构成更硬的流水线

如果不做这一步，再继续开发就是继续浪费时间。

---

## 4. 后续方案总原则

恢复开发前，先把执行方式改成下面这个模型：

### 新模型：一个 batch 只有两种合法结局
1. `completed`：功能实现 + 验证 + commit + 全部状态同步完成
2. `blocked`：明确阻塞原因 + 证据 + 需要你拍板的点 已写清楚

不再允许第三种隐含结局：
- “先停一下，等下一轮再开工”

### 新模型：切到下一 batch 时，必须同时满足两件事
1. 状态切换到 next batch
2. 下一 batch 的第一条实际 repo 改动已经发生

如果第 2 条没发生，那么状态必须继续显示：
- next batch = pending
- system = paused_after_previous_batch

不能再制造“好像已经在推进”的假象。

---

## 5. 具体执行计划（恢复开发前先做这些）

## Phase A：先修执行控制层，不做新产品功能

### Task A1：收敛单一真源

**Objective:** 把“当前在哪个 batch、是否已开工、下一步是什么”收敛到 repo 内单一真源。

**Primary files:**
- Modify: `/Users/ambrosiazheng/cosmic-photo-explorer/.agent/current_batch.json`
- Modify: `/Users/ambrosiazheng/cosmic-photo-explorer/HANDOFF.md`
- Modify: `/Users/ambrosiazheng/cosmic-photo-explorer/docs/watchdog.md`
- Modify: `/Users/ambrosiazheng/鱼头知识库/09 元工作流/宇宙交互产品-第一阶段实施计划-v1-2026-06-16.md`

**Plan:**
1. 定义单一真源：`.agent/current_batch.json`
2. 其他文档只允许“从它派生更新”，不能各写各的
3. 清掉知识库计划中的残留旧状态（例如还写 Batch 5 的“下一步唯一动作”）

**Verification:**
- 四处状态一致
- 搜不到与当前 batch 冲突的旧下一步描述

### Task A2：增加“停机状态”而不是只用 pending 掩盖暂停

**Objective:** 把“未开工”和“主动暂停”等状态明确区分。

**Primary files:**
- Modify: `.agent/current_batch.json`
- Modify: `docs/watchdog.md`
- Modify: `scripts/watchdog.py`

**Proposed status model:**
- `pending` = 已知下一批，但上一批刚收口，还未授权/未进入首个实现动作
- `in_progress` = 已开始真实 repo 改动
- `completed` = 本批已完成
- `blocked` = 有明确外部阻塞
- `paused` = 人为暂停，不应被解释成正在连续推进

**Why:**
现在 `pending` 同时承担“马上要做”和“已经停住”两种含义，不够用。

**Verification:**
- watchdog heartbeat 能明确反映 paused / blocked / pending / in_progress 的区别

### Task A3：把“自动切下一 batch”改成两段提交制

**Objective:** 防止 batch 完成后停在 bookkeeping。

**Execution rule:**
每个 batch 结束后分成两个动作：
1. 收口 commit：本 batch 功能 + 验证
2. 开工 commit 或首改动作：对下一个 batch 做第一条真实实现改动，随后才允许把状态切成 `in_progress`

如果做不到第 2 条：
- 明确写 `paused` 或 `blocked`
- 不能口头默认“我会继续”

**Verification:**
- 任一 `in_progress` batch 都能从 git diff / commit / working tree 找到对应实现痕迹

### Task A4：加入“连续执行许可门”

**Objective:** 让系统只有在满足条件时才自动继续。

**Permit to continue = all true:**
- 当前 batch 已验证
- 当前 batch 已 commit
- 状态文件/HANDOFF/计划同步完成
- 下一 batch 的目标明确到单一动作
- 不存在需要你拍板的冲突

否则：
- 必须写 `blocked` 或 `paused`
- 明确缺什么

---

## Phase B：只在控制层修好后，再恢复产品开发

### Batch 6 恢复条件
在下面条件全部满足前，不开 Batch 6：
1. Phase A 完成
2. 状态源收敛完成
3. 停机状态模型落地
4. 计划文件里不再存在陈旧“下一步唯一动作”

### Batch 6 实施计划（预览，不在本轮执行）

**Goal:** 让点击锚点后出现克制的镜头移动，而不是玩具感大跳转。

**Likely files:**
- Modify: `app/src/main.js`
- Modify: `app/src/style.css`
- Maybe create: `data/manifests/zoom-paths.json`

**Implementation shape:**
1. 用状态保存当前选中锚点对应的视图参数
2. 通过 CSS transform 或轻量 JS 插值，让 hero image 在点击后发生小幅平滑 pan/scale
3. overlay 与 caption/panel 保持同步
4. 保持“照片作为基底”，不转成地图 UI

**Verification:**
- 点击不同锚点时，画面出现平滑镜头变化
- 没有明显 UI 抖动
- 信息面板同步更新
- build 通过
- preview 可见

---

## 6. 风险与取舍

### 风险 1：修控制层会让短期功能进度看起来变慢
这是必要代价。
不先修控制层，后面每做 1 个 batch 都可能再浪费一轮时间。

### 风险 2：计划文件与 repo 状态双维护仍可能继续漂移
所以必须把 `.agent/current_batch.json` 设为唯一真源，其余全部从它派生更新。

### 风险 3：watchdog 容易被误以为“调度器”
必须明确：
- watchdog 只负责监控
- 不负责调度
- 连续施工靠执行协议，不靠 watchdog 幻觉

---

## 7. 验收标准：什么时候说明这个项目重新进入可控状态

满足以下 5 条，才算恢复执行：
1. 当前 batch 的真实状态只能由 repo 内单一真源定义
2. 所有状态文件与计划文件同步一致
3. 没有“已切到下一 batch 但尚未开工”的伪推进
4. 任一暂停都能被明确识别为 `paused` 或 `blocked`
5. 下一次 batch 切换后，能看到同一轮里产生第一条真实实现改动

---

## 8. 最终判断

**判断：可行，但必须先修执行控制系统。**

不是产品不可行。
不是能力边界已经撞死。
问题在于：当前自主执行机制还不够硬，无法可靠支撑长项目连续推进。

如果按旧方式继续干：不可接受，等于继续浪费时间。

如果先按本计划修控制层，再恢复开发：可行。

---

## 9. 下一轮应该怎么做

下一轮不应直接写产品功能。
下一轮应先执行 **Phase A：修执行控制层**。

建议顺序：
1. 收敛单一真源
2. 加 `paused/blocked` 状态
3. 修 watcher 文档与脚本
4. 修知识库计划中的残留旧下一步
5. 验证控制层后，再启动 Batch 6

