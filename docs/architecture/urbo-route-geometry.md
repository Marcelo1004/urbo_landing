# URBO — Geometría y Enrutamiento Vial Real
## Arquitectura de Cartografía 3D, Validación OpenStreetMap y Motor de Enrutamiento

---

### 1. Diagnóstico y Problema Previo

En iteraciones anteriores, el Hero 3D procedía mediante una secuencia reducida de 18 puntos aproximados unidos por segmentos rectilíneos. Al proyectarse sobre la malla cartográfica de MapLibre, los segmentos cortaban manzanas urbanas y atravesaban esquinas en diagonal sin reflejar la curvatura real de las vías, las rotondas ni el sentido de circulación.

Para resolver esto con rigor técnico, se implementó una extracción y ensamblado geométrico basado en **OpenStreetMap (OSM)** y motores de enrutamiento compatibles (**OSRM / Overpass API**).

---

### 2. Motor de Enrutamiento y Fuentes de Datos

- **Motor de Consulta y Geometría**: OpenStreetMap Overpass API + OSRM Driving Engine (`router.project-osrm.org`).
- **Nodos de Red Vial**: Se consultaron y ensamblaron los ways oficiales de la red troncal de Santa Cruz de la Sierra:
  - `Way 23262895` y `Way 1467461107`: *Calle 24 de Septiembre* (Casco Viejo, sentido único norte).
  - `Way 27819670`, `437682646`, `481862036`, `439821963`, `1125987817`, `1125987816`, `674845976`, `612699531`: *Avenida Monseñor Rivero* (calzada este, sentido norte, bordeando el camellón central arbolado).
  - `Way 437683970`, `92937082`, `1125987818`: *Rotonda Segundo Anillo (Monumento Cristo Redentor)*.
  - `Way 612699543`, `974462046`, `462699991`, `462699990`, `462699993`, `441697756`, `407714871`, `974373998`, `854818788`, `1545263072`, `174170559`, `1545263077`: *Avenida Cristo Redentor (Av. Banzer)* en dirección norte hasta el Viaducto del Cuarto Anillo.

---

### 3. Waypoints Urbanos Verificados

| # | Hito Urbano | Coordenadas `[Lng, Lat]` | Distancia Acumulada | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Catedral Metropolitana** | `[-63.18156, -17.78375]` | `0.0 m` | Plaza 24 de Septiembre, inicio del corredor troncal. |
| **02** | **Plaza del Estudiante** | `[-63.18211, -17.77620]` | `850.5 m` | Intersección con Primer Anillo y arranque del Boulevard Monseñor Rivero. |
| **03** | **Monumento Cristo Redentor** | `[-63.18240, -17.77058]` | `1,480.2 m` | Rotonda central del Segundo Anillo (Av. Cristóbal de Mendoza). |
| **04** | **Av. Banzer / Tercer Anillo** | `[-63.17935, -17.76008]` | `3,115.4 m` | Nudo de la zona norte y zona comercial. |
| **05** | **Viaducto Cuarto Anillo** | `[-63.17463, -17.74822]` | `5,041.8 m` | Entrada al anillo exterior metropolitano. |

- **Distancia total continua**: **5.042 kilómetros** (5.041,8 metros).
- **Cantidad de nodos cartográficos**: **113 coordenadas de alta densidad**.
- **Continuidad**: Cada punto coincide exactamente con los ejes de calzada de los tiles vectoriales de MapLibre (`OpenFreeMap dark`).

---

### 4. Técnica de Interpolación por Distancia Acumulada

A diferencia de la interpolación ingenua por índice de array (donde un tramo corto de 20 m y uno largo de 400 m tendrían la misma duración artificial), el motor calcula las distancias físicas acumuladas en metros mediante la fórmula de Haversine:

$$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \varphi}{2}\right) + \cos(\varphi_1)\cos(\varphi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$

Donde $R = 6,371,000 \text{ m}$.

Dado un progreso de scroll normalizado $p \in [0.0, 1.0]$:
1. Se calcula la distancia objetivo: $d_{\text{target}} = p \cdot 5041.8 \text{ m}$.
2. Se localizan los nodos adyacentes $N_k$ y $N_{k+1}$ tales que $d_k \le d_{\text{target}} \le d_{k+1}$.
3. Se calcula la fracción local $f = \frac{d_{\text{target}} - d_k}{d_{k+1} - d_k}$.
4. La coordenada del marcador GPS es:
   $$P_{\text{beacon}} = (1 - f) N_k + f N_{k+1}$$
5. La cámara enfoca un punto *look-ahead* desplazado hacia adelante en el eje de la vía:
   $$P_{\text{center}} = P_{\text{beacon}} + (0, \Delta_{\text{lookAhead}})$$
   Garantizando que el punto GPS azul se ubique en el tercio inferior (~30%) de la pantalla, visualizando la avenida hacia el horizonte en 3D (estilo Google Maps Navigation).
