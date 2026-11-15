# URBO — 3D Scroll Scene Architecture
**Module:** `src/components/hero/UrboCityScene3D.tsx` & `src/components/hero/CinematicHero.tsx`  
**Dependencies:** `three@0.170.0`, `gsap@3.12.5`, `ScrollTrigger`

---

## 1. Technical Evaluation & Architecture Selection

### Why Three.js Procedural WebGL vs Pre-rendered Video Scrubbing

| Evaluation Vector | Pre-rendered Video (NORVA) | Three.js WebGL (URBO Custom) | Verdict |
| :--- | :--- | :--- | :--- |
| **Asset Size** | 20MB – 45MB video | < 120KB JS + procedural geometry | **Three.js wins (100x lighter)** |
| **iOS Safari Scrubbing** | Frequent seek stalls, keyframe hitching | 60fps buttery smooth requestAnimationFrame | **Three.js wins** |
| **Spatial Camera Precision** | Fixed pre-rendered perspective | Dynamic, adjustable FOV, fluid pursuit | **Three.js wins** |
| **Interactive GPS Point** | Static pixel baked in video | Dynamic Three.js Point Light + Mesh + Glow | **Three.js wins** |
| **Responsive Cropping** | Harsh letterboxing or cropped sides | Camera frustum automatically adjusts aspect | **Three.js wins** |
| **Branding Authenticity** | Generic external asset | Custom Santa Cruz grid (Plaza 24, Anillos) | **Three.js wins** |

---

## 2. Three.js Procedural City Architecture

```
Scene Graph
├── AmbientLight (0x0F1D36, intensity: 1.2)
├── DirectionalLight (Key moonlight: 0x38BDF8, intensity: 1.8)
├── FogExp2 (0x070B14, density: 0.015) - Infinite night horizon
├── Ground Grid (Navy plane with grid shader / road markings)
├── InstancedMesh: City Buildings (Instanced geometry with height variation, navy materials, illuminated amber windows)
├── InstancedMesh: Street Trees / Plazas (Low-poly foliage clustered around squares)
├── Route Spline (CatmullRomCurve3 following street coordinates)
│   ├── Line2 / TubeGeometry (Emerald #10B981 core with glowing casing)
│   └── Flow Bead (Animated pulsing energy particle)
└── GPS Beacon Vehicle
    ├── PointLight (Cyan #38BDF8, radius: 15, intensity: 2.5)
    ├── Glowing Sphere (Cyan core + white center + pulse ring)
    └── Direction Arrow / Trail
```

### Route Geometry & Coordinates (Santa Cruz Grid Model)
A multi-waypoint CatmullRomCurve3 representing the arterial transit path:
- Waypoint 0: `(-40, 0.5, 40)` — Casco Viejo Entry (Primer Anillo)
- Waypoint 1: `(-20, 0.5, 20)` — Calle Sucre
- Waypoint 2: `(0, 0.5, 0)` — Plaza 24 de Septiembre (Landmark Cathedral center)
- Waypoint 3: `(25, 0.5, -15)` — Calle Bolívar
- Waypoint 4: `(50, 0.5, -40)` — Casco Viejo North Exit (Terminal Bimodal corridor)

---

## 3. Camera Control & Pursuit Rig

The camera does NOT leap across cutscenes. It glides along an offset trajectory:
- Camera position curve: CatmullRomCurve3 offset by `(+18, +24, +22)` relative to the beacon spline, maintaining a high-fidelity 45° isometric angle.
- LookAt Target: `Vector3.lerp` smoothly targeting the beacon's live world coordinates plus a small forward anticipation vector (`velocity * 1.5`).

---

## 4. GSAP ScrollTrigger Scrubbing Pipeline

```typescript
const runway = 400; // 400vh scroll runway
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero-runway',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.8, // 0.8s smooth interpolation
    onUpdate: (self) => {
      sceneRef.current?.setScrollProgress(self.progress);
    }
  }
});
```
- Reversible: User scrolling up reverses the vehicle, camera spline, and chapter titles with zero frame hitches.
- Fallback / Reduced Motion: If `prefers-reduced-motion` is active, the camera locks onto an iconic isometric hero view, and narrative cards are presented as standard clean vertical modules.
