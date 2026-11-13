# AUDITORÍA TÉCNICA DEL PRELOADER ACTUAL — URBO V5.1

**Fecha:** 12 de Noviembre de 2026  
**Objetivo:** Diagnóstico exhaustivo del ciclo de vida del preloader, cuellos de botella, timing de fuentes, inicialización de MapLibre y sincronización con GSAP.

---

## 1. COMPONENTES Y RESPONSABILIDADES

1. **`src/components/ui/UrboPreloader.tsx`**:
   - Renderiza la pantalla fija a pantalla completa (`fixed inset-0 z-[100] bg-[#070B14]`).
   - Contiene el logo oficial de URBO dentro de una cápsula de cristal (`optical-glass-surface`).
   - Contenía una barra de actividad delgada (`h-[2px]`) con gradiente CSS sin propiedades de Liquid Glass auténtico (sin bisel óptico superior, sin refracción interna, sin destello especular dinámico).

2. **`src/context/IntroContext.tsx` / `src/motion/useIntroSequence.ts`**:
   - Gestiona las fases del ciclo de vida: `'loading' | 'ready' | 'revealing' | 'complete'`.
   - Soporte inicial para `prefers-reduced-motion`.
   - **Carencia detectada:** No tenía noción de visitas repetidas en la misma sesión (`sessionStorage`), ni métricas ponderadas de progreso real, ni registro de preparación de Hero/MapLibre.

3. **`src/components/hero/Hero.tsx`**:
   - Escucha `phase`.
   - En `'loading' | 'ready'`, aplica `gsap.set` a los elementos principales para mantenerlos en `opacity: 0`.
   - En `'revealing' | 'complete'`, ejecuta la timeline GSAP de entrada cinematográfica.

4. **`src/components/map/CascoViejoMap.tsx`**:
   - Instancia MapLibre GL con estilo OpenFreeMap Dark.
   - Descarga tiles vectoriales asíncronos y monta capas GeoJSON de la Línea 30 y marcadores interactivos (Don Neyer y Don José Luis).

---

## 2. HALLAZGOS DEL DIAGNÓSTICO: EL DEFECTO DE SINCRONIZACIÓN

### 2.1 El Conflicto de la Timeline Oculta
Al inspeccionar `UrboPreloader.tsx` en V5, se descubrió la causa raíz por la cual el Hero no se sentía revelarse fluidamente:

```typescript
// Código defectuoso en V5
const finishTl = gsap.timeline({
  onStart: () => {
    setPhase('revealing'); // <-- ¡ERROR CRÍTICO! Se llamaba al inicio de la timeline
  },
  onComplete: () => {
    setPhase('complete');
  },
});

finishTl
  .to(activityBarRef.current, { scaleX: 1, duration: 0.2 })
  .to(logoWrapperRef.current, { scale: 1.05, duration: 0.2 })
  .to(logoWrapperRef.current, { y: -25, opacity: 0, duration: 0.25 })
  .to(preloaderRef.current, { yPercent: -100, duration: 0.5 }, '-=0.2');
```

**Análisis del fallo:**
1. Apenas `finishTl` iniciaba (`t = 0`), `setPhase('revealing')` se ejecutaba.
2. `Hero.tsx` recibía `phase === 'revealing'` y comenzaba inmediatamente a animar:
   - `hero-ambient-glow` (t = 0.1s)
   - `hero-badge` (t = 0.2s)
   - `hero-line-1` "Tu micro." (t = 0.35s)
   - `hero-line-2` "EN TIEMPO REAL." (t = 0.48s)
3. Sin embargo, en ese mismo intervalo (`t = 0` a `t = 0.45s`), el preloader **seguía estando al 100% de opacidad y `yPercent: 0` cubriendo toda la pantalla**.
4. La cortina del preloader no empezaba a subir hasta `t = 0.45s`.
5. **Resultado:** Cuando la cortina finalmente se levantaba, el titular del Hero ya había terminado de animarse a oscuras. El usuario se perdía la animación más importante de la landing.

### 2.2 Falta de Smart Loading (Riesgo de Bloqueo por MapLibre o Fuentes)
- En V5, si la red presentaba latencia con Google Fonts o con los servidores de tiles de OpenFreeMap, un simple `document.fonts.ready` podía ralentizar la experiencia o provocar que el mapa mostrara un cuadro vacío si la cortina subía antes de tiempo.
- Se requiere un controlador que distinga recursos críticos (React mount, layout Hero, tipografía con timeout estricto) de recursos asíncronos (tiles del mapa, que deben contar con un radar/grid visual táctico de fallback sin bloquear nunca la landing).

### 2.3 Ausencia de Liquid Glass en la Barra de Carga
- La barra anterior era una línea de 2px básica. Carecía de volumen óptico, refracción, borde biselado especular, glow controlado y destello de luz dinámico que acompañara la carga.

---

## 3. ESPECIFICACIÓN DE LA SOLUCIÓN V5.1

1. **Sincronización Cinemática Reversa:**
   - Durante la animación final de los elementos del preloader (logo y barra llegando al 100%), la fase se mantiene en `'ready'`.
   - `setPhase('revealing')` se dispara exactamente en el momento en que la cortina comienza a elevarse (`+0.1s`), de modo que el usuario ve el titular revelarse y el mapa elevarse justo a medida que la cortina se retira.
   - `setPhase('complete')` se dispara cuando la cortina culmina su recorrido (`0.6s`), desmontando el componente limpiamente.

2. **Nueva Barra Liquid Glass:**
   - Altura de 14px (`h-3.5`), borde óptico biselado superior con alta reflexión (`border-t-white/40`), refracción de fondo (`backdrop-blur-xl`), fondo de cristal ahumado (`bg-slate-950/75`), relleno teal degradado (`#00C9A7` a `#00E5BE` a `#22C55E`), pulso en el frente de avance y haz de luz especular diagonal continuo.

3. **Smart Loading & Progresión Real:**
   - 4 etapas ponderadas medibles:
     - 0% - 25%: Montaje React y DOM interactivo.
     - 25% - 55%: Verificación de tipografía (`Outfit`, `Syne`, `Space Grotesk`, `JetBrains Mono`) con race timeout de 500ms.
     - 55% - 80%: Sincronización de GSAP y estado base del Hero.
     - 80% - 100%: Calibración de telemetría y cartografía Casco Viejo (con fallback inmediato de radar táctico).
   - Tiempos: ~1.7s en primera visita, ~0.8s en visitas repetidas de la sesión (`sessionStorage`), timeout de seguridad inquebrantable a los 2.6s.

