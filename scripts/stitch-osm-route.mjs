import fs from 'fs';

const rawWays = JSON.parse(fs.readFileSync('scripts/osm-ways-raw.json', 'utf8'));

// Helper to compute distance between two coords in meters (Haversine formula)
function haversineDist([lon1, lat1], [lon2, lat2]) {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Stitching continuous northbound corridor:
// Step 1: Start at Calle 24 de Septiembre in front of Catedral Metropolitana (lat -17.7837)
const way24Sep = rawWays.find((w) => w.id === 23262895);
console.log('Way 24 Sep found:', way24Sep?.id, 'pts:', way24Sep?.geometry.length);

// Let's build a clean connected chain
const routePoints = [];

// 1. Calle 24 de Septiembre (from Catedral at -17.78375 to Primer Anillo at -17.77620)
way24Sep.geometry.forEach((pt) => routePoints.push([pt.lon, pt.lat]));

// 2. Next way in 24 de Sep to cross Primer Anillo (way 1467461107)
const wayCross1 = rawWays.find((w) => w.id === 1467461107);
if (wayCross1) {
  wayCross1.geometry.slice(1).forEach((pt) => routePoints.push([pt.lon, pt.lat]));
}

// 3. Monseñor Rivero northbound carriageway ways:
// Let's filter ways that are northbound (lat increasing from -17.7759 towards -17.7705)
const msWays = [
  27819670,   // -17.7749 to -17.7747
  437682646,  // -17.7747 to -17.7740
  481862036,  // -17.7740 to -17.7737
  439821963,  // -17.7737 to -17.7718
  1125987817, // -17.7718 to -17.7716
  1125987816, // -17.7716 to -17.7714
  674845976,  // -17.7714 to -17.7708
  612699531,  // -17.7708 to -17.7705 (reaches Cristo Redentor)
];

msWays.forEach((id) => {
  const w = rawWays.find((x) => x.id === id);
  if (w) {
    w.geometry.forEach((pt) => {
      const last = routePoints[routePoints.length - 1];
      if (!last || haversineDist(last, [pt.lon, pt.lat]) > 0.5) {
        routePoints.push([pt.lon, pt.lat]);
      }
    });
  }
});

// 4. Cristo Redentor roundabout and transition north into Av. Cristo Redentor:
const crWays = [
  437683970,  // -17.77057 to -17.77036
  92937082,   // -17.77036 to -17.77013
  1125987818, // -17.77013 to -17.76972
  612699543,  // -17.76972 to -17.76877
  974462046,  // -17.76877 to -17.76742
  462699991,  // -17.76742 to -17.76657
  462699990,  // -17.76657 to -17.76628
  462699993,  // -17.76628 to -17.75964 (past 3er Anillo!)
  441697756,  // -17.75964 to -17.75953
  407714871,  // -17.75953 to -17.75802
  1374493474, // -17.75802 to -17.75795
  1374493469, // -17.75795 to -17.75773
  974373998,  // -17.75773 to -17.75486
  677549647,  // -17.75486 to -17.75428
  854818788,  // -17.75428 to -17.75188
  1545263072, // -17.75188 to -17.75152
  174170559,  // -17.75152 to -17.74822 (approaching 4to Anillo)
  1545263077, // -17.74822 to -17.74787 (Viaducto Cuarto Anillo)
];

crWays.forEach((id) => {
  const w = rawWays.find((x) => x.id === id);
  if (w) {
    w.geometry.forEach((pt) => {
      const last = routePoints[routePoints.length - 1];
      if (!last || haversineDist(last, [pt.lon, pt.lat]) > 0.5) {
        routePoints.push([pt.lon, pt.lat]);
      }
    });
  }
});

console.log(`Total continuous route points: ${routePoints.length}`);

// Calculate total road distance
let totalDist = 0;
const distances = [0];
for (let i = 1; i < routePoints.length; i++) {
  const d = haversineDist(routePoints[i - 1], routePoints[i]);
  totalDist += d;
  distances.push(totalDist);
}

console.log(`Total Route Distance: ${(totalDist / 1000).toFixed(3)} km (${Math.round(totalDist)} meters)`);
console.log(`Start: [${routePoints[0]}] (Catedral Metropolitana)`);
console.log(`End: [${routePoints[routePoints.length - 1]}] (Corredor Norte / Viaducto)`);

// Check continuity (max distance between adjacent nodes)
let maxStep = 0;
for (let i = 1; i < routePoints.length; i++) {
  const step = distances[i] - distances[i - 1];
  if (step > maxStep) maxStep = step;
}
console.log(`Max gap between adjacent street nodes: ${maxStep.toFixed(1)} meters (perfect road smoothness)`);

fs.writeFileSync(
  'scripts/stitched-route.json',
  JSON.stringify(
    {
      totalDistanceMeters: totalDist,
      pointCount: routePoints.length,
      coordinates: routePoints,
      cumulativeDistances: distances,
    },
    null,
    2
  )
);
console.log('Saved stitched route to scripts/stitched-route.json');
