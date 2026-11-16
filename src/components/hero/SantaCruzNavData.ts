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
  let backgroundColor = '#0A0F1D';
  let buildingColor = '#243447';
  let lightColor = '#E2E8F0';
  let lightIntensity = 0.70;
  let streetLampOpacity = 0.0;
  let routeColor = '#00E5BE'; // High-contrast Emerald Cyan on dark map
  let routeGlowColor = '#38BDF8';

  if (clamped < 0.25) {
    // Stage 1: Día
    const t = clamped / 0.25;
    timeOfDayLabel = 'DÍA · 14:30';
    backgroundColor = lerpColor('#0A0F1D', '#0D1527', t);
    buildingColor = lerpColor('#243447', '#2A3B53', t);
    lightColor = '#E2E8F0';
    lightIntensity = 0.70 - (t * 0.08);
    streetLampOpacity = 0.0;
    routeColor = '#00E5BE';
    routeGlowColor = '#38BDF8';
  } else if (clamped < 0.55) {
    // Stage 2: Tarde / Golden Hour
    const t = (clamped - 0.25) / 0.30;
    timeOfDayLabel = 'TARDE · 17:15';
    backgroundColor = lerpColor('#0D1527', '#13192B', t);
    buildingColor = lerpColor('#2A3B53', '#323048', t);
    lightColor = lerpColor('#E2E8F0', '#FDE68A', t);
    lightIntensity = 0.62 - (t * 0.12);
    streetLampOpacity = t * 0.40; // Lamp filaments start glowing
    routeColor = lerpColor('#00E5BE', '#00E5BE', t);
    routeGlowColor = lerpColor('#38BDF8', '#00E5BE', t);
  } else if (clamped < 0.78) {
    // Stage 3: Atardecer / Sunset
    const t = (clamped - 0.55) / 0.23;
    timeOfDayLabel = 'ATARDECER · 18:45';
    backgroundColor = lerpColor('#13192B', '#111728', t);
    buildingColor = lerpColor('#323048', '#25253D', t);
    lightColor = lerpColor('#FDE68A', '#FB923C', t);
    lightIntensity = 0.50 - (t * 0.18);
    streetLampOpacity = 0.40 + (t * 0.50); // Streetlight activation
    routeColor = lerpColor('#00E5BE', '#38BDF8', t);
    routeGlowColor = '#00E5BE';
  } else {
    // Stage 4: Noche profunda
    const t = (clamped - 0.78) / 0.22;
    timeOfDayLabel = 'NOCHE · 20:30';
    backgroundColor = lerpColor('#111728', '#070B14', t);
    buildingColor = lerpColor('#25253D', '#162035', t);
    lightColor = lerpColor('#FB923C', '#38BDF8', t);
    lightIntensity = 0.32 - (t * 0.08);
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
