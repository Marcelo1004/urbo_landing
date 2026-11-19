/**
 * URBO 3D Real Street Coordinates & Navigation Engine
 * Santa Cruz de la Sierra:
 * 100% extracted from OpenStreetMap road centerline nodes:
 * 1. Casco Viejo & Catedral Metropolitana: [-63.18155, -17.78375]
 * 2. Calle 24 de Septiembre y Cruce 1er Anillo: [-63.18210, -17.77620]
 * 3. Avenida Monseñor Rivero (Boulevard gastronómico & camellón): [-63.18221, -17.77373]
 * 4. Rotonda Segundo Anillo (Monumento Cristo Redentor): [-63.18240, -17.77058]
 * 5. Corredor Norte / Avenida Banzer hacia 3er Anillo: [-63.17935, -17.76008]
 * 6. 4to Anillo: [-63.17460, -17.74800]
 * 7. 5to Anillo: [-63.17200, -17.73300]
 * 8. 6to Anillo: [-63.17145, -17.71800]
 * 9. 7mo Anillo: [-63.17188, -17.69980]
 *
 * Total Continuous Real Street Distance: ~9.5 km
 * Route flows continuously NORTHWARD — zero U-turns
 */

import realOsmRouteData from '../../../scripts/real-osm-street-route.json';
import cityFeatures from '../../../scripts/city-features.json';

export interface NavWaypoint {
  coords: [number, number]; // [lng, lat]
  bearing: number;
  pitch: number;
  zoom: number;
  label?: string;
  chapter?: number;
}

export const SANTA_CRUZ_NAV_ROUTE: [number, number][] = realOsmRouteData.coordinates as [number, number][];
export const CUMULATIVE_DISTANCES: number[] = realOsmRouteData.cumulativeDistances;
export const ROUTE_BEARINGS: number[] = realOsmRouteData.bearings;
export const TOTAL_ROUTE_DISTANCE: number = realOsmRouteData.totalDistanceMeters;

export const NAV_ROUTE_GEOJSON: GeoJSON.Feature<GeoJSON.LineString> = {
  type: 'Feature',
  properties: {
    name: 'Corredor Metropolitano Troncal URBO · Catedral a 7mo Anillo Norte',
    distanceMeters: TOTAL_ROUTE_DISTANCE,
  },
  geometry: {
    type: 'LineString',
    coordinates: SANTA_CRUZ_NAV_ROUTE,
  },
};

// Key landmark coordinates
export const CATEDRAL_COORDS: [number, number] = [-63.18155, -17.78375];
export const ESTUDIANTE_COORDS: [number, number] = [-63.18210, -17.77620];
export const CRISTO_COORDS: [number, number] = [-63.18240, -17.77058];
export const TERCER_ANILLO_COORDS: [number, number] = [-63.17935, -17.76008];
export const CUARTO_ANILLO_COORDS: [number, number] = [-63.17460, -17.74800];

// City Environment Features
export const STREET_LAMPS_GEOJSON = cityFeatures.streetLamps as GeoJSON.FeatureCollection;
export const URBAN_GREENERY_GEOJSON = cityFeatures.urbanGreenery as GeoJSON.FeatureCollection | undefined;
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
  backgroundColor: string;
  residentialColor: string;
  minorRoadColor: string;
  majorRoadInnerColor: string;
  majorRoadCasingColor: string;
  buildingColor: string;
  lightColor: string;
  lightIntensity: number;
  sunPosition: [number, number, number];
  streetLampOpacity: number;
  routeColor: string;
  routeGlowColor: string;
  scrimTop: string;
  scrimBottom: string;
}

