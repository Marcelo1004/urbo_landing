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
  isDay: boolean;
  isSunset: boolean;
  isNight: boolean;
  backgroundColor: string; // MapLibre 'background'
  residentialColor: string; // MapLibre 'landuse_residential'
  parkColor: string; // MapLibre 'landuse_park'
  urbanGreeneryColor: string; // 'urban-greenery-fill'
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
 * 0.00 - 0.25: Día pleno (Cielo slate claro, pavimento gris azulado claro, luz solar brillante)
 * 0.25 - 0.55: Tarde dorada (Golden hour, sombras cálidas, farolas encendiéndose)
 * 0.55 - 0.78: Atardecer / Sunset (Tonos ámbar/violeta, farolas iluminadas, ruta destacada)
 * 0.78 - 1.00: Noche profunda (Deep midnight navy, luces urbanas vivas, ruta neón)
 */
export function getDayNightVisuals(progress: number): DayNightVisuals {
  const clamped = Math.max(0, Math.min(1, progress));
  
  let timeOfDayLabel = 'DÍA · 14:30';
  let isDay = true;
  let isSunset = false;
  let isNight = false;

  let backgroundColor = '#D6E0EA';
  let residentialColor = '#E2E8F0';
  let parkColor = '#86EFAC';
  let urbanGreeneryColor = '#16A34A';
  let minorRoadColor = '#CBD5E1';
  let majorRoadInnerColor = '#FFFFFF';
  let majorRoadCasingColor = '#94A3B8';
  let buildingColor = '#CBD5E1';
  let lightColor = '#FFFBEB';
  let lightIntensity = 0.85;
  let sunPosition: [number, number, number] = [1.2, 135, 60];
  let streetLampOpacity = 0.0;
  let routeColor = '#059669'; // High-contrast emerald cyan that pops on daylight pavement
  let routeGlowColor = '#0284C7';
  let scrimTop = 'linear-gradient(to bottom, rgba(214, 224, 234, 0.85) 0%, rgba(214, 224, 234, 0.20) 60%, transparent 100%)';
  let scrimBottom = 'linear-gradient(to top, rgba(214, 224, 234, 0.88) 0%, transparent 100%)';

  if (clamped < 0.25) {
    // Stage 1: DÍA PLENO (0% - 25%)
    const t = clamped / 0.25;
    timeOfDayLabel = 'DÍA · 14:30';
    isDay = true;
    isSunset = false;
    isNight = false;

    backgroundColor = lerpColor('#D6E0EA', '#CAD5E2', t);
    residentialColor = lerpColor('#E2E8F0', '#D9E2EC', t);
    parkColor = lerpColor('#86EFAC', '#6EE7B7', t);
    urbanGreeneryColor = lerpColor('#16A34A', '#15803D', t);
    minorRoadColor = lerpColor('#CBD5E1', '#BAC7D5', t);
    majorRoadInnerColor = '#FFFFFF';
    majorRoadCasingColor = lerpColor('#94A3B8', '#8596A9', t);
    buildingColor = lerpColor('#CBD5E1', '#B8C5D3', t);
    lightColor = '#FFFBEB';
    lightIntensity = 0.85 - t * 0.10;
    sunPosition = [1.2, 135 + t * 30, 60 - t * 10];
    streetLampOpacity = 0.0;
    routeColor = '#059669';
    routeGlowColor = '#0284C7';
    scrimTop = 'linear-gradient(to bottom, rgba(214, 224, 234, 0.85) 0%, rgba(214, 224, 234, 0.20) 60%, transparent 100%)';
    scrimBottom = 'linear-gradient(to top, rgba(214, 224, 234, 0.88) 0%, transparent 100%)';
  } else if (clamped < 0.55) {
    // Stage 2: TARDE DORADA / GOLDEN HOUR (25% - 55%)
    const t = (clamped - 0.25) / 0.30;
    timeOfDayLabel = 'TARDE · 17:15';
    isDay = false;
    isSunset = true;
    isNight = false;

    backgroundColor = lerpColor('#CAD5E2', '#4D425E', t);
    residentialColor = lerpColor('#D9E2EC', '#413752', t);
    parkColor = lerpColor('#6EE7B7', '#254737', t);
    urbanGreeneryColor = lerpColor('#15803D', '#166534', t);
    minorRoadColor = lerpColor('#BAC7D5', '#574A6B', t);
    majorRoadInnerColor = lerpColor('#FFFFFF', '#FDE68A', t);
    majorRoadCasingColor = lerpColor('#8596A9', '#66577D', t);
    buildingColor = lerpColor('#B8C5D3', '#6A5B75', t);
    lightColor = lerpColor('#FFFBEB', '#FDBA74', t);
    lightIntensity = 0.75 - t * 0.18;
    sunPosition = [1.3, 165 + t * 40, 50 - t * 20];
    streetLampOpacity = t * 0.40;
    routeColor = lerpColor('#059669', '#00E5BE', t);
    routeGlowColor = lerpColor('#0284C7', '#38BDF8', t);
    scrimTop = 'linear-gradient(to bottom, rgba(77, 66, 94, 0.85) 0%, rgba(77, 66, 94, 0.20) 60%, transparent 100%)';
    scrimBottom = 'linear-gradient(to top, rgba(77, 66, 94, 0.88) 0%, transparent 100%)';
  } else if (clamped < 0.78) {
    // Stage 3: ATARDECER / SUNSET (55% - 78%)
    const t = (clamped - 0.55) / 0.23;
    timeOfDayLabel = 'ATARDECER · 18:45';
    isDay = false;
    isSunset = true;
    isNight = false;

    backgroundColor = lerpColor('#4D425E', '#191528', t);
    residentialColor = lerpColor('#413752', '#141021', t);
    parkColor = lerpColor('#254737', '#0C2018', t);
    urbanGreeneryColor = lerpColor('#166534', '#0D3D2B', t);
    minorRoadColor = lerpColor('#574A6B', '#251E38', t);
    majorRoadInnerColor = lerpColor('#FDE68A', '#FB923C', t);
    majorRoadCasingColor = lerpColor('#66577D', '#3E3154', t);
    buildingColor = lerpColor('#6A5B75', '#2E243D', t);
    lightColor = lerpColor('#FDBA74', '#FB7185', t);
    lightIntensity = 0.57 - t * 0.22;
    sunPosition = [1.3, 205 + t * 45, 30 - t * 15];
    streetLampOpacity = 0.40 + t * 0.45;
    routeColor = '#00E5BE';
    routeGlowColor = '#38BDF8';
    scrimTop = 'linear-gradient(to bottom, rgba(25, 21, 40, 0.90) 0%, rgba(25, 21, 40, 0.30) 60%, transparent 100%)';
    scrimBottom = 'linear-gradient(to top, rgba(25, 21, 40, 0.92) 0%, transparent 100%)';
  } else {
    // Stage 4: NOCHE PROFUNDA (78% - 100%)
    const t = (clamped - 0.78) / 0.22;
    timeOfDayLabel = 'NOCHE · 20:30';
    isDay = false;
    isSunset = false;
    isNight = true;

    backgroundColor = lerpColor('#191528', '#070B14', t);
    residentialColor = lerpColor('#141021', '#0A1020', t);
    parkColor = lerpColor('#0C2018', '#041B16', t);
    urbanGreeneryColor = lerpColor('#0D3D2B', '#064E3B', t);
    minorRoadColor = lerpColor('#251E38', '#131E35', t);
    majorRoadInnerColor = lerpColor('#FB923C', '#1D2D4E', t);
    majorRoadCasingColor = lerpColor('#3E3154', '#263B66', t);
    buildingColor = lerpColor('#2E243D', '#0F172A', t);
    lightColor = lerpColor('#FB7185', '#38BDF8', t);
    lightIntensity = 0.35 - t * 0.13;
    sunPosition = [1.3, 250 + t * 20, 15 + t * 35];
    streetLampOpacity = 0.85 + t * 0.15;
    routeColor = '#38BDF8';
    routeGlowColor = '#00E5BE';
    scrimTop = 'linear-gradient(to bottom, rgba(7, 11, 20, 0.94) 0%, rgba(7, 11, 20, 0.35) 60%, transparent 100%)';
    scrimBottom = 'linear-gradient(to top, rgba(7, 11, 20, 0.96) 0%, rgba(7, 11, 20, 0.45) 60%, transparent 100%)';
  }

  return {
    dayNightProgress: clamped,
    timeOfDayLabel,
    isDay,
    isSunset,
    isNight,
    backgroundColor,
    residentialColor,
    parkColor,
    urbanGreeneryColor,
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
