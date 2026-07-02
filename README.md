# 星空照片探索器 Cosmic Photo Explorer

从真实巡天数据进入银河：先看整片天空，再拉近到可以辨认的天区。

**在线体验**：https://masaharulab.github.io/cosmic-photo-explorer/

## 是什么

一个网页端的星空探索器。底图不是插画，而是真实巡天数据——

- **总览**：ESA Gaia DR3 官方全天图（十几亿颗恒星的实测位置与亮度）
- **近景**：DSS2 彩色巡天（上世纪照相底片数字化的深空照片）
- 拉近时两者按视场自动切换，也可手动双眼对比"照片 vs 测量图"

## 玩法

- **10 个天区锚点**：银心、心宿二、夏季大三角、仙女座、昴星团、猎户座大星云、
  大小麦哲伦云……点一下，2.4 秒电影感拉近
- **自动漫游**：十站连播，像坐观光车看银河
- **NASA 图库**：每个天区一键调出 NASA 官方照片，应用内直接看大图
- **观星台门户**：8 座著名天文台的中文介绍 + 官网/最新动态直达
- **解释层**：光污染阶梯、跳出银河系（Gaia 测量范围 vs 整个银河系）

## 本地运行

```bash
cd app
npm install
npm run dev
```

## 致谢与数据来源

- **灵感与学习来源**：[grapeot 的 gaia_allsky](https://github.com/grapeot/gaia_allsky)
  ——本项目始于逐篇学习他的 Gaia 全天渲染文章系列；最终产品路线（公共 HiPS +
  Aladin Lite）与他的离线渲染管线不同，但方法论的火种来自他。
- **巡天底图**：ESA Gaia DR3 / DSS2，经 [CDS Aladin Lite](https://aladin.cds.unistra.fr/AladinLite/) 与公共 HiPS 服务呈现
- **图片**：NASA/JPL-Caltech（公有领域）、ESO / NOIRLab / Gemini（CC BY 4.0）、
  Wikimedia Commons 摄影师 SCJiang、Acabashi（CC BY-SA 4.0）——详细署名见观星台页脚
- 介绍文字为本项目原创整理
