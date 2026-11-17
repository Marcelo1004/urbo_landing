/**
 * URBO 3D Real Street Coordinates & Navigation Engine
 * Santa Cruz de la Sierra:
 * Multi-turn, curved, street-accurate route covering 7.53 kilometers:
 * 1. Casco Viejo & Catedral Metropolitana: [-63.18180, -17.78380]
 * 2. Giro Este por Calle Junín (90° turn): [-63.18170, -17.78160] -> [-63.17820, -17.78180]
 * 3. Giro Norte por Calle Beni / Murillo: [-63.17825, -17.78100] -> [-63.17865, -17.77690]
 * 4. Curva del Primer Anillo (Av. Uruguay) hacia Plaza del Estudiante: [-63.18215, -17.77620]
 * 5. Boulevard Monseñor Rivero: [-63.18220, -17.77500] -> [-63.18240, -17.77060]
 * 6. Rotonda Cristo Redentor & 2do Anillo (Curva envolvente): [-63.18240, -17.77060] -> [-63.18950, -17.77080]
 * 7. Corredor Equipetrol / Av. San Martín rumbo al 3er Anillo Interno: [-63.18940, -17.76950] -> [-63.18700, -17.76200]
 * 8. Tercer Anillo Externo hacia Av. Banzer: [-63.18600, -17.76160] -> [-63.17950, -17.76010]
 * 9. Corredor Metropolitano Norte hacia Viaducto Cuarto Anillo y 5to Anillo: [-63.17460, -17.74820] -> [-63.16940, -17.73720]
 * 
 * Total Distance: 7.53 km (7,530 m)
 */

import extendedRouteData from '../../../scripts/extended-curved-route.json';
import cityFeatures from '../../../scripts/city-features.json';

export interface NavWaypoint {
  coords: [number, number]; // [lng, lat]
  bearing: number;
  pitch: number;
  zoom: number;
  label?: string;
  chapter?: number;
}

export const SANTA_CRUZ_NAV_ROUTE: [number, number][] = extendedRouteData.coordinates as [number, number][];
export const CUMULATIVE_DISTANCES: number[] = extendedRouteData.cumulativeDistances;
export const ROUTE_BEARINGS: number[] = extendedRouteData.bearings;
export const TOTAL_ROUTE_DISTANCE: number = extendedRouteData.totalDistanceMeters;

export const NAV_ROUTE_GEOJSON: GeoJSON.Feature<GeoJSON.LineString> = {
  type: 'Feature',
  properties: {
    name: 'Corredor Metropolitano URBO · Catedral a 5to Anillo',
    distanceMeters: TOTAL_ROUTE_DISTANCE,
  },
  geometry: {
    type: 'LineString',
    coordinates: SANTA_CRUZ_NAV_ROUTE,
  },
};

// City Environment Features
export const STREET_LAMPS_GEOJSON = cityFeatures.streetLamps as GeoJSON.FeatureCollection;
export const PEDESTRIANS_DATA = cityFeatures.pedestrians;

