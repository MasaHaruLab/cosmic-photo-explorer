# Cosmic Photo Explorer 星空照片探索器

[中文版 README →](README.md)

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