/**
 * Day to Night visual parameters — 4-stage atmospheric transition
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
    // Stage 1: MAÑANA (0% - 28%)
    const t = clamped / 0.28;
    const hour = Math.floor(8 + t * 3.0);
    const minute = Math.floor((t * 3.0 * 60) % 60);
    const minStr = minute < 10 ? `0${minute}` : minute;
    timeOfDayLabel = `MAÑANA · 0${hour}:${minStr}`;
    isDay = true;

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
  } else if (clamped < 0.52) {
    // Stage 2: TARDE (28% - 52%)
    const t = (clamped - 0.28) / 0.24;
    const hour = Math.floor(13 + t * 2.8);
    const minute = Math.floor((t * 2.8 * 60) % 60);
    const minStr = minute < 10 ? `0${minute}` : minute;
    timeOfDayLabel = `TARDE · ${hour}:${minStr}`;
    isDay = true;

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
    // Stage 3: ATARDECER (52% - 76%)
    const t = (clamped - 0.52) / 0.24;
    const hour = Math.floor(16 + t * 3.3);
    const minute = Math.floor((t * 3.3 * 60) % 60);
    const minStr = minute < 10 ? `0${minute}` : minute;
    timeOfDayLabel = `ATARDECER · ${hour}:${minStr}`;
    isDay = false;
    isSunset = true;

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
    // Stage 4: NOCHE (76% - 100%)
    const t = (clamped - 0.76) / 0.24;
    const hour = Math.floor(20 + t * 2.2);
    const minute = Math.floor((t * 2.2 * 60) % 60);
    const minStr = minute < 10 ? `0${minute}` : minute;
    timeOfDayLabel = `NOCHE · ${hour}:${minStr}`;
    isDay = false;
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
 * Interpolates navigation state along the route.
 * Camera angles vary cinematically throughout the journey.
 * Final 5% transitions to cenital (top-down) for storytelling closure.
 */
export function getNavStateAtProgress(progress: number): {
  beacon: [number, number];
  center: [number, number];
  bearing: number;
  pitch: number;
  zoom: number;
  chapter: number;
  traveledDistanceMeters: number;
  dayNight: DayNightVisuals;
  isCenital: boolean;
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

  // Dynamic smoothed bearing
  const b1 = bearings[idx] ?? 0;
  const b2 = bearings[idx + 1] ?? b1;
  let diff = (b2 - b1 + 540) % 360 - 180;
  const currentBearing = (b1 + diff * frac + 360) % 360;

  // Cinematic camera curves with variety tuned to actual street geometry
  let pitch = 56;
  let zoom = 16.5;
  let chapter = 0;
  let isCenital = false;

  if (clamped < 0.14) {
    // Ch 0: Casco Viejo & Plaza 24 de Septiembre
    chapter = 0;
    pitch = 56 + (clamped / 0.14) * 4; // 56→60
    zoom = 17.7 - (clamped / 0.14) * 0.9; // 17.7→16.8 (Catedral protagonist, then descend)
  } else if (clamped < 0.32) {
    // Ch 1 / 2: Av. Monseñor Rivero & Rotonda Cristo Redentor (2do Anillo)
    chapter = 1;
    const t = (clamped - 0.14) / 0.18;
    pitch = 60 - t * 10; // 60→50 (frames the Cristo Redentor statue)
    const cz = (clamped - 0.17) / 0.035;
    zoom = 16.8 - t * 0.6 + 0.9 * Math.exp(-cz * cz); // push-in on Cristo Redentor
  } else if (clamped < 0.56) {
    // Ch 2: Av. Banzer hacia 3er Anillo / Equipetrol
    chapter = 2;
    const t = (clamped - 0.32) / 0.24;
    pitch = 50 + t * 4; // 50→54
    zoom = 16.2 - t * 0.5; // 16.2→15.7
  } else if (clamped < 0.86) {
    // Ch 3: Corredor Metropolitano 4to a 7mo Anillo
    chapter = 3;
    const t = (clamped - 0.56) / 0.30;
    pitch = 54 - t * 14; // 54→40 (begins rising)
    zoom = 15.7 - t * 0.6; // 15.7→15.1
  } else {
    // CENITAL CLOSURE (86% - 100%) — pure top-down metropolitan view
    chapter = 4;
    isCenital = true;
    const t = (clamped - 0.86) / 0.14; // 0→1 over final 14%
    const smoothT = t * t * (3 - 2 * t); // smoothstep
    pitch = 40 - smoothT * 40; // 40→0 (completely vertical cenital view)
    zoom = 15.1 - smoothT * 2.3; // 15.1→12.8 (wide metropolitan vista)
  }

  const dayNight = getDayNightVisuals(clamped);

  // When transitioning to cenital, smoothly orient bearing to 0 (North-up)
  let targetBearing = currentBearing;
  if (clamped >= 0.86) {
    const t = (clamped - 0.86) / 0.14;
    const smoothT = t * t * (3 - 2 * t);
    // Smoothly rotate to North (0°)
    let bDiff = ((0 - currentBearing + 540) % 360) - 180;
    targetBearing = (currentBearing + bDiff * smoothT + 360) % 360;
  }

  return {
    beacon: [currentLng, currentLat],
    center: [currentLng, currentLat],
    bearing: targetBearing,
    pitch,
    zoom,
    chapter,
    traveledDistanceMeters: targetDist,
    dayNight,
    isCenital,
  };
}

