/**
 * URBO 3D Real Street Coordinates & Navigation Engine
 * Santa Cruz de la Sierra:
 * 1. Catedral Metropolitana (Plaza 24 de Septiembre): [-63.18156, -17.78375]
 * 2. Plaza del Estudiante & Cruce Primer Anillo: [-63.18211, -17.77620]
 * 3. Av. Monseñor Rivero (Boulevard gastronómico & camellón central): [-63.18221, -17.77373]
 * 4. Rotonda Segundo Anillo (Monumento Cristo Redentor): [-63.18240, -17.77058]
 * 5. Corredor Norte / Av. Banzer hacia 3er Anillo: [-63.17935, -17.76008]
 * 6. Viaducto Cuarto Anillo y Cristo Redentor: [-63.17463, -17.74822]
 * 
 * Total verified continuous street distance: 5.042 kilometers (5,041.8 m)
 * 100% extracted from OpenStreetMap road centerline nodes.
 */

import stitchedData from '../../../scripts/stitched-route.json';
import cityFeatures from '../../../scripts/city-features.json';

export interface NavWaypoint {
  coords: [number, number]; // [lng, lat]
  bearing: number;
  pitch: number;
  zoom: number;
  label?: string;
  chapter?: number;
}

export const SANTA_CRUZ_NAV_ROUTE: [number, number][] = stitchedData.coordinates as [number, number][];
export const CUMULATIVE_DISTANCES: number[] = stitchedData.cumulativeDistances;
export const TOTAL_ROUTE_DISTANCE: number = stitchedData.totalDistanceMeters;

export const NAV_ROUTE_GEOJSON: GeoJSON.Feature<GeoJSON.LineString> = {
  type: 'Feature',
  properties: {
    name: 'Corredor Troncal URBO · Catedral Metropolitana a 4to Anillo',
    distanceMeters: TOTAL_ROUTE_DISTANCE,
  },
  geometry: {
    type: 'LineString',
    coordinates: SANTA_CRUZ_NAV_ROUTE,
  },
};

// Key Landmarks along the 5km corridor
export const CATEDRAL_COORDS: [number, number] = [-63.18156, -17.78375];
export const ESTUDIANTE_COORDS: [number, number] = [-63.18211, -17.77620];
export const CRISTO_COORDS: [number, number] = [-63.18240, -17.77058];
export const TERCER_ANILLO_COORDS: [number, number] = [-63.17935, -17.76008];
export const CUARTO_ANILLO_COORDS: [number, number] = [-63.17463, -17.74822];

// City Environment Features
export const STREET_LAMPS_GEOJSON = cityFeatures.streetLamps as GeoJSON.FeatureCollection;
export const URBAN_GREENERY_GEOJSON = cityFeatures.urbanGreenery as GeoJSON.FeatureCollection;
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
  backgroundColor: string;
  buildingColor: string;
  lightColor: string;
  lightIntensity: number;
  streetLampOpacity: number;
  routeColor: string;
  routeGlowColor: string;
}

/**
 * Computes Day to Night visual parameters based on scroll progress
 */
export function getDayNightVisuals(progress: number): DayNightVisuals {
  const clamped = Math.max(0, Math.min(1, progress));
  
  // Transition progression:
  // 0.0 - 0.25: Día pleno (cielo slate claro, luz cálida)
  // 0.25 - 0.55: Tarde dorada (golden hour)
  // 0.55 - 0.78: Atardecer / Sunset (tonos azulados / violetas, lámparas encendiéndose)
  // 0.78 - 1.00: Noche profunda (deep navy URBO #070B14, luces vivas, ruta neón)

  let timeOfDayLabel = 'DÍA · 14:30';
  let backgroundColor = '#D8E2EC';
  let buildingColor = '#CBD5E1';
  let lightColor = '#FFF6E6';
  let lightIntensity = 0.65;
  let streetLampOpacity = 0.0;
  let routeColor = '#0284C7'; // Deep cyan for daylight visibility
  let routeGlowColor = '#009E85';

  if (clamped < 0.25) {
    // Stage 1: Día
    const t = clamped / 0.25;
    timeOfDayLabel = 'DÍA · 14:30';
    backgroundColor = lerpColor('#D8E2EC', '#D4DEEA', t);
    buildingColor = lerpColor('#CBD5E1', '#B0BEC5', t);
    lightColor = '#FFF6E6';
    lightIntensity = 0.65 - (t * 0.08);
    streetLampOpacity = 0.0;
    routeColor = '#0284C7';
    routeGlowColor = '#009E85';
  } else if (clamped < 0.55) {
    // Stage 2: Tarde / Golden Hour
    const t = (clamped - 0.25) / 0.30;
    timeOfDayLabel = 'TARDE · 17:15';
    backgroundColor = lerpColor('#D4DEEA', '#C7A27C', t);
    buildingColor = lerpColor('#B0BEC5', '#7E7A8E', t);
    lightColor = lerpColor('#FFF6E6', '#FFD199', t);
    lightIntensity = 0.57 - (t * 0.15);
    streetLampOpacity = t * 0.35; // Lamp filaments start glowing
    routeColor = lerpColor('#0284C7', '#0EA5E9', t);
    routeGlowColor = lerpColor('#009E85', '#00C9A7', t);
  } else if (clamped < 0.78) {
    // Stage 3: Atardecer / Sunset
    const t = (clamped - 0.55) / 0.23;
    timeOfDayLabel = 'ATARDECER · 18:45';
    backgroundColor = lerpColor('#C7A27C', '#3A345B', t);
    buildingColor = lerpColor('#7E7A8E', '#3D3852', t);
    lightColor = lerpColor('#FFD199', '#FF8C69', t);
    lightIntensity = 0.42 - (t * 0.18);
    streetLampOpacity = 0.35 + (t * 0.55); // Full streetlight activation
    routeColor = lerpColor('#0EA5E9', '#38BDF8', t);
    routeGlowColor = '#00E5BE';
  } else {
    // Stage 4: Noche profunda
    const t = (clamped - 0.78) / 0.22;
    timeOfDayLabel = 'NOCHE · 20:30';
    backgroundColor = lerpColor('#3A345B', '#070B14', t);
    buildingColor = lerpColor('#3D3852', '#162035', t);
    lightColor = lerpColor('#FF8C69', '#38BDF8', t);
    lightIntensity = 0.24 - (t * 0.06);
    streetLampOpacity = 0.90 + (t * 0.10);
    routeColor = '#38BDF8'; // Full cyberpunk URBO Cyan
    routeGlowColor = '#00E5BE';
  }

  return {
    dayNightProgress: clamped,
    timeOfDayLabel,
    backgroundColor,
    buildingColor,
    lightColor,
    lightIntensity,
    streetLampOpacity,
    routeColor,
    routeGlowColor,
  };
}

