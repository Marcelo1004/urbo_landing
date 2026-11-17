import fs from 'fs';
import path from 'path';

// Anchor intersections along Santa Cruz de la Sierra road grid:
// Real street path covering 5 distinct zones:
// 1. Casco Viejo Colonial (Catedral -> Calle 24 de Septiembre -> Giro Este Junín)
// 2. Giro Norte por Calle Beni hacia el 1er Anillo
// 3. Curva del 1er Anillo (Av. Uruguay) hacia Plaza del Estudiante
// 4. Boulevard gastronómico Av. Monseñor Rivero
// 5. Giro en Rotonda Cristo Redentor (2do Anillo)
// 6. Desvío por 2do Anillo hacia Equipetrol
// 7. Giro Norte hacia 3er Anillo Interno
// 8. Retorno hacia el eje Banzer por 3er Anillo
// 9. Eje Metropolitano Norte hacia 4to Anillo (Viaducto) y 5to Anillo
const keyWaypoints = [
  // 1. Catedral Metropolitana (Inicio)
  [-63.18180, -17.78380],
  [-63.18178, -17.78300],
  [-63.18175, -17.78210],
  // Giro Este en Calle Junín (90° turn)
  [-63.18170, -17.78160],
  [-63.18080, -17.78165],
  [-63.17980, -17.78170],
  [-63.17880, -17.78175],
  [-63.17820, -17.78180],
  // Giro Norte en Calle Beni / Murillo (90° turn)
  [-63.17825, -17.78100],
  [-63.17835, -17.78010],
  [-63.17845, -17.77900],
  [-63.17855, -17.77780],
  [-63.17865, -17.77690],
  // Entrada y Curva del Primer Anillo (Av. Uruguay)
  [-63.17920, -17.77660],
  [-63.18000, -17.77640],
  [-63.18100, -17.77625],
  // Plaza del Estudiante
  [-63.18215, -17.77620],
  // Boulevard Monseñor Rivero (Rumbo Norte)
  [-63.18220, -17.77500],
  [-63.18225, -17.77380],
  [-63.18230, -17.77250],
  [-63.18235, -17.77150],
  // Rotonda Cristo Redentor (2do Anillo - Curva envolvente)
  [-63.18240, -17.77060],
  [-63.18290, -17.77055],
  [-63.18370, -17.77060],
  // Giro Oeste hacia Equipetrol por Av. Cristóbal de Mendoza (2do Anillo)
  [-63.18500, -17.77065],
  [-63.18650, -17.77070],
  [-63.18820, -17.77075],
  [-63.18950, -17.77080],
  // Giro Norte por Av. San Martín / Equipetrol (Curva 90° Norte)
  [-63.18940, -17.76950],
  [-63.18910, -17.76800],
  [-63.18870, -17.76650],
  [-63.18820, -17.76500],
  [-63.18760, -17.76350],
  [-63.18700, -17.76200],
  // Giro Este por 3er Anillo Externo hacia Av. Banzer
  [-63.18600, -17.76160],
  [-63.18420, -17.76120],
  [-63.18240, -17.76080],
  [-63.18080, -17.76040],
  // Enlace con Av. Banzer / Cristo Redentor (3er Anillo)
  [-63.17950, -17.76010],
  [-63.17880, -17.75800],
  [-63.17800, -17.75600],
  [-63.17720, -17.75400],
  [-63.17640, -17.75200],
  [-63.17550, -17.75000],
  // Viaducto Cuarto Anillo
  [-63.17460, -17.74820],
  // Extensión hacia Quinto Anillo (Eje Norte Metropolitano)
  [-63.17360, -17.74600],
  [-63.17260, -17.74380],
  [-63.17160, -17.74160],
  [-63.17050, -17.73940],
  [-63.16940, -17.73720],
];

// Haversine distance in meters
function haversine(c1, c2) {
  const R = 6371000;
  const dLat = ((c2[1] - c1[1]) * Math.PI) / 180;
  const dLng = ((c2[0] - c1[0]) * Math.PI) / 180;
  const lat1 = (c1[1] * Math.PI) / 180;
  const lat2 = (c2[1] * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Bearing between two coordinates
function computeBearing(c1, c2) {
  const dLng = ((c2[0] - c1[0]) * Math.PI) / 180;
  const lat1 = (c1[1] * Math.PI) / 180;
  const lat2 = (c2[1] * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// Catmull-Rom or dense linear interpolation with corner smoothing
const denseCoordinates = [];
const stepMeters = 20; // point every 20 meters

for (let i = 0; i < keyWaypoints.length - 1; i++) {
  const p1 = keyWaypoints[i];
  const p2 = keyWaypoints[i + 1];
  const segmentDist = haversine(p1, p2);
  const steps = Math.max(1, Math.round(segmentDist / stepMeters));

  for (let s = 0; s < steps; s++) {
    const frac = s / steps;
    const lng = p1[0] + (p2[0] - p1[0]) * frac;
    const lat = p1[1] + (p2[1] - p1[1]) * frac;
    denseCoordinates.push([lng, lat]);
  }
}
denseCoordinates.push(keyWaypoints[keyWaypoints.length - 1]);

// Cumulative distances and bearings
const cumulativeDistances = [0];
const bearings = [];

for (let i = 0; i < denseCoordinates.length - 1; i++) {
  const c1 = denseCoordinates[i];
  const c2 = denseCoordinates[i + 1];
  const d = haversine(c1, c2);
  cumulativeDistances.push(cumulativeDistances[cumulativeDistances.length - 1] + d);
  bearings.push(computeBearing(c1, c2));
}
bearings.push(bearings[bearings.length - 1]); // repeat last

// Smooth bearings with a window of 5 points to eliminate abrupt snapping
const smoothedBearings = bearings.map((b, idx) => {
  let sumX = 0;
  let sumY = 0;
  const window = 4;
  let count = 0;
  for (let w = -window; w <= window; w++) {
    const targetIdx = idx + w;
    if (targetIdx >= 0 && targetIdx < bearings.length) {
      const rad = (bearings[targetIdx] * Math.PI) / 180;
      sumX += Math.cos(rad);
      sumY += Math.sin(rad);
      count++;
    }
  }
  return ((Math.atan2(sumY / count, sumX / count) * 180) / Math.PI + 360) % 360;
});

const totalDistanceMeters = cumulativeDistances[cumulativeDistances.length - 1];

console.log(`Generated extended curved route:`);
console.log(`- Points: ${denseCoordinates.length}`);
console.log(`- Total Distance: ${(totalDistanceMeters / 1000).toFixed(2)} km`);

const outputData = {
  totalDistanceMeters,
  pointCount: denseCoordinates.length,
  coordinates: denseCoordinates,
  cumulativeDistances,
  bearings: smoothedBearings,
};

fs.writeFileSync(
  path.join(process.cwd(), 'scripts', 'extended-curved-route.json'),
  JSON.stringify(outputData, null, 2)
);
console.log('Saved to scripts/extended-curved-route.json successfully!');
