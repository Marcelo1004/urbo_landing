================================================================================
SD DYSTOPIAN - DIAGNÓSTICO TÉCNICO, LICENCIA Y ESTRATEGIA DE INTEGRACIÓN
================================================================================

1. ORIGEN Y AUTORÍA
   - Nombre: SD Dystopian
   - Diseñador: Sudezine (2024)
   - Fuente oficial: https://www.fontspace.com/sd-dystopian-font-f109410
   - Licencia oficial FontSpace: Personal Use Only (Demo)

2. DIAGNÓSTICO TÉCNICO DEL ARCHIVO BINARIO
   - Archivo extraído: Sddystopiandemo-GO7xa.otf (13.7 KB)
   - Ubicación en URBO: /public/fonts/SDDystopian.otf y /public/fonts/SDDystopian.woff2
   - Juego de caracteres analizado:
     * Glifos presentes: ASCII Mayúsculas [A-Z], espacio, guión.
     * Glifos ausentes en demo: Minúsculas [a-z], números [0-9], acentos [á, é, í, ó, ú], letra [ñ, Ñ], signos de puntuación extendidos.
   - Restricción comercial:
     * Para uso comercial formal de URBO en producción, se debe adquirir la licencia comercial correspondiente con Sudezine.
     * La arquitectura webfont está 100% preparada para sustituir directamente 'SDDystopian.woff2' y 'SDDystopian.otf' con los archivos comerciales completos sin modificar una sola línea de código CSS ni React.

3. ESTRATEGIA DE FALLBACK TIPOGRÁFICO
   Debido a que la versión demo contiene exclusivamente glifos mayúsculos ASCII, se implementó la siguiente cadena de fallback en CSS/Tailwind:
   
   font-family: "SD Dystopian", "Syne", "Space Grotesk", "Outfit", sans-serif;

   - "SD Dystopian": Renderiza las palabras y titulares en mayúsculas con su estética cyberpunk / high-tech distintiva.
   - "Syne": Fuente geométrica display de Google Fonts que renderiza de forma idéntica e impecable cualquier carácter en minúscula, número o tildes del español (á, é, í, ó, ú, ñ).
   - "Space Grotesk": Monospaced/tech font para métricas, telemetría y HUDs.
   - "Outfit": Tipografía principal para párrafos, botones, descripciones y microcopy.

4. REGLA @FONT-FACE (src/index.css)
   @font-face {
     font-family: 'SD Dystopian';
     src: url('/fonts/SDDystopian.woff2') format('woff2'),
          url('/fonts/SDDystopian.otf') format('opentype');
     font-weight: 400 900;
     font-style: normal;
     font-display: swap;
   }
================================================================================
