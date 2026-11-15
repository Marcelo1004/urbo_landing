/**
 * URBO 3D Real Street Coordinates
 * Santa Cruz de la Sierra:
 * 1. Catedral Metropolitana (Plaza 24 de Septiembre): [-63.18208, -17.78345]
 * 2. Calle 24 de Septiembre heading north to Primer Anillo: [-63.18185, -17.77735]
 * 3. Cruce Primer Anillo (Av. Cañoto / Av. Irala) -> Inicio Av. Monseñor Rivero: [-63.18180, -17.77660]
 * 4. Av. Monseñor Rivero (Boulevard gastronómico): [-63.18205, -17.77380]
 * 5. Rotonda Segundo Anillo (Monumento Cristo Redentor): [-63.18250, -17.77055]
 * 6. Av. Cristo Redentor / Banzer (Corredor Norte continuo): [-63.18270, -17.76450]
 */

export interface NavWaypoint {
  coords: [number, number]; // [lng, lat]
  bearing: number;          // Camera bearing (compass degrees)
  pitch: number;            // 3D tilt angle (45 - 65 deg)
  zoom: number;             // Perspective altitude
  label?: string;
  chapter?: number;
}

export const SANTA_CRUZ_NAV_ROUTE: [number, number][] = [
  // 1. Frente a la Catedral (Calle Bolívar / 24 de Septiembre)
  [-63.18208, -17.78345],
  [-63.18204, -17.78280],
  [-63.18198, -17.78205],
  // 2. Borde este de Plaza 24 de Septiembre (Calle 24 de Septiembre)
  [-63.18192, -17.78120],
  [-63.18188, -17.78010],
  [-63.18185, -17.77880],
  [-63.18182, -17.77735],
  // 3. Cruce del Primer Anillo (Av. Cañoto / Av. Argomosa) -> Av. Monseñor Rivero
  [-63.18180, -17.77660],
  [-63.18185, -17.77580],
  [-63.18195, -17.77480],
  [-63.18205, -17.77380],
  [-63.18220, -17.77250],
  [-63.18235, -17.77140],
  // 4. Rotonda del Cristo Redentor (Intersección Segundo Anillo / Av. Cristóbal de Mendoza)
  [-63.18250, -17.77055],
  [-63.18255, -17.76980],
  // 5. Corredor Norte hacia Tercer Anillo (Av. Cristo Redentor / Banzer)
  [-63.18260, -17.76850],
  [-63.18265, -17.76680],
  [-63.18270, -17.76450],
];

export const NAV_ROUTE_GEOJSON: GeoJSON.Feature<GeoJSON.LineString> = {
  type: 'Feature',
  properties: {
    name: 'Corredor Troncal URBO · Catedral a Cristo Redentor',
  },
  geometry: {
    type: 'LineString',
    coordinates: SANTA_CRUZ_NAV_ROUTE,
  },
};

export const CATEDRAL_COORDS: [number, number] = [-63.18208, -17.78345];
export const CRISTO_COORDS: [number, number] = [-63.18250, -17.77055];

/**
 * Interpolates [lng, lat], camera look-ahead center, bearing, pitch, and zoom smoothly along the route
 */
export function getNavStateAtProgress(progress: number): {
  beacon: [number, number]; // True GPS coordinate of the micro/beacon
  center: [number, number]; // Look-ahead camera focus point (Google Maps navigation perspective)
  bearing: number;
  pitch: number;
  zoom: number;
  chapter: number;
} {
  const coords = SANTA_CRUZ_NAV_ROUTE;
  const total = coords.length - 1;
  const clamped = Math.max(0, Math.min(1, progress));
  const p = clamped * total;
  const idx = Math.min(Math.floor(p), total - 1);
  const frac = p - idx;

  const c1 = coords[idx];
  const c2 = coords[idx + 1];

  const currentLng = c1[0] + (c2[0] - c1[0]) * frac;
  const currentLat = c1[1] + (c2[1] - c1[1]) * frac;

  // Calculate forward street angle (bearing)
  const dLng = c2[0] - c1[0];
  const dLat = c2[1] - c1[1];
  let streetBearing = (Math.atan2(dLng, dLat) * 180) / Math.PI;

  // Camera sits behind and tracks along the route heading north
  // Subtle, cinematic heading drift aligned with the avenue
  let targetBearing = -6 + (clamped * 10);

  // Dynamic pitch and zoom:
  // Starts with an immersive 60° tilt at Catedral, dips to 64° along Monseñor Rivero,
  // relaxes to 58° at Cristo Redentor for monument visibility, and 52° for corridor overview
  let pitch = 60;
  let zoom = 16.6;
  let chapter = 0;
  let forwardLookAhead = 0.0016; // Shifts camera look-ahead north so the GPS beacon sits in lower 30% (Google Maps style)

  if (clamped < 0.25) {
    chapter = 0; // Catedral & Plaza 24
    pitch = 60 + clamped * 8;
    zoom = 16.7 - clamped * 0.6;
    forwardLookAhead = 0.0014;
  } else if (clamped < 0.55) {
    chapter = 1; // Av. Monseñor Rivero
    pitch = 63;
    zoom = 16.4;
    forwardLookAhead = 0.0018;
  } else if (clamped < 0.80) {
    chapter = 2; // Cristo Redentor
    pitch = 58;
    zoom = 16.2;
    forwardLookAhead = 0.0016;
  } else {
    chapter = 3; // Corredor Norte
    pitch = 52;
    zoom = 15.6;
    forwardLookAhead = 0.0020;
  }

  return {
    beacon: [currentLng, currentLat],
    center: [currentLng, currentLat + forwardLookAhead],
    bearing: targetBearing,
    pitch,
    zoom,
    chapter,
  };
}