/**
 * Interpolates [lng, lat], camera look-ahead center, bearing, pitch, zoom, chapter,
 * and day/night visual parameters based on accumulated distance along the 5.042 km route
 */
export function getNavStateAtProgress(progress: number): {
  beacon: [number, number]; // True GPS coordinate of the micro/beacon
  center: [number, number]; // Look-ahead camera focus point (Google Maps navigation perspective)
  bearing: number;
  pitch: number;
  zoom: number;
  chapter: number;
  traveledDistanceMeters: number;
  dayNight: DayNightVisuals;
} {
  const coords = SANTA_CRUZ_NAV_ROUTE;
  const dists = CUMULATIVE_DISTANCES;
  const clamped = Math.max(0, Math.min(1, progress));
  const targetDist = clamped * TOTAL_ROUTE_DISTANCE;

  // Binary or linear search along cumulative distances
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

  // Tangent bearing calculation along current road segment
  const dLng = c2[0] - c1[0];
  const dLat = c2[1] - c1[1];
  let segmentBearing = (Math.atan2(dLng, dLat) * 180) / Math.PI;

  // Camera drift aligning with the corridor (Santa Cruz north corridor has slight eastern angle ~12°)
  const targetBearing = -5 + (clamped * 16);

  // Dynamic pitch & zoom curves:
  // Starts with an immersive 58° tilt at Catedral, dips to 63° along Monseñor Rivero,
  // relaxes to 58° at Cristo Redentor for monument visibility, 52° for corridor overview,
  // and 46° for Cuarto Anillo panoramic handoff
  let pitch = 58;
  let zoom = 16.6;
  let chapter = 0;
  let forwardLookAhead = 0.0016;

  // 5 Chapter Milestones:
  // 0: Catedral Metropolitana (0% - 18%) -> 0m to 900m
  // 1: Plaza del Estudiante & Primer Anillo (18% - 38%) -> 900m to 1,900m
  // 2: Monumento Cristo Redentor (38% - 60%) -> 1,900m to 3,000m
  // 3: Corredor Norte & Tercer Anillo (60% - 82%) -> 3,000m to 4,100m
  // 4: Visión URBO & Cuarto Anillo (82% - 100%) -> 4,100m to 5,042m

  if (clamped < 0.18) {
    chapter = 0;
    pitch = 58 + (clamped / 0.18) * 4;
    zoom = 16.7 - (clamped / 0.18) * 0.2;
    forwardLookAhead = 0.0014;
  } else if (clamped < 0.38) {
    chapter = 1;
    pitch = 62;
    zoom = 16.5;
    forwardLookAhead = 0.0016;
  } else if (clamped < 0.60) {
    chapter = 2;
    pitch = 59;
    zoom = 16.3;
    forwardLookAhead = 0.0015;
  } else if (clamped < 0.82) {
    chapter = 3;
    pitch = 54;
    zoom = 15.8;
    forwardLookAhead = 0.0018;
  } else {
    chapter = 4;
    pitch = 48;
    zoom = 15.3;
    forwardLookAhead = 0.0022;
  }

  const dayNight = getDayNightVisuals(clamped);

  return {
    beacon: [currentLng, currentLat],
    center: [currentLng, currentLat + forwardLookAhead],
    bearing: targetBearing,
    pitch,
    zoom,
    chapter,
    traveledDistanceMeters: targetDist,
    dayNight,
  };
}
