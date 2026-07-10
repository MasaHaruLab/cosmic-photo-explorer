# Constellation data — format, datasets, sourcing

## Format

Each constellation = a list of stars plus a list of link pairs.

```js
const STARS = [
  // id: internal key used by LINKS
  // zh/west: display names (add more languages as needed)
  // bayer: Greek-letter designation (optional, for the side list)
  // ra, dec: J2000 equatorial, in DEGREES
  // dist: distance in light-years
  // mag: apparent visual magnitude (smaller = brighter → render bigger)
  { id: 'dubhe', zh: '天枢', west: 'Dubhe', bayer: 'α', ra: 165.932, dec: 61.751, dist: 123.0, mag: 1.79 },
  // ...
]
const LINKS = [ ['dubhe','merak'], /* ...id pairs = stick-figure segments... */ ]
```

Convert RA in hours → degrees with `deg = hours × 15` if your source gives hours.

## Equatorial → Cartesian (1 unit = 1 light-year)

```js
const a = ra * Math.PI/180, d = dec * Math.PI/180
x = dist * Math.cos(d) * Math.cos(a)
y = dist * Math.cos(d) * Math.sin(a)
z = dist * Math.sin(d)
```

From the origin, every star sits in the direction of its (ra, dec) → the view
from `(0,0,0)` is the true Earth sky. That is the whole trick.

## Big Dipper / 北斗七星 (verified, Hipparcos)

Bowl = Dubhe, Merak, Phecda, Megrez. Handle = Alioth, Mizar, Alkaid.
The two ends (Dubhe 123 ly, Alkaid 104 ly) are NOT in the Ursa Major moving
group holding the middle five near ~80 ly — they distort first.

```js
const STARS = [
  { id:'dubhe',  zh:'天枢', west:'Dubhe',  bayer:'α', ra:165.932, dec:61.751, dist:123.0, mag:1.79 },
  { id:'merak',  zh:'天璇', west:'Merak',  bayer:'β', ra:165.460, dec:56.383, dist:79.7,  mag:2.37 },
  { id:'phecda', zh:'天玑', west:'Phecda', bayer:'γ', ra:178.458, dec:53.695, dist:83.2,  mag:2.44 },
  { id:'megrez', zh:'天权', west:'Megrez', bayer:'δ', ra:183.857, dec:57.033, dist:80.5,  mag:3.31 },
  { id:'alioth', zh:'玉衡', west:'Alioth', bayer:'ε', ra:193.507, dec:55.960, dist:82.6,  mag:1.77 },
  { id:'mizar',  zh:'开阳', west:'Mizar',  bayer:'ζ', ra:200.981, dec:54.925, dist:82.9,  mag:2.04 },
  { id:'alkaid', zh:'摇光', west:'Alkaid', bayer:'η', ra:206.885, dec:49.313, dist:103.9, mag:1.86 },
]
const LINKS = [
  ['dubhe','merak'], ['merak','phecda'], ['phecda','megrez'], ['megrez','dubhe'],  // bowl
  ['megrez','alioth'], ['alioth','mizar'], ['mizar','alkaid'],                     // handle
]
```

## Orion / 猎户座 (APPROXIMATE — verify distances before shipping)

The best "detonation" after the Dipper: stars span ~250 to ~2000 ly, so the belt
(three near-collinear-from-Earth stars at very different depths) blows apart
dramatically. Belt-star distances carry large parallax uncertainty — treat these
as illustrative and re-source (see below) before presenting as fact.

```js
const STARS = [
  { id:'betelgeuse', zh:'参宿四', west:'Betelgeuse', bayer:'α', ra:88.793,  dec:7.407,   dist:548,  mag:0.50 },
  { id:'rigel',      zh:'参宿七', west:'Rigel',      bayer:'β', ra:78.634,  dec:-8.202,  dist:863,  mag:0.13 },
  { id:'bellatrix',  zh:'参宿五', west:'Bellatrix',  bayer:'γ', ra:81.283,  dec:6.350,   dist:250,  mag:1.64 },
  { id:'mintaka',    zh:'参宿三', west:'Mintaka',    bayer:'δ', ra:83.002,  dec:-0.299,  dist:1200, mag:2.23 },
  { id:'alnilam',    zh:'参宿二', west:'Alnilam',    bayer:'ε', ra:84.053,  dec:-1.202,  dist:2000, mag:1.69 },
  { id:'alnitak',    zh:'参宿一', west:'Alnitak',    bayer:'ζ', ra:85.190,  dec:-1.943,  dist:1260, mag:1.77 },
  { id:'saiph',      zh:'参宿六', west:'Saiph',      bayer:'κ', ra:86.939,  dec:-9.670,  dist:650,  mag:2.07 },
]
const LINKS = [
  ['betelgeuse','bellatrix'], ['betelgeuse','alnitak'], ['bellatrix','mintaka'],
  ['mintaka','alnilam'], ['alnilam','alnitak'],          // the belt
  ['alnitak','saiph'], ['mintaka','rigel'],              // shoulders → feet
]
```

## Cassiopeia / 仙后座 (approximate — the "W")

```js
const STARS = [
  { id:'segin',   zh:'阁道二', west:'Segin',    bayer:'ε', ra:28.599, dec:63.670, dist:410, mag:3.35 },
  { id:'ruchbah', zh:'阁道三', west:'Ruchbah',  bayer:'δ', ra:21.454, dec:60.235, dist:99,  mag:2.68 },
  { id:'gamma',   zh:'策',     west:'Navi',     bayer:'γ', ra:14.177, dec:60.717, dist:550, mag:2.47 },
  { id:'schedar', zh:'王良四', west:'Schedar',  bayer:'α', ra:10.127, dec:56.537, dist:228, mag:2.24 },
  { id:'caph',    zh:'王良一', west:'Caph',     bayer:'β', ra:2.295,  dec:59.150, dist:54,  mag:2.28 },
]
const LINKS = [ ['segin','ruchbah'], ['ruchbah','gamma'], ['gamma','schedar'], ['schedar','caph'] ]
```

## Where to source star data (accurately)

- **Distances & positions:** the Hipparcos catalogue (ESA). Easiest access:
  the **HYG database** (Hipparcos+Yale+Gliese, a single CSV with ra/dec/dist/mag
  per star — search "HYG database github astronexus"), or **VizieR / SIMBAD**
  per star (query the Bayer name, read parallax → distance = 1000/parallax_mas
  parsecs, ×3.26156 for light-years).
- **Which stars connect (the stick figures):** Stellarium's
  `constellationship.fab` (open data) or the IAU constellation line definitions.
  Map their HIP/Bayer ids to your `STARS` ids.
- Always cite the catalogue in the UI, and flag any value you couldn't pin down.
