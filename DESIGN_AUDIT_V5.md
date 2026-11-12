# DESIGN AUDIT V5 — URBO LANDING CINEMATOGRÁFICA & LIQUID GLASS

**Fecha:** 12 de Noviembre de 2026  
**Auditor:** Creative Director, Senior Frontend Architect & GSAP Motion Specialist  
**Proyecto:** URBO Corp (Landing de Transporte Público en Tiempo Real · Santa Cruz de la Sierra)

---

## 1. Declaración de Skills y Metodología

De acuerdo con el procedimiento obligatorio de la Fase 0:
- **Skills disponibles e invocadas en el entorno:**
  - `frontend-architecture`: Verificación de responsabilidades, estado reactivo, desacoplamiento de animaciones y prevención de prop drilling.
  - `frontend-code-review`: Detección de anti-patrones en hooks, gestión de ciclo de vida de ScrollTrigger y control de memory leaks.
  - `responsive-ui-css`: Auditoría de viewport móvil (iPhone 375px - 430px), Flexbox min-width, prevención de overflow y jerarquía táctil.
  - `performance-optimization`: Control de compositing layers, aceleración por GPU, prevención de forced reflows y balanceo de backdrop-filter blur.
  - `react-typescript`: Tipado estricto de eventos de animación, contratos de interfaces y fallbacks resilientes.
- **Skills externas no instaladas localmente (declaradas formalmente sin invención):**
  - *Frontend Design, Impeccable, Taste Skill / Design Taste Frontend, Hallmark, UI/UX Pro Max, Hue, Better Typography, Shadcn/UI*: No se encuentran registradas como paquetes locales en `.gemini/config/skills` ni en Antigravity builtin. El análisis visual adopta sus mejores prácticas universales de diseño y tipografía suiza/cyberpunk.

---

## 2. Auditoría Detallada por Componente

