# 双语机制与翻译标准 · Translation Guide

这个网站是**真·双语站**：不是页面级的两套 HTML，而是同一套 DOM 在运行时切换语言。
本文档记录**机制**（新增内容时怎么接进来）和**标准**（英文按什么口径翻）。
以后往站里加任何新内容，照这份走，就能保持全站统一的双语质量。

---

## 一、机制怎么运作

核心是一个共享的翻译引擎 `app/public/i18n.js`，它挂在 `window.I18N` 上。
之所以用普通 classic script 而不是 ES module，是因为 `public/` 下的静态页
（观星台 / 太阳系 / 空间站 / 来源）没有打包器，也要能用同一个引擎。

**内容模型**：每一条可翻译的文字，都是一个 `{ zh, en }` 对，注册在某个 key 下。
DOM 用声明式属性本地化，不用手写切换逻辑：

```html
<h1 data-i18n="page.title"></h1>              <!-- 换 textContent -->
<p  data-i18n-html="intro"></p>               <!-- 换 innerHTML，保留 <strong> 等内联标签 -->
<img data-i18n-attr="alt:img.alt">            <!-- 换属性，格式 "属性:key;属性:key" -->
```

JS 里动态拼的字符串用 `I18N.t('key', { name: '...' })`，`{name}` 会被参数替换。

语言选择存在 `localStorage['cosmic-lang']`，跨页面保持；顶栏那个长春花蓝的按钮
`[data-lang-toggle]` 由引擎自动绑定，点一下在中/英之间切换并即时重绘。

### 两类页面，两种接法

**A. 主应用（`app/src/`，走 Vite 打包）**
- 所有 UI 文案的唯一事实源是 `app/src/content.js` 里的 `UI` 对象（全是 `{zh,en}`）。
- `main.js` 顶部 `I18N.register(UI)`，渲染时：
  - 静态模板用 `data-i18n` 标签；
  - 从数据里来的字段（如天区名）用 `L(field)` 解析——`L` 对 `{zh,en}` 取当前语言，对普通字符串原样返回；
  - 动态状态（status / next 等）用 `setStatus` / `setNext` 存起来，切语言时 `renderLang()` 重绘。
- 数据文件（如 `public/data/anchors/phase1.json`）里，凡要翻译的字段本身就写成 `{zh,en}`，`L()` 会认。

**B. 静态页（`app/public/*.html`）**
- 页面 `<head>` 里先 `<script src="/i18n.js"></script>`，紧接着一个内联
  `<script>` 调 `window.I18N.register({ ... })`，把本页的 `{zh,en}` 词典塞进去
  （在 `DOMContentLoaded` 引擎自动 apply 之前完成注册）。
- 正文元素挂 `data-i18n` / `data-i18n-html` / `data-i18n-attr`。
- 顶栏放一个 `<button data-lang-toggle>EN</button>` 和一个 `来源 →` 链接。
- 中文原文**保留在 HTML 里**当默认值和无 JS 兜底；引擎会在启动时用词典覆盖。

---

## 二、新增内容时怎么做（照抄这个流程）

1. **写中文**：先把内容按站里的口吻写好（大白话、有画面感、每段有实质信息）。
2. **起 key**：按页面/板块命名，如 `obs.rubin.body`、`solar.mars.note`、`st.tg.li1`。
3. **翻英文**：按下面第三节的标准翻，和中文一起写进 `{zh,en}`。
4. **接 DOM**：
   - 主应用 → 加进 `content.js` 的 `UI`，模板里挂 `data-i18n`；数据字段直接写 `{zh,en}`。
   - 静态页 → 加进该页内联词典，元素挂 `data-i18n*`。
5. **验收**：`npm run build` 绿；浏览器里切到 EN，确认**没有一处残留中文**
   （文本、内联 HTML、`alt`/`data-cap` 等属性都要翻到），再切回中文确认复原。

一句话：**新内容 = 一条 `{zh,en}` + 一个 `data-i18n` 标签**。不留半拉子单语内容。

---

## 三、英文翻译标准

目标是**专业、地道、有人味的英文**，读起来像一个懂天文、会讲故事的人写的，
不是机器直译。宁可为了自然改写句子结构，也不要贴着中文语序硬翻。

- **口吻对齐中文**：中文是「知识 + 一点惊叹」的科普口吻，英文也要这样——
  清楚、准确、偶尔带一句让人「哦——」的点睛。不要学术论文腔，也不要营销腔。
- **句子重构优先**：中文的破折号、顿号、「其实/不是…而是…」结构，按英文习惯重写
  （常用 em dash、分号、`not X but Y`），不要逐字对应标点。
- **单位与数字**：保留数值，换成英文习惯写法（`3.2 gigapixels`、`28,000 km/h`、
  `160,000 light-years`、`~400 km`）。日期用 `2 December 2026` / `March 2025` 这类。
- **保留原文里的括号补充**（如 `(M31)`、`(DR3)`、`(CC BY 4.0)`）。
- **署名 / 版权 / 许可证**：机械照搬，不翻译机构名和许可证代号
  （`NASA/JPL-Caltech`、`CC BY-SA 4.0`、`Wikimedia Commons` 原样保留）。
- **中文引号 `「」`/`""`** 在英文里改成 `'...'` 或 `"..."`。
- **不新增、不删减事实**：翻译只换语言，不改数字、不加中文里没有的断言。

### 术语对照（保持全站一致）

| 中文 | English |
|---|---|
| 天区 / 锚点 | region / anchor |
| 总览模式 / 近景模式 | overview mode / close-up mode |
| 底图 | base map |
| 视场 | field of view |
| 巡天 | survey |
| 疏散星团 / 球状星团 | open cluster / globular cluster |
| 暗星云 / 反射星云 / 发射星云 | dark nebula / reflection nebula / emission nebula |
| 超新星遗迹 | supernova remnant |
| 光年 / 秒差距 | light-year / parsec |
| 视差 | parallax |
| 探测器 / 深空探测器 | probe / deep-space probe |
| 轨道倾角 | orbital inclination |
| 自由落体 | free fall |
| 地球同步 / 静止卫星 | geostationary satellite |
| 银河系 / 银心 | the Milky Way / the Galactic Center |
| 恒星形成区 | star-forming region |
| 白矮星 / 中子星 / 脉冲星 | white dwarf / neutron star / pulsar |
| 光污染 | light pollution |

天体的**专有名**用国际通行英文名（`Antares`、`Pleiades`、`Betelgeuse`、
`Aldebaran`、`Olympus Mons`、`Valles Marineris`），不要音译拼音。
中国设施用官方英文名或规范拼音（`Chang'e-2`、`Tiangong`、`Tianhe/Wentian/Mengtian`、
`Zhurong`、`Shenzhou`）。

---

## 四、给「让 Claude 翻」用的一句话指令

> 按 `TRANSLATION-GUIDE.md` 的标准，把这段新内容做成 `{zh, en}`，英文要专业地道、
> 重构句式、术语对照表一致，然后接进对应的 `data-i18n`（主应用进 content.js，
> 静态页进该页内联词典），build 绿后浏览器切 EN 自查无残留中文。
