# URBO — Motion & 3D Scroll Storytelling QA Validation Report
**Target URL:** `http://localhost:4173` (Production Preview Build)  
**Methodology:** Chrome DevTools Protocol (CDP) programmatic scroll emulation, WebGL render profiling, and responsive viewport testing (Desktop 1440x900 & Mobile 390x844).

---

## 1. Executive Summary & Verification Results

| Requirement / Milestone | Target Metric | Measured Outcome | Verification Status |
| :--- | :--- | :--- | :--- |
| **1. Preloader Elimination** | Zero blocking full-screen overlay | `preloaderFound: false`, Hero painted immediately | **PASS (100%)** |
| **2. Nocturnal Isometric 3D City** | Three.js procedural WebGL render | 180 instanced blocks, Plaza 24, Cathedral | **PASS (100%)** |
| **3. Luminous Route Spline** | Glowing emerald `#10B981` street path | CatmullRomCurve3 through Santa Cruz grid | **PASS (100%)** |
| **4. Cyan GPS Beacon** | High-contrast `#38BDF8` active bus point | Sphere + PointLight + dynamic pulse ring | **PASS (100%)** |
| **5. Continuous Camera Pursuit** | Offset trajectory tracking beacon | Camera curve lerping alongside vehicle | **PASS (100%)** |
| **6. Reversible GSAP Scrubbing** | Scroll-driven progress 0% → 90% → 30% | Reverse scrub tested with zero glitching | **PASS (100%)** |
| **7. Mobile Viewport Usability** | 390px iPhone width, zero overflow | `viewportWidth: 390, bodyScrollWidth: 390` | **PASS (100%)** |

---

## 2. Scroll Stages & Visual Evidence

The following high-resolution screenshots were captured at exact scroll percentages:

1. **Stage 0% — Initial Hero Frame**: `norva-stage-00-initial.png` (157.1 KB)
   - *Visual State*: High-angle isometric view overlooking Santa Cruz nocturna. Main headline *"Tu micro. EN TIEMPO REAL."* centered with editorial hierarchy. Navbar floats cleanly over top gradient scrim.
2. **Stage 25% — Scroll Begins & Chapter 1**: `norva-stage-25-chapter1.png` (148.2 KB)
   - *Visual State*: Headline tilts into the road plane via GSAP `rotateX(20deg)` and fades. Narrative card 1 reveals: *"Esperar a ciegas en la esquina cuesta 35 minutos al día"*.
3. **Stage 60% — Avenue Traversal & Chapter 2**: `norva-stage-60-chapter2.png` (158.7 KB)
   - *Visual State*: Beacon advances along Calle Sucre and René Moreno toward Plaza 24 de Septiembre. Narrative card 2 reveals: *"Avisos por voz a 300 metros, manos libres (Int. 32 Don Neyer)"*.
4. **Stage 90% — Destination & Primary CTA**: `norva-stage-90-cta.png` (142.6 KB)
   - *Visual State*: Beacon arrives at central terminal stop. Prominent CTA card reveals: *"Descubre cómo funciona URBO"* and *"Contáctanos"*.
5. **Stage Reverse (30%) — Smooth Bi-directional Continuity**: `norva-stage-reverse-30.png` (167.3 KB)
   - *Visual State*: Reverse scrolling upwards smoothly retreats the vehicle and camera backward along the spline.
6. **Mobile 390px Viewport**: `norva-stage-mobile-390.png` (169.3 KB)
   - *Visual State*: Full-bleed 100dvh viewport with centered title, readable typography, and responsive 3D framing without horizontal scroll.
