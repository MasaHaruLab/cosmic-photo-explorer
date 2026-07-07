# 星空照片探索器 Cosmic Photo Explorer

从真实巡天数据进入银河：先看整片天空，再拉近到可以辨认的天区；
再往外走，跟着五艘真实的探测器飞出太阳系。

**在线体验**：https://masaharulab.github.io/cosmic-photo-explorer/
（全站中英双语，右上角一键切换）

## 是什么

一个网页端的星空探索站。底图不是插画，而是真实数据——

- **总览**：ESA Gaia DR3 官方全天图（十几亿颗恒星的实测位置与亮度）
- **近景**：DSS2 彩色巡天（上世纪照相底片数字化的深空照片）
- 拉近时两者按视场自动切换，也可手动双眼对比"照片 vs 测量图"
- **探测器航迹**：NASA JPL Horizons 的真实三维轨道数据，不是示意图

## 六个页面

- **星空天图（主页）**：22 个天区锚点——银心、心宿二、夏季大三角、仙女座、
  昴星团、猎户座大星云、马头星云、船底座星云、大小麦哲伦云、南十字与煤袋、
  半人马座 α……点一下，2.4 秒电影感拉近；自动漫游像坐观光车看银河；
  每个天区一键调出 NASA 官方照片，应用内直接看大图；
  还有解释层：光污染阶梯、跳出银河系（Gaia 测量范围 vs 整个银河系）
- **深空信使**：旅行者 1/2 号、先驱者 10/11 号、新视野号——五艘探测器的
  **真实三维航迹**，从地球一路画到日球层顶。掠木星、掠土星、暗淡蓝点、
  冲出日球层，每个里程碑都是真实日期真实位置；行星按真实位置、真实倾斜
  轨道、彼此真实比例摆放；每艘船有独立播放器和可展开的双语档案卡
- **星座的真相**：星座其实是障眼法——把北斗七星、猎户座、仙后座的恒星
  放到它们**真实的距离**上，转动视角，熟悉的图形立刻散架；
  只有从地球这个方向看，它们才"恰好"排成那个样子
- **太阳系**：八大行星逐个介绍，配真实任务照片（地球是阿波罗 17 号的
  "蓝色弹珠"），与深空信使页双向跳转
- **观星台**：8 座著名天文台的介绍 + 官网/最新动态直达
- **空间站**：国际空间站与中国天宫

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
- **探测器轨道**：[NASA JPL Horizons](https://ssd.jpl.nasa.gov/horizons/) 星历数据（日心黄道坐标）
- **图片**：NASA/JPL-Caltech（公有领域）、ESO / NOIRLab / Gemini（CC BY 4.0）、
  Wikimedia Commons 摄影师 SCJiang、Acabashi（CC BY-SA 4.0）——详细署名见观星台页脚与"数据与来源"页
- 介绍文字为本项目原创整理

## 关于本项目

由鱼头与 Claude 协作完成：方向、品味与产品判断来自鱼头（观星台页面、
应用内看大图、探测器独立播放器、"要真实不要夸张"的轨道原则都是她的主意），
工程实现由 Claude 承担。

---

# English

Step into the Milky Way through real survey data: see the whole sky first,
then zoom into regions you can recognize — then head outward, following five
real spacecraft on their way out of the solar system.

**Live site**: https://masaharulab.github.io/cosmic-photo-explorer/
(fully bilingual — toggle 中/EN in the top bar)

## What it is

A web-based sky exploration site. The backdrop is not an illustration — it is
real data:

- **Overview**: ESA's official Gaia DR3 all-sky map (measured positions and
  brightness of over a billion stars)
- **Close-up**: the DSS2 color survey (deep-sky photographs digitized from
  last century's photographic plates)
- The two switch automatically as you zoom, or you can compare them
  side by side: photograph vs. measurement
- **Spacecraft trajectories**: real 3D orbit data from NASA JPL Horizons,
  not artist's impressions

## Six pages

- **Sky map (home)**: 22 sky anchors — the Galactic Center, Antares, the
  Summer Triangle, Andromeda, the Pleiades, the Orion Nebula, the Horsehead,
  the Carina Nebula, the Magellanic Clouds, the Southern Cross and Coalsack,
  Alpha Centauri and more. One click, a 2.4-second cinematic dive. Auto-roam
  plays the stations in sequence like a sightseeing bus through the galaxy.
  Every region pulls up official NASA photos in an in-app lightbox. Plus
  explainer layers: the light-pollution ladder, and "beyond the Milky Way"
  (what Gaia can measure vs. the whole galaxy)
- **Deep Space Messengers**: Voyager 1 & 2, Pioneer 10 & 11, New Horizons —
  the **real 3D trajectories** of five probes, drawn from Earth all the way
  to the heliopause. Jupiter flybys, Saturn flybys, the Pale Blue Dot,
  crossing into interstellar space: every milestone at its real date and
  real position. Planets sit at their true positions on their true tilted
  orbits, at true relative sizes. Each probe has its own playback control
  and an expandable bilingual profile card
- **The Truth about Constellations**: constellations are a trick of
  perspective. Put the stars of the Big Dipper, Orion, and Cassiopeia at
  their **true distances**, orbit the view, and the familiar figures fall
  apart — they only line up that way from Earth's direction
- **Solar System**: all eight planets with real mission photography (Earth
  is Apollo 17's "Blue Marble"), cross-linked with the Deep Space
  Messengers page
- **Observatories**: portals to 8 famous observatories, with official sites
  and latest news
- **Space Stations**: the ISS and China's Tiangong

## Run locally

```bash
cd app
npm install
npm run dev
```

## Credits & data sources

- **Inspiration**: [grapeot's gaia_allsky](https://github.com/grapeot/gaia_allsky)
  — this project began as a chapter-by-chapter study of his Gaia all-sky
  rendering series. The final product route (public HiPS + Aladin Lite)
  differs from his offline rendering pipeline, but the methodological spark
  came from him.
- **Survey basemaps**: ESA Gaia DR3 / DSS2, served through
  [CDS Aladin Lite](https://aladin.cds.unistra.fr/AladinLite/) and public
  HiPS services
- **Probe trajectories**: [NASA JPL Horizons](https://ssd.jpl.nasa.gov/horizons/)
  ephemeris data (heliocentric ecliptic coordinates)
- **Photography**: NASA/JPL-Caltech (public domain), ESO / NOIRLab / Gemini
  (CC BY 4.0), Wikimedia Commons photographers SCJiang and Acabashi
  (CC BY-SA 4.0) — full attributions in the Observatories footer and the
  "Data & Sources" page
- All descriptive text is original to this project

## About

A collaboration between Yutou (鱼头) and Claude: direction, taste, and
product judgment are hers (the observatory portal, in-app photo viewing,
per-probe playback, and the "real, not exaggerated" orbit principle were
all her calls); Claude did the engineering.
