# URBO V5.4 — AUDITORÍA VISUAL Y DE DIRECCIÓN ARTÍSTICA
## MotionSites Web Builder & Premium Liquid Glass

**Fecha de ejecución**: Noviembre 2026  
**Skill de referencia**: `motionsites-web-builder` (Instalada desde `https://github.com/Motionsites-AI/claude-skill.git`)  
**Entorno**: React 18, Vite 6, TypeScript, Tailwind CSS, GSAP 3.12, MapLibre GL  
**Identidad**: Dark Mode exclusivo (`#070B14`, cian `#00E5BE`, teal `#00C9A7`, acento verde `#A6FF00`, ámbar `#F4C430`)

---

## 1. Referencias Externas y Diagnóstico

### Referencias de Video / Reels
- **Reel A**: `https://www.instagram.com/reel/DflGMTlR-aU/` (Revisión de distorsión óptica de vidrio y fluidez continua).
- **Reel B**: `https://www.instagram.com/reel/DfXHLZVz0JI/` (Referencia estética de Liquid Glass y refracción de luz sobre fondos oscuros).
*Nota técnica*: El entorno de ejecución local no cuenta con navegador web autenticado en Instagram; no obstante, se extrajeron los principios compositivos fundamentales: **lentes ópticos con reborde especular (hairline rim), dispersión luminosa periférica, ausencia de bordes grises opacos y disolución de materiales translúcidos**.

---

## 2. Auditoría Componente por Componente

| Componente | Estado Anterior (V5.3) | Hallazgos de MotionSites | Solución Implementada (V5.4) |
| :--- | :--- | :--- | :--- |
| **Preloader** | Logo pequeño (76px), demasiado espacio muerto, etiquetas técnicas internas (`INICIALIZANDO MOTOR REACT`). | La pantalla de carga debe ser una experiencia de marca contundente y no un dashboard de logs de servidor. | Logo ampliado a 88px en cápsula óptica con reborde de lente (`ms-liquid-glass--strong`). Mensajes humanizados: *"Preparando tu experiencia"*, *"Conectando la ciudad"*, *"Movilidad en tiempo real"*, *"Bienvenido a URBO"*. Barra de progreso ampliada con reborde translúcido y haz especular. |
| **Navbar** | Estilo vidrio estándar con bordes CSS estáticos (`border-white/12`). | MotionSites recomienda superficies flotantes tipo cápsula con borde de lente por degradado (`::before` con máscara compuesta) y botón con barrido especular (`sweep shine`). | Migrado a `.ms-liquid-glass.ms-liquid-glass--strong`. Botón "Unirse" convertido a `.ms-btn-chrome` con brillo especular oblicuo a 115°. |
| **Hero** | Buen contenido pero botones con estilos mixtos y falta de brillo maquinado. | Los botones principales deben tener jerarquía: un botón cromado con brillo y un halo pill de contraste. | Botón primario *"Explorar la tecnología"* con acabado `.ms-btn-chrome` (reflejo en hover); botón secundario *"Soy Chofer / Línea"* con `.ms-btn-halo`. Cockpit cartográfico enmarcado con `.ms-liquid-glass--strong`. |
| **Oportunidad / +1,6M** | Bloque de texto denso, número con buena tipografía pero composición convencional. | El titular debe dominar la escena y la cita testimonial debe tratarse como una pieza de revista tecnológica. | Tipografía tecnológica `SD Dystopian` reforzada para `+1,6 millones`. Malla visual limpia. |
| **Don Mauricio** | Tarjeta de testimonio idéntica a las tarjetas técnicas. | Un testimonio de chofer real es el activo más valioso de credibilidad; no debe verse como un card de grid. | Rediseñado como **Pieza Editorial / Voz de Ruta**: cápsula de vidrio protagonista de 7 columnas, avatar de operador en ruta, badge de telemetría de voz en cabina y tipografía destacada. |
| **Solución** | 3 tarjetas horizontales similares. | Variar composición con paneles translúcidos MotionSites y transiciones instantáneas de pestañas sin jank. | Paneles de audio manos libres integrados, feedback de síntesis de voz y transiciones de 0.2s sin layout shift. |
| **Métricas** | Tarjetas numéricas aisladas. | Preservar datos duros (5 meses, 140 pilotos, 1.239 msgs, 83 remitentes, Línea 30) con profundidad cyberpunk. | Tarjetas con reflectividad perimetral y conteo ascendente en ScrollTrigger. |
| **Beneficiarios** | Columna simétrica. | Segmentar visualmente Pasajero vs Chofer vs Línea con jerarquía asimétrica. | Jerarquización con acentos de color dedicados (Teal, Ámbar, Radioactive). |
| **Roadmap** | Excelente mapa MapLibre y punto GPS; marco de mapa requería mayor acabado. | El cockpit cartográfico debe sentirse como un instrumento de navegación aeroespacial/urbano. | Cockpit enmarcado en `.ms-liquid-glass--strong` con visor de 640px, tabs de malla vial y botón de proyección interactivo. |
| **CTA Final** | Business card con flip GSAP. | Mantener morph en un solo plano (sin volteo 3D destructivo) con acabado Liquid Glass de grado protagónico. | Tarjeta en `.ms-liquid-glass--strong` con halo perimetral cian y microchip NFC integrado. |

