# URBO V5.4 — VALIDACIÓN VISUAL MULTI-VIEWPORT (LOOK & FIX LOOP)
## Evidencia de Pruebas en Navegador Real vía Chrome DevTools Protocol (CDP)

---

## 1. Resumen de Ejecución de Pruebas

- **Herramienta de Automatización**: Chrome DevTools Protocol (CDP) en Headless Chrome 130+ con emulación de dispositivos táctiles y pantallas retina 2x.
- **Servidor de Producción Probado**: `http://localhost:4173` (Vite Preview Bundle minificado).
- **Conteo de Errores en Consola**: `0 errores` detectados.
- **Layout Shifts / Jumps**: 0 saltos; preloader utiliza disolución por opacidad sin dropdowns.
- **Scroll**: 100% nativo con ScrollTrigger calibrado (`syncInterval: 100`, `ignoreMobileResize: true`).

---

## 2. Matriz de Viewports Validados

| Viewport | Dispositivo Emulado | Dimensiones | DPI | Estado Visual | Errores |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile Compact** | iPhone SE | `375 x 667` | 2x | Navbar en píldora con hamburguesa, tipografía `3xl`, mapa responsive sin desbordamiento | 0 |
| **Mobile Mainstream** | iPhone 14 | `390 x 844` | 2x | Proporciones óptimas, espaciado de 16px lateral, tarjetas Don Mauricio a columna única | 0 |
| **Mobile Pro Max** | iPhone 14 Pro Max | `430 x 932` | 3x | Balance de altura `100dvh`, alineación vertical perfecta en Hero | 0 |
| **Tablet Portrait** | iPad Mini / Air | `768 x 1024` | 2x | Grid adaptativo de 2 columnas en métricas y solución, cockpit map centralizado | 0 |
| **Desktop High-End** | MacBook / Ultra HD | `1440 x 900` | 2x | Composición completa asimétrica (7/5 cols), navbar extendida con 5 accesos | 0 |

---

## 3. Capturas de Pantalla Generadas

1. **Preloader con Cápsula de Lente y Borde Óptico**:
   - Archivo: `v54-preloader-lens.png`
   - Validación: Logo oficial de URBO destacado (88px), textos para el usuario (*"Preparando tu experiencia..."*), barra de carga líquida con haz especular continuo y halo luminoso.
2. **Hero Revelado y Navbar Flotante (1440x900)**:
   - Archivo: `v54-hero-1440.png`
   - Validación: Botones `.ms-btn-chrome` y `.ms-btn-halo`, titular sin desenfoques, mapa con señal GPS activa en Casco Viejo.
3. **Pieza Editorial Don Mauricio**:
   - Archivo: `v54-don-mauricio-editorial.png`
   - Validación: Formato editorial de revista, tipografía estilizada, avatar de operador y badge de audio manos libres.
4. **Roadmap Cartográfico en Malla Vial Real**:
   - Archivo: `v54-roadmap-cockpit.png`
   - Validación: Cockpit de navegación en `.ms-liquid-glass--strong`, trazado de 5 fases sobre calles reales de Santa Cruz, punto GPS cyan titilando.
5. **Experiencia Móvil iPhone (390x844)**:
   - Archivo: `v54-viewport-390.png`
   - Validación: Sin scroll horizontal, botones touch de 48px de altura accesible, contraste nítido en Dark Mode.
