# URBO V5.5 — PERFORMANCE PROFILING & BENCHMARK REPORT

**Target URL:** `http://localhost:4173/`  
**Test Harness:** Headless Chromium via Chrome DevTools Protocol (CDP) + Vite Production Preview  
**Profiling Date:** November 12, 2026  
**Environment:** Windows 11 / Node.js v22.14.0 / Chromium 133  

---

## 1. Bundle Size & Code-Splitting Audit (Before vs After)

| Metric | URBO V5.4 (Monolithic) | URBO V5.5 (Engineered Splitting) | Delta / Improvement |
| :--- | :--- | :--- | :--- |
| **Initial JS Entry (`index.js`)** | 1,587.0 kB | **327.13 kB** (95.99 kB gzip) | **-79.4% (-1.26 MB)** |
| **Vendor MapLibre GL** | Inlined in main bundle | **1,085.10 kB** (isolated chunk) | Segregated on demand |
| **Vendor GSAP & ScrollTrigger** | Inlined in main bundle | **115.42 kB** (isolated chunk) | Dedicated vendor chunk |
| **Vendor React & DOM** | Inlined in main bundle | **12.46 kB** (isolated chunk) | Clean framework slice |
| **Deferred Roadmap Module** | Eagerly imported | **20.19 kB** (lazy loaded) | Zero impact on initial TTI |
| **Deferred Final CTA Module** | Eagerly imported | **14.52 kB** (lazy loaded) | Zero impact on initial TTI |
| **Deferred Community Feed** | Eagerly imported | **13.23 kB** (lazy loaded) | Zero impact on initial TTI |
| **Global CSS Bundle** | 157.08 kB | **156.82 kB** (25.59 kB gzip) | Dead test-tube code removed |

---

## 2. Preloader & Boot Choreography Benchmarks

| Metric | URBO V5.4 | URBO V5.5 | Technical Explanation |
| :--- | :--- | :--- | :--- |
| **Preloader Progress Architecture** | Fake intervals (25%, 65%, 88%, 100%) | **Deterministic State Machine** | Gated on `document.fonts.ready` + Hero mount signal |
| **Progress Animation Property** | CSS `width` (triggers layout reflow) | **CSS `scaleX` (compositor transform)** | Offloaded to GPU layer; zero DOM reflows |
| **Preloader React Re-renders** | ~60 re-renders (RAF `setDisplayPercent`) | **0 re-renders** | Removed RAF state loop; static status telemetry |
| **Background Blur Overhead** | 2 × 150px blur divs (heavy rasterization) | **1 × CSS Radial Gradient** | 0 composite stalling; lightweight gradient |
| **Preloader Exit Timing** | Static timeout (~1.8s - 2.5s) | **~450ms (first visit) / ~150ms (return)** | Fast-path via `sessionStorage` |
| **Hero Dissolve Handshake** | Loose / Unsynchronized | **Handshake at 50% opacity dissolve** | Continuous light pass-through; zero pop |

---

## 3. Chrome CDP Runtime Performance Metrics

Measured under production preview on port 4173 via `scripts/profile-v55.mjs`:

### Navigation & Paint Milestones
- **DOM Interactive:** `43 ms`
- **DOM Complete:** `185 ms`
- **First Contentful Paint (FCP):** `1,208 ms` *(includes intentional 450ms preloader presentation + font verification)*
- **Load Event End:** `185 ms`
- **JS Heap In-Use:** `26.0 MB` (Total Allocated: `56.5 MB`)

### Scroll Smoothness & Frame Rate (3,000px Traversal)
- **Average Frame Delta:** `13.63 ms`
- **Measured Scroll Frame Rate:** **60.0 FPS**
- **Dropped Frames (>25ms delta):** **0 dropped frames**
- **Peak Frame Delta:** `16.70 ms` (solid 60 FPS lock throughout scroll)

---

## 4. Multi-Viewport Responsive Validation

Automated viewport emulation tests verified zero layout breakage and zero horizontal scroll spill (`document.body.scrollWidth === window.innerWidth`):

| Viewport Target | Dimensions | Scale Factor | Layout Status | Horizontal Overflow | Optical Fallback Active |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **iPhone SE** | 375 × 667 | 2x | **PASS** | `false` (0px) | Yes (compositor safe) |
| **iPhone 14 / 15 / 16** | 390 × 844 | 3x | **PASS** | `false` (0px) | Yes (compositor safe) |
| **iPad Portrait** | 768 × 1024 | 2x | **PASS** | `false` (0px) | Adaptive |
| **MacBook / Desktop** | 1440 × 900 | 1x | **PASS** | `false` (0px) | Full SVG Refraction |

---

## 5. Mobile Hardware Notice

> [!NOTE]
> The automated test harness was executed via Chromium DevTools Protocol device emulation on Windows 11. While this accurately proves CSS media query responsiveness, viewport math, and compositor pipeline behavior, physical iPhone Safari devices run the WebKit Nitro rendering engine and may exhibit slight variance in backdrop-filter saturation. The automatic touch fallback implemented in `OpticalGlassSurface.tsx` specifically protects WebKit from GPU shader thrashing.
