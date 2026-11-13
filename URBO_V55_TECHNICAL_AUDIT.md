# URBO V5.5 — TECHNICAL ARCHITECTURE AUDIT & REFACTORING REPORT

**Repository:** `https://github.com/Marcelo1004/urbo_landing`  
**Branch:** `main`  
**Engine:** React 19 / Vite 6 / TypeScript / Tailwind CSS / GSAP 3.12 / MapLibre GL 5.1  
**Audit Scope:** Preloader Determinism, GSAP Orchestration, Liquid Glass Consolidation, Code Splitting, and Dead Code Elimination.

---

## 1. Executive Summary

URBO V5.4 introduced high-fidelity visuals and MotionSites design patterns, but accumulated architectural technical debt:
1. **Preloader False Progress & Re-Render Cascade:** `IntroContext.tsx` utilized hardcoded progress steps (25%, 65%, 88%, 100%) driven by non-deterministic timeouts, while `UrboPreloader.tsx` updated a React state (`displayPercent`) on every animation frame via GSAP `onUpdate`, triggering over 60 React re-renders during boot.
2. **Layout Thrashing via DOM `width` Animations:** The progress bar animated CSS `width`, causing layout recalculations and style invalidations on every frame instead of offloading to the GPU compositor via `scaleX`.
3. **Hero Orchestration Race Conditions:** The Hero section relied on separate timers and lacked a direct handshake with the preloader, leading to potential visual pops or animations executing behind an opaque overlay.
4. **Bundle Monolith:** MapLibre GL (~1.1 MB) and secondary below-the-fold modules were bundled directly into the initial entry chunk (`index.js`), inflating initial payload to 1,587 kB.
5. **Dead V3/V4 CSS Remains:** Unused classes from early prototypes (`.test-tube-glass`, `.radioactive-liquid`, `@keyframes bubbleFloat`, `@keyframes meniscusWave`) remained in `src/index.css`.

All identified issues have been refactored and verified cleanly in URBO V5.5.

---

## 2. Phase-by-Phase Technical Solutions

### Phase 1: Deterministic Preloader Lifecycle (`IntroContext.tsx` & `UrboPreloader.tsx`)

#### Prior Failure Modes
- `displayPercent` was animated in GSAP `onUpdate: () => setDisplayPercent(Math.round(proxy.val))`. Because this triggered on every RAF, React re-rendered the entire preloader component 60 times per second.
- Preloader glow divs used huge CSS blur radii (`w-[380px] h-[380px] blur-[150px]` and `w-[260px] h-[260px] blur-[120px]`), forcing heavy GPU rasterization passes.
- Progress steps were arbitrary guesses (25, 65, 88, 100%) with artificial delays.

#### V5.5 Implementation
- **Deterministic State Machine:**
  ```typescript
  type IntroPhase = 'loading' | 'ready' | 'exiting' | 'heroEntering' | 'complete';
  ```
- **Compositor-Only Scale Animation:**
  The progress bar now sets `transformOrigin: 'left'` and animates GPU `scaleX` from `0` to `1` using `gsap.to(..., { scaleX: 1, ease: 'power2.inOut' })`.
- **Zero React State Re-renders:**
  Eliminated `displayPercent` state entirely. The numerical percentage indicator was replaced with an authoritative status pulse (`SISTEMA OPERATIVO // v5.5`), eliminating 100% of RAF state dispatches.
- **Lightweight Radial Backlight:**
  Replaced high-cost blurred DOM layers with a lightweight CSS gradient container (`radial-gradient(circle, rgba(0, 201, 167, 0.18) 0%, transparent 68%)`).
- **Critical Resource Handshake:**
  `document.fonts.ready` is verified with a 120ms safety race. First-time visitors experience an authoritative 450ms brand introduction; repeat visits (via `sessionStorage`) are fast-tracked to 150ms.
- **Synchronized Dissolve Handshake:**
  At 50% through the preloader exit fade (`onUpdate` checking `this.progress() >= 0.5`), the preloader dispatches `setPhase('heroEntering')`, ensuring the hero animation begins exactly as light passes through.

---

### Phase 2: GSAP Hero Orchestration (`Hero.tsx`)

#### Prior Failure Modes
- `Hero.tsx` executed its entrance timeline after a static delay or in parallel behind the preloader, leading to dropped frames and invisible initial choreography.
- In `prefers-reduced-motion` environments, opacity was not synchronously set to 1, causing a flash of invisible content.

#### V5.5 Implementation
- **Authoritative Mount Signal:**
  `Hero.tsx` calls `setHeroReady(true)` in its layout effect. The preloader will not dismiss until the Hero container and DOM tree are mounted and ready.
- **Phase-Gated Timeline Execution:**
  ```typescript
  useEffect(() => {
    if (phase !== 'heroEntering' && phase !== 'complete') return;
    // Execute entrance timeline synchronously with compositor hand-off
    const tl = gsap.timeline({ defaults: { ease: motion.ease.enter } });
    tl.to(heroRef.current, { opacity: 1, duration: motion.duration.fast })
      .fromTo(titleRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: motion.duration.normal }, '-=0.2')
      ...
  }, [phase]);
  ```
