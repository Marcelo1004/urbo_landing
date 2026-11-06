SD DYSTOPIAN FONT INTEGRATION ARCHITECTURE — URBO
===================================================

The SD Dystopian font (f109410 by Sizenwar) is a decorative futuristic display font available for Personal Use demo.
For commercial deployments, an authorized commercial license must be acquired from the original author/distributor:
Reference: https://www.fontspace.com/sd-dystopian-font-f109410

ARCHITECTURAL SETUP:
-------------------
When the authorized commercial license file is acquired, simply drop the font file into this directory:
  /public/fonts/SD-Dystopian.woff2
  /public/fonts/SD-Dystopian.otf

The CSS in `src/index.css` is already preconfigured to load it automatically:
```css
@font-face {
  font-family: 'SD Dystopian';
  src: url('/fonts/SD-Dystopian.woff2') format('woff2'),
       url('/fonts/SD-Dystopian.otf') format('opentype');
  font-weight: 700 900;
  font-style: normal;
  font-display: swap;
}
```

FALLBACK CHAIN:
--------------
While the license file is being provisioned, the CSS applies an ultra-modern geometric techno fallback chain:
`font-family: 'SD Dystopian', 'Syne', 'Space Grotesk', 'Outfit', sans-serif;`
This guarantees zero visual breaks, zero licensing infringements, and an immediate high-tech aesthetic.

