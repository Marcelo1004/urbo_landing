# URBO — Cinematic Product Experience (Design Specification)
**Reference:** MotionSites NORVA Night-City Staffing Hero (Architectural adaptation)  
**Methodology:** Elephant-Goldfish Critical Analysis + UI/UX Pro + MotionSites Web Builder  
**Brand Identity:** URBO — Tu micro en tiempo real (Santa Cruz de la Sierra, Bolivia)

---

## 1. Executive Summary & Elephant-Goldfish Critical Review

### The Elephant (Big Picture Vision)
URBO is transforming from a traditional multi-card landing page into a continuous, cinematic product experience. The hero will no longer be an isolated split layout with a static box map; instead, it is an immersive, nocturnal isometric 3D city representing the urban fabric of Santa Cruz de la Sierra. As the visitor scrolls, an emerald transit route illuminates along the avenues, guided by a cyan/blue GPS beacon that travels through real street coordinates. A synchronized virtual camera glides continuously with the beacon, transitioning titles into the street plane and revealing narrative product chapters.

### The Goldfish (Critical Scrutiny & Friction Elimination)
1. **The Preloader Trap**: Previous iterations added full-screen loading bars and artificial percentage timers. *Decision*: Completely eliminate `UrboPreloader`. The page paints instantly with the nocturnal 3D isometric city poster/canvas. No blocking overlay, zero dropdown lag, 100% accessible navigation from frame 0.
2. **Pre-rendered Video vs Real-time WebGL (Three.js)**: 
   - Pre-rendered video suffers from seeking stutter in iOS Safari, lacks interactivity, and requires external rendering pipelines that are not natively reproducible in this repo.
   - Three.js is *already installed* (`three@^0.170.0` in `package.json`), lightweight (<140KB gzipped), renders natively at 60fps on mobile GPUs, allows exact geometric camera paths, dynamic glowing route shaders, dynamic bus beacon pulsation, and fully reversible GSAP ScrollTrigger scrubbing.
   - *Decision*: Native Three.js procedural isometric city with geometry instancing, glowing Line2 transit route, pulsing beacon particle system, and GSAP-scrubbed camera & vehicle animation.
3. **MapLibre Coexistence**: MapLibre must NOT fight the Hero 3D scene. The Hero hosts the cinematic isometric narrative. MapLibre is preserved as the functional telemetry interactive cockpit in the product validation section (*Piloto Casco Viejo* / *Comunidad*), keeping all interactive bus selector (`Int 32` / `Int 58`) features intact without visual redundancy.
4. **Mobile Performance (iOS Safari)**: High DPR clamping (`Math.min(window.devicePixelRatio, 2)`), `powerPreference: "high-performance"`, frustum culling, instanced meshes for city blocks/trees, and pause on off-screen via IntersectionObserver.

---

## 2. Chromatic Identity & Palette Distribution

| Layer | Color Code | Role & Application |
| :--- | :--- | :--- |
| **Navy Profundo** | `#070B14` | 3D City night horizon, fog, background canvas |
| **Navy Principal (60%)**| `#0F1D36` | City blocks, base plane, hero chassis, cards |
| **Navy Secundario** | `#1B2A47` | Roadway grid, street gutters, architectural framing |
| **Crema Editorial (30%)**| `#FAF5EC` | Middle scroll sections (Opportunity, Solution, Gallery) |
| **Esmeralda Tránsito (10%)**| `#10B981` | Línea 30 route flow, main CTAs, active telemetry |
| **Cyan GPS Beacon** | `#38BDF8` / `#00B4D8` | Live vehicle beacon, pulse aura, GPS coordinate lock |
| **Luz Cálida Ámbar** | `#F59E0B` / `#FEF08A` | Subtle architectural window illuminations, driver alerts |

---

## 3. Narrative Scroll Chapters (GSAP ScrollTrigger Scrubbing)

The Hero stage utilizes a pinned 400vh runway (`position: sticky; top: 0; height: 100vh`) driven by a single unified progress variable: `progress = clamp(0, 1, scrollProgress)`.

```
Progress 0.00 — 0.20 [STAGE A: EL SILENCIO URBANO]
- Camera: High isometric wide angle overlooking Santa Cruz nocturna.
- Headline: "Tu micro. EN TIEMPO REAL." centered in bold editorial hierarchy.
- Subtitle: "URBO conecta la movilidad urbana de Santa Cruz..."
- 3D Route: Subtle baseline pulse. Beacon resting at Terminal Bimodal / Casco Viejo entry.

Progress 0.20 — 0.45 [STAGE B: LA INCERTIDUMBRE]
- Title Animation: Headline translates Y, rotates X (-30deg) into the ground plane, and fades.
- Camera: Smooth descent and rotation toward the main avenue.
- Narrative Card 1: "La espera a ciegas se terminó" — 83% de los pasajeros esperan sin saber cuándo pasará su micro.

Progress 0.45 — 0.75 [STAGE C: EL PUNTO GPS EN VIVO]
- Beacon: Cyan beacon accelerates along the emerald route following avenue turns.
- Camera: Tracks closely behind the beacon in smooth dynamic pursuit.
- Route: Glowing particle bead flows along the spline.
- Narrative Card 2: "Telemetría real en cabina" — Aviso por voz a 300 metros sin tocar el teléfono.

Progress 0.75 — 1.00 [STAGE D: LA RED INTEGRADA & HANDOFF]
- Camera: Levels out into a cinematic perspective framing the illuminated Casco Viejo center.
- Beacon: Reaches Plaza 24 de Septiembre terminal stop.
- Primary CTA: "Descubre cómo funciona URBO" with holographic emerald glow.
- Handoff: Seamless release into the Opportunity section without layout pop.
```

---

## 4. Acceptance Verification Matrix

- [x] Zero preloader overlay: initial paint occurs instantly.
- [x] Three.js isometric city with Santa Cruz character (avenidas, manzanas, plaza central).
- [x] Glowing emerald route line with animated flow.
- [x] Pulsing cyan GPS beacon navigating real street coordinates.
- [x] Continuous virtual camera track following the beacon without station jumps.
- [x] Reversible GSAP ScrollTrigger scrubbing.
- [x] MapLibre preserved in the dedicated interactive cockpit.
- [x] Fully responsive across desktop, tablet, and mobile (375px/390px/430px).