// Hex color interpolator
function parseHex(hex: string): [number, number, number] {
  const c = parseInt(hex.replace('#', ''), 16);
  return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
}
function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}
export function lerpColor(hexA: string, hexB: string, t: number): string {
  const [r1, g1, b1] = parseHex(hexA);
  const [r2, g2, b2] = parseHex(hexB);
  return toHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

export interface DayNightVisuals {
  dayNightProgress: number; // 0 (day) to 1 (night)
  timeOfDayLabel: string;
  isDay: boolean;
  isSunset: boolean;
  isNight: boolean;
  backgroundColor: string; // MapLibre 'background'
  residentialColor: string; // MapLibre 'landuse_residential'
  minorRoadColor: string; // MapLibre 'highway_minor'
  majorRoadInnerColor: string; // MapLibre 'highway_major_inner'
  majorRoadCasingColor: string; // MapLibre 'highway_major_casing'
  buildingColor: string; // '3d-buildings' fill-extrusion
  lightColor: string; // 3D directional light
  lightIntensity: number;
  sunPosition: [number, number, number]; // [radial, azimuthal, polar]
  streetLampOpacity: number;
  routeColor: string;
  routeGlowColor: string;
  scrimTop: string;
  scrimBottom: string;
}

/**
 * Computes Day to Night visual parameters based on scroll progress
 * 1. 0.00 - 0.28: MAÑANA (08:30 - 10:45) - Gris asfalto cálido, sin maqueta blanca ni niebla lechosa.
 * 2. 0.28 - 0.50: TARDE (13:00 - 15:45) - Contraste nítido, micro avanzando por calles y curvas.
 * 3. 0.50 - 0.76: ATARDECER (16:15 - 19:30) - Luz dorada cálida desde las 16:00, sombras largas, farolas encendiéndose.
 * 4. 0.76 - 1.00: NOCHE (20:15 - 22:30) - Navy profundo #070B14 desde las 20:00, alumbrado vivo, ruta cyan fluorescente.
 */
export function getDayNightVisuals(progress: number): DayNightVisuals {
  const clamped = Math.max(0, Math.min(1, progress));
  
  let timeOfDayLabel = 'MAÑANA · 08:30';
  let isDay = true;
  let isSunset = false;
  let isNight = false;

  let backgroundColor = '#1E2838';
  let residentialColor = '#182230';
  let minorRoadColor = '#2A384E';
  let majorRoadInnerColor = '#556885';
  let majorRoadCasingColor = '#3B4C63';
  let buildingColor = '#33435C';
  let lightColor = '#FDE68A';
  let lightIntensity = 0.76;
  let sunPosition: [number, number, number] = [1.2, 115, 52];
  let streetLampOpacity = 0.0;
  let routeColor = '#00E5BE';
  let routeGlowColor = '#38BDF8';
  let scrimTop = 'linear-gradient(to bottom, rgba(11, 18, 32, 0.70) 0%, rgba(11, 18, 32, 0.15) 60%, transparent 100%)';
  let scrimBottom = 'linear-gradient(to top, rgba(11, 18, 32, 0.80) 0%, transparent 100%)';

  if (clamped < 0.28) {
    // Stage 1: MAÑANA CÁLIDA Y REAL EN SANTA CRUZ (0% - 28%)
    // Base de suelo gris cálido suave / cemento oscuro cálido. Sin blanco lavado ni overlays lechosos.
    const t = clamped / 0.28;
    const hour = Math.floor(8 + t * 2.5);
    const minute = Math.floor((t * 2.5 * 60) % 60);
    const minStr = minute < 10 ? `0${minute}` : minute;
    timeOfDayLabel = `MAÑANA · 0${hour}:${minStr}`;
    isDay = true;
    isSunset = false;
    isNight = false;

    backgroundColor = lerpColor('#1E2838', '#192233', t);
    residentialColor = lerpColor('#182230', '#141C2A', t);
    minorRoadColor = lerpColor('#2A384E', '#26344A', t);
    majorRoadInnerColor = lerpColor('#556885', '#4E617E', t);
    majorRoadCasingColor = lerpColor('#3B4C63', '#38475E', t);
    buildingColor = lerpColor('#33435C', '#2F3D54', t);
    lightColor = lerpColor('#FDE68A', '#FEF3C7', t);
    lightIntensity = 0.76 + t * 0.06;
    sunPosition = [1.2, 115 + t * 40, 52 - t * 10];
    streetLampOpacity = 0.0;
    routeColor = '#00E5BE';
    routeGlowColor = '#38BDF8';
    scrimTop = 'linear-gradient(to bottom, rgba(11, 18, 32, 0.70) 0%, rgba(11, 18, 32, 0.15) 60%, transparent 100%)';
    scrimBottom = 'linear-gradient(to top, rgba(11, 18, 32, 0.80) 0%, transparent 100%)';
  } else if (clamped < 0.50) {
    // Stage 2: TARDE (28% - 50%) · 13:00 - 15:45
    // Contraste equilibrado, sensación urbana viva, curvas del 1er y 2do Anillo
    const t = (clamped - 0.28) / 0.22;
    const hour = Math.floor(13 + t * 2.8);
    const minute = Math.floor((t * 2.8 * 60) % 60);
    const minStr = minute < 10 ? `0${minute}` : minute;
    timeOfDayLabel = `TARDE · ${hour}:${minStr}`;
    isDay = true;
    isSunset = false;
    isNight = false;

    backgroundColor = lerpColor('#192233', '#221D2F', t);
    residentialColor = lerpColor('#141C2A', '#1A1525', t);
    minorRoadColor = lerpColor('#26344A', '#332442', t);
    majorRoadInnerColor = lerpColor('#4E617E', '#735882', t);
    majorRoadCasingColor = lerpColor('#38475E', '#4E3A5E', t);
    buildingColor = lerpColor('#2F3D54', '#3E2F4C', t);
    lightColor = lerpColor('#FEF3C7', '#FDE68A', t);
    lightIntensity = 0.82 - t * 0.10;
    sunPosition = [1.2, 155 + t * 30, 42 - t * 12];
    streetLampOpacity = t * 0.15;
    routeColor = '#00E5BE';
    routeGlowColor = '#38BDF8';
    scrimTop = 'linear-gradient(to bottom, rgba(11, 18, 32, 0.75) 0%, rgba(11, 18, 32, 0.15) 60%, transparent 100%)';
    scrimBottom = 'linear-gradient(to top, rgba(11, 18, 32, 0.85) 0%, transparent 100%)';
  } else if (clamped < 0.76) {
    // Stage 3: ATARDECER DESDE LAS 16:00 (50% - 76%) · 16:15 - 19:30
    // Luz dorada, cielo cálido, sombras alargadas, reflejos ámbar en pavimento
    const t = (clamped - 0.50) / 0.26;
    const hour = Math.floor(16 + t * 3.3);
    const minute = Math.floor((t * 3.3 * 60) % 60);
    const minStr = minute < 10 ? `0${minute}` : minute;
    timeOfDayLabel = `ATARDECER · ${hour}:${minStr}`;
    isDay = false;
    isSunset = true;
    isNight = false;

    backgroundColor = lerpColor('#221D2F', '#2A1E35', t);
    residentialColor = lerpColor('#1A1525', '#21172B', t);
    minorRoadColor = lerpColor('#332442', '#3C2B4B', t);
    majorRoadInnerColor = lerpColor('#735882', '#FB923C', t);
    majorRoadCasingColor = lerpColor('#4E3A5E', '#553C68', t);
    buildingColor = lerpColor('#3E2F4C', '#453356', t);
    lightColor = lerpColor('#FDE68A', '#F97316', t);
    lightIntensity = 0.72 - t * 0.20;
    sunPosition = [1.3, 185 + t * 45, 30 - t * 18];
    streetLampOpacity = 0.15 + t * 0.65;
    routeColor = '#00E5BE';
    routeGlowColor = '#38BDF8';
    scrimTop = 'linear-gradient(to bottom, rgba(28, 18, 38, 0.85) 0%, rgba(28, 18, 38, 0.20) 60%, transparent 100%)';
    scrimBottom = 'linear-gradient(to top, rgba(28, 18, 38, 0.90) 0%, transparent 100%)';
  } else {
    // Stage 4: NOCHE PROFUNDA DESDE LAS 20:00 (76% - 100%) · 20:15 - 22:30
    // Navy #070B14, farolas encendidas, ruta cyan fluorescente, punto GPS protagonista
    const t = (clamped - 0.76) / 0.24;
    const hour = Math.floor(20 + t * 2.2);
    const minute = Math.floor((t * 2.2 * 60) % 60);
    const minStr = minute < 10 ? `0${minute}` : minute;
    timeOfDayLabel = `NOCHE · ${hour}:${minStr}`;
    isDay = false;
    isSunset = false;
    isNight = true;

    backgroundColor = lerpColor('#2A1E35', '#070B14', t);
    residentialColor = lerpColor('#21172B', '#0A1020', t);
    minorRoadColor = lerpColor('#3C2B4B', '#131E35', t);
    majorRoadInnerColor = lerpColor('#FB923C', '#1D2D4E', t);
    majorRoadCasingColor = lerpColor('#553C68', '#263B66', t);
    buildingColor = lerpColor('#453356', '#0F172A', t);
    lightColor = lerpColor('#F97316', '#38BDF8', t);
    lightIntensity = 0.45 - t * 0.15;
    sunPosition = [1.3, 230 + t * 35, 12 + t * 33];
    streetLampOpacity = 0.80 + t * 0.20;
    routeColor = '#00E5BE';
    routeGlowColor = '#38BDF8';
    scrimTop = 'linear-gradient(to bottom, rgba(7, 11, 20, 0.95) 0%, rgba(7, 11, 20, 0.30) 60%, transparent 100%)';
    scrimBottom = 'linear-gradient(to top, rgba(7, 11, 20, 0.96) 0%, transparent 100%)';
  }

  return {
    dayNightProgress: clamped,
    timeOfDayLabel,
    isDay,
    isSunset,
    isNight,
    backgroundColor,
    residentialColor,
    minorRoadColor,
    majorRoadInnerColor,
    majorRoadCasingColor,
    buildingColor,
    lightColor,
    lightIntensity,
    sunPosition,
    streetLampOpacity,
    routeColor,
    routeGlowColor,
    scrimTop,
    scrimBottom,
  };
}

/**
 * Interpolates [lng, lat], camera look-ahead center, bearing, pitch, zoom, chapter,
 * and day/night visual parameters based on accumulated distance along the 7.53 km route
 */
export function getNavStateAtProgress(progress: number): {
  beacon: [number, number]; // True GPS coordinate of the micro/beacon
  center: [number, number]; // Look-ahead camera focus point with cinematic cornering
  bearing: number;
  pitch: number;
  zoom: number;
  chapter: number;
  traveledDistanceMeters: number;
  dayNight: DayNightVisuals;
} {
  const coords = SANTA_CRUZ_NAV_ROUTE;
  const dists = CUMULATIVE_DISTANCES;
  const bearings = ROUTE_BEARINGS;
  const clamped = Math.max(0, Math.min(1, progress));
  const targetDist = clamped * TOTAL_ROUTE_DISTANCE;

  // Search along cumulative distances
  let idx = 0;
  while (idx < dists.length - 2 && dists[idx + 1] < targetDist) {
    idx++;
  }

  const d0 = dists[idx];
  const d1 = dists[idx + 1] || d0;
  const frac = d1 === d0 ? 0 : (targetDist - d0) / (d1 - d0);

  const c1 = coords[idx];
  const c2 = coords[idx + 1] || c1;

  const currentLng = c1[0] + (c2[0] - c1[0]) * frac;
  const currentLat = c1[1] + (c2[1] - c1[1]) * frac;

  // Dynamic smoothed bearing from actual street turns (Junín 90° East, Beni 0° North, 1er Anillo Arc, Equipetrol, Banzer)
  const b1 = bearings[idx] ?? 0;
  const b2 = bearings[idx + 1] ?? b1;
  // Circular interpolation for angles
  let diff = (b2 - b1 + 540) % 360 - 180;
  const currentBearing = (b1 + diff * frac + 360) % 360;

  // Look-ahead camera focus along current heading tangent (Google Maps 3D navigation feel)
  const forwardLookAhead = 0.0016;
  const rad = (currentBearing * Math.PI) / 180;
  const fwdLng = Math.sin(rad) * forwardLookAhead;
  const fwdLat = Math.cos(rad) * forwardLookAhead;

  // Dynamic pitch & zoom curves tuned for cinematic depth
  let pitch = 56;
  let zoom = 16.5;
  let chapter = 0;

  if (clamped < 0.15) {
    chapter = 0;
    pitch = 56 + (clamped / 0.15) * 4;
    zoom = 16.6;
  } else if (clamped < 0.36) {
    chapter = 1;
    pitch = 59;
    zoom = 16.4;
  } else if (clamped < 0.59) {
    chapter = 2;
    pitch = 57;
    zoom = 16.2;
  } else if (clamped < 0.82) {
    chapter = 3;
    pitch = 53;
    zoom = 15.8;
  } else {
    chapter = 4;
    pitch = 48;
    zoom = 15.3;
  }

  const dayNight = getDayNightVisuals(clamped);

  return {
    beacon: [currentLng, currentLat],
    center: [currentLng + fwdLng, currentLat + fwdLat],
    bearing: currentBearing,
    pitch,
    zoom,
    chapter,
    traveledDistanceMeters: targetDist,
    dayNight,
  };
}