| Componente | Problemas Encontrados | Skill Aplicada | Recomendación Visual / Técnica | Prioridad | Impacto | Riesgo | Criterio de Aceptación Verificable |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Preloader** | Inexistente. La landing muestra el DOM inmediatamente; las animaciones del Hero se disparan a ciegas en el montaje inicial. | `frontend-architecture` & `performance-optimization` | Implementar `UrboPreloader.tsx` y `useIntroSequence.ts` con máquina de estados (`loading` $\rightarrow$ `ready` $\rightarrow$ `revealing` $\rightarrow$ `complete`), logo URBO centrado, barra de actividad luminosa y handshake con el Hero. | **Crítica (P0)** | Alto: establece la primera impresión premium y sincroniza GSAP. | Bajo: fallback con timeout a 2.2s si las fuentes tardan. | Al recargar se ve el logo URBO, una línea luminosa activa, y la transición fluida revela el Hero sin flash. |
| **Liquid Glass (Materialidad)** | Las tarjetas usan `backdrop-filter: blur(20px)` y fondos oscuros estáticos, luciendo como paneles SaaS genéricos sin sensación de vidrio físico. | `frontend-architecture` & `responsive-ui-css` | Crear una especificación óptica en `Glass.tsx`: gradientes de reflexión interna, borde biselado especular, difracción SVG (`#urbo-liquid-refract`), sombras volumétricas profundas y barrido de luz recurrente para móviles. | **Crítica (P0)** | Altísimo: define la identidad visual central requerida por el usuario. | Medio: limitar filtros SVG a capas clave para no degradar FPS en iOS. | El vidrio exhibe borde brillante reflectivo, gradiente de profundidad y movimiento de luz visible sin hover. |
| **Hero & Mapa** | La animación de entrada no está sincronizada con el ciclo de carga. El titular y el mapa compiten por atención al mismo tiempo. | `frontend-code-review` & `performance-optimization` | Reestructurar la timeline GSAP del Hero para ejecutarse **únicamente** tras la señal del preloader: máscara línea por línea, stagger en botones y reveal con escala en el cockpit del mapa. | **Alta (P1)** | Alto: transición cinematográfica y narrativa guiada. | Bajo | El Hero permanece pausado/oculto hasta que el preloader abre la vista y se anima ordenadamente. |
| **Animación Ambiental (No-Hover Mobile)** | Los efectos de luz especular (`--mouse-active`) dependen exclusivamente de `mousemove`, quedando 100% estáticos en iPhone. | `responsive-ui-css` | Implementar un barrido especular recurrente (`@keyframes liquidSheenSweep`) que recorre las tarjetas cada 6s automáticamente, además de halos respiratorios en badges y GPS. | **Alta (P1)** | Alto: la landing se siente viva en pantallas táctiles sin intervención del usuario. | Muy bajo | En iPhone se observan destellos lentos de luz atravesando la superficie del vidrio periódicamente. |
| **Métricas Tracción** | Aunque se corrigió la cuadrícula a 2x2, la materialidad de las 4 tarjetas debe diferenciarse en jerarquía visual (número protagonista con brillo cyan). | `ui-component-refactoring` & `responsive-ui-css` | Aplicar `OpticalGlass` con números en `font-tech font-black`, puntos de pulso radar estilo telemetría en vivo y reflejo biselado superior. | **Media (P2)** | Medio: aspecto de consola militar/aeroespacial de alta tecnología. | Muy bajo | Tarjetas con reflectividad volumétrica y contraste nítido en 390px. |
| **Oportunidad & Don Mauricio** | La tarjeta de Don Mauricio requiere mayor distinción óptica respecto al bloque demográfico para destacar como insight de campo clave. | `ui-component-refactoring` | Enriquecer la tarjeta de Don Mauricio con `LiquidGlass` de acento teal profundo, comillas luminiscentes y borde especular reflectivo continuo. | **Media (P2)** | Medio: jerarquía de lectura humana vs estadística. | Muy bajo | La cita resalta de inmediato con borde reflectivo y sello de Línea 30. |
| **Solución & Modos** | Las transiciones entre pestañas ("Esperar Aquí" / "Rutas" / "Seguridad") requieren mayor fluidez visual con GSAP. | `frontend-code-review` | Aplicar cross-fade con filtro de desenfoque progresivo en `tabContentRef` y pulso sonoro en la cápsula manos libres. | **Media (P2)** | Medio: microinteracción fluida y clara. | Muy bajo | Cambio de pestañas suave sin saltos de altura bruscos. |
| **Roadmap Cartográfico** | El mapa vial funciona, pero la polyline y el punto GPS necesitan una animación de pulso continua más orgánica. | `frontend-architecture` | Incorporar halo radar de triple anillo en el GPS activo y atenuación ambiental de las calles periféricas para centrar la mirada en la ruta. | **Media (P2)** | Alto: sensación de sistema satelital militar en tiempo real. | Bajo | Punto azul cyan emitiendo ondas de radar constantes en Casco Viejo. |
| **Final CTA (Business Card)** | La tarjeta 3D responde al cursor en desktop, pero en mobile debe tener un auto-tilt o brillo periódico para invitar al toque. | `responsive-ui-css` & `frontend-code-review` | Añadir micro-pulso en el chip NFC y barrido de sheen cada 5s en la superficie de la tarjeta para móviles. | **Media (P2)** | Alto: incrementa la tasa de clics hacia el formulario o correo fundador. | Muy bajo | La tarjeta destella sutilmente en mobile invitando a la interacción táctil. |
| **Scroll General & Rendimiento** | Es fundamental garantizar 60 FPS estables sin micro-stutters causados por capas de backdrop-filter solapadas. | `performance-optimization` | Aislar las capas con `will-change: transform`, limitar `backdrop-filter` a contenedores directos y coordinar ScrollTrigger con un único ticker optimizado. | **Crítica (P0)** | Altísimo: previene el rechazo del usuario por lentitud o lag. | Medio: validación con Chrome DevTools. | Scroll fluido continuo en 390px iPhone y 1440px desktop. |

---

## 3. Hoja de Ruta de Implementación V5

1. **Fase 2:** Reconstrucción de `Glass.tsx` y `index.css` con el sistema óptico de Liquid Glass, refracción SVG, bordes biselados y sheens automáticos.
2. **Fase 3:** Creación de `UrboPreloader.tsx` y `useIntroSequence.ts` integrando el logo URBO en SVG con ciclo de carga real.
3. **Fase 4:** Conexión del Hero a la secuencia del preloader y coreografía GSAP línea por línea.
4. **Fase 5 & 6:** Refinamiento de ScrollTrigger en todas las secciones y animaciones recurrentes sin hover.
5. **Fase 7 & 8:** Verificación en viewports móviles iPhone y optimización de rendimiento.
6. **Fase 9:** Validación visual, grabación de screenshots y push a producción.