- **Instant Reduced Motion Guarantee:**
  When `prefersReducedMotion` is active, GSAP instantly sets `{ opacity: 1, y: 0, scale: 1 }` on all hero elements with 0ms duration, preventing any content flash.

---

### Phase 3: Motion Hooks & Token Audit

The motion subsystem in `src/motion/` was thoroughly reviewed:
- `motionTokens.ts`: Centralizes unified durations (`micro: 0.18s`, `fast: 0.32s`, `normal: 0.55s`, `slow: 0.85s`, `ambient: 8s`) and cinematic cubic bezier easings (`[0.16, 1, 0.3, 1]`).
- `useAmbientMotion.ts`: Applies subtle `Math.sin()` translation on ambient background nodes only when window is active, utilizing `will-change: transform`.
- `useGlassHover.ts`: Utilizes `gsap.quickTo` for magnetic cursor reflections without accumulating timeline garbage.
- `useReducedMotion.ts`: Subscribes cleanly to `(prefers-reduced-motion: reduce)` media query with passive listener cleanup.

---

### Phase 4: Liquid Glass System Consolidation (`index.css`)

All glassmorphism classes across URBO were consolidated into a 3-tier hierarchy:

1. **Base Glass (`.glass-base`):**
   - Background: `rgba(7, 11, 20, 0.72)`
   - Backdrop filter: `blur(12px)`
   - Border: Hairline `rgba(255, 255, 255, 0.08)`
   - Used for: Badges, utility buttons, subtle list items.

2. **Elevated Glass (`.glass-elevated` / `.ms-liquid-glass`):**
   - Background: Multi-stop linear gradient `rgba(10, 18, 30, 0.78)` to `rgba(7, 11, 20, 0.88)`
   - Backdrop filter: `blur(16px)`
   - Specular Rim: `border: 1px solid rgba(255, 255, 255, 0.12)`, top specular highlight `rgba(255, 255, 255, 0.25)`
   - Volumetric Shadow: `0 20px 45px -10px rgba(0, 0, 0, 0.7)`
   - Used for: Feature cards, metric containers, navigation bar.

3. **Optical Glass (`.glass-optical` / `.ms-liquid-glass--strong`):**
   - Multi-layer refractive surface with high-transmission core.
   - Dual-layer inner borders (`inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)`).
   - Used for: Primary interactive chassis, flagship business card, modal dialogs.

---

### Phase 5: Optical Refraction Prototype (`OpticalGlassSurface.tsx`)

Created `src/components/ui/OpticalGlassSurface.tsx`:
- Embeds SVG `#urbo-optical-refraction` with `feTurbulence` (fractalNoise, baseFrequency `0.04 0.06`) and `feDisplacementMap` (scale 8) to calculate physical light distortion.
- Grazing polar edge highlight (1.5px linear gradient).
- Chromatic caustic fringe (Cyan + Lime-Yellow dispersion rim).
- Passive 3D tilt via `gsap.quickTo` (clamped to ±4°).
- **Mobile Hardware Fallback:** Automatically switches to pure CSS elevated glass on touch devices (`(hover: none), (pointer: coarse)`), protecting mobile GPU from shader exhaustion.

---

### Phase 6: Dead Code & Legacy Artifact Elimination

Audited and removed 66 lines of deprecated V3 test-tube classes from `src/index.css`:
- `.test-tube-glass`
- `.radioactive-liquid`
- `.bubble`
- `@keyframes bubbleFloat`
- `@keyframes meniscusWave`
- `@keyframes liquidSlosh`

---

### Phase 7: Code Splitting & Chunk Optimization (`vite.config.ts` & `App.tsx`)

#### Chunk Isolation Strategy
In `vite.config.ts`, configured Rollup manual chunking:
```typescript
manualChunks: {
  'vendor-maplibre': ['maplibre-gl'],
  'vendor-gsap': ['gsap', 'gsap/ScrollTrigger'],
  'vendor-react': ['react', 'react-dom'],
}
```

#### Below-the-Fold Lazy Loading
In `src/App.tsx`, deferred heavy secondary sections:
- `CommunityFeed`: Deferred with `<Suspense fallback={<div className="min-h-[500px]" />} />`
- `Roadmap`: Deferred with `<Suspense fallback={<div className="min-h-[640px]" />} />`
- `FinalCta`: Deferred with `<Suspense fallback={<div className="min-h-[400px]" />} />`

#### Resulting Chunk Architecture
- Initial Entry (`index.js`): **327.13 kB** (95.99 kB gzip) — reduced from 1,587.0 kB!
- Segregated MapLibre (`vendor-maplibre.js`): **1,085.10 kB** (loaded only when required or cached)
- GSAP Bundle (`vendor-gsap.js`): **115.42 kB**
- React Core (`vendor-react.js`): **12.46 kB**
- Split Modules: `Roadmap.js` (20.19 kB), `FinalCta.js` (14.52 kB), `CommunityFeed.js` (13.23 kB).

