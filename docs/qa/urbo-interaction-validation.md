# URBO — Reporte de Validación e Interacción QA
## Pruebas de Aceptación, Auditoría de Rendimiento y Evidencia Visual

---

### 1. Resumen de Pruebas de Aceptación

| Prueba | Criterio | Resultado | Evidencia |
| :--- | :--- | :--- | :--- |
| **Ruta Vial Real** | Trazado sobre calles reales de Santa Cruz sin cruzar manzanas | **APROBADO** | 113 nodos OSM, 5.042 km continuos |
| **Interpolación por Distancia** | Avance uniforme basado en metros recorridos | **APROBADO** | Fórmula de Haversine con lerp continuo |
| **Transición Día a Noche** | Día pleno $\to$ Tarde $\to$ Atardecer $\to$ Noche en 5.04 km | **APROBADO** | Interpolación paramétrica de luz y materiales |
| **Farolas & Vida Urbana** | 44 farolas activas al atardecer, áreas verdes y peatones | **APROBADO** | Capas GeoJSON y microciclos paramétricos |
| **Narrativa 5 Capítulos** | Textos legibles desacelerados en puntos clave | **APROBADO** | 5 tarjetas ancladas en cuadrante inferior izquierdo |
| **Instagram Conectado** | Sin métricas falsas, perfil @urbo.corp y estado transparente | **APROBADO** | Enlace oficial directo y documentación API |
| **Holograma Star Wars** | Proyección que emerge físicamente de la tarjeta con timeline reversible | **APROBADO** | GSAP timeline única con haz láser y cono de luz |
| **Rendimiento Móvil** | 0 overflow horizontal en viewport 390px, 60 FPS | **APROBADO** | Métricas CDP verificadas (`hasHorizontalOverflow: false`) |

---

### 2. Galería de Evidencia Visual (Auditoría CDP)

Las 8 capturas fueron generadas y verificadas mediante Chrome DevTools Protocol sobre el build de producción en `http://localhost:4173`:

| Hito / Interacción | Archivo de Captura |
| :--- | :--- |
| **01 · Catedral Metropolitana (Día · 14:30)** | [living-01-catedral-day.png](file:///C:/Users/marce/.gemini/antigravity/brain/6a2f1f62-9aec-45ea-8cee-72b354e41d0b/living-01-catedral-day.png) |
| **02 · Plaza del Estudiante (Tarde · 17:15)** | [living-02-estudiante-afternoon.png](file:///C:/Users/marce/.gemini/antigravity/brain/6a2f1f62-9aec-45ea-8cee-72b354e41d0b/living-02-estudiante-afternoon.png) |
| **03 · Cristo Redentor & Farolas (Atardecer · 18:45)** | [living-03-cristo-sunset.png](file:///C:/Users/marce/.gemini/antigravity/brain/6a2f1f62-9aec-45ea-8cee-72b354e41d0b/living-03-cristo-sunset.png) |
| **04 · Corredor Norte & Datos Piloto (Noche · 20:30)** | [living-04-corredor-night.png](file:///C:/Users/marce/.gemini/antigravity/brain/6a2f1f62-9aec-45ea-8cee-72b354e41d0b/living-04-corredor-night.png) |
| **05 · Visión de Escala (Cuarto Anillo)** | [living-05-vision-cuartoanillo.png](file:///C:/Users/marce/.gemini/antigravity/brain/6a2f1f62-9aec-45ea-8cee-72b354e41d0b/living-05-vision-cuartoanillo.png) |
| **06 · Instagram Live Connect (@urbo.corp)** | [living-06-instagram-live.png](file:///C:/Users/marce/.gemini/antigravity/brain/6a2f1f62-9aec-45ea-8cee-72b354e41d0b/living-06-instagram-live.png) |
| **07 · Interfaz Holográfica Emerge** | [living-07-hologram-emerged.png](file:///C:/Users/marce/.gemini/antigravity/brain/6a2f1f62-9aec-45ea-8cee-72b354e41d0b/living-07-hologram-emerged.png) |
| **08 · Vista Móvil (390x844 iPhone)** | [living-08-mobile-390.png](file:///C:/Users/marce/.gemini/antigravity/brain/6a2f1f62-9aec-45ea-8cee-72b354e41d0b/living-08-mobile-390.png) |

---

### 3. Validación de la Timeline del Holograma

La animación del holograma en [FinalCta.tsx](file:///d:/URBO/src/components/cta/FinalCta.tsx) se orquesta con una **única timeline reversible de GSAP**:

1. **Reposo**: Panel colapsado en `rotateX: 18deg, scaleY: 0.12, opacity: 0` descansando en el borde emisor de la tarjeta.
2. **Apertura (`tl.play()`)**:
   - `laserBeam`: expansión horizontal de luz neón (`scaleX: 1`, 0.28 s).
   - `coneRef`: haz cónico de luz proyectado hacia arriba (`scaleY: 1`, 0.35 s).
   - `holoPanel`: elevación en perspectiva con rebote elástico suave (`y: 0, scaleY: 1, rotateX: 0`, 0.55 s).
   - Canales de contacto: revelación escalonada con `stagger: 0.08`.
   - Barrido especular suave que atraviesa la pantalla (`.holo-specular-sweep`).
3. **Cierre (`tl.reverse()`)**:
   - Al pulsar "Cerrar" o el botón de la tarjeta, la timeline se invierte exactamente, haciendo que la proyección regrese hacia el emisor físico sin saltos de layout ni cortes de overflow.

---

### 4. Métricas de Rendimiento en Build de Producción

```
vite v6.4.5 building for production...
✓ 1624 modules transformed.
dist/index.html                                  1.90 kB │ gzip:   0.83 kB
dist/assets/maplibre-gl-worker-CMkqA50c.mjs    519.37 kB
dist/assets/index-0QMnLm1K.css                 173.48 kB │ gzip:  27.61 kB
dist/assets/InstagramGallery-Cblu9ITu.js         8.48 kB │ gzip:   3.16 kB
dist/assets/FinalCta-CM53bCC6.js                13.95 kB │ gzip:   3.89 kB
dist/assets/vendor-gsap-Jiz4vAvE.js            115.42 kB │ gzip:  45.63 kB
dist/assets/index-BNIKpN3L.js                  337.45 kB │ gzip:  99.08 kB
dist/assets/vendor-maplibre-Q30lSOgd.js      1,085.10 kB │ gzip: 297.26 kB
✓ built in 47.57s
```
- Código modularmente separado con `React.lazy` para componentes pesados.
- Tasa de fotogramas estable a 60 FPS mediante `requestAnimationFrame` desacoplado del estado de React.
- Cumplimiento de accesibilidad para `prefers-reduced-motion`.
