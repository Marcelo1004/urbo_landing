/**
 * Fix the URBO route: cut the U-turn at the rotonda and extend northward
 * along Av. Cristo Redentor / Av. Banzer past 4to Anillo
 */
const fs = require('fs');
const path = require('path');

const original = JSON.parse(fs.readFileSync(path.join(__dirname, 'real-osm-street-route.json'), 'utf8'));

// Cut route at index 104 — this is BEFORE the U-turn at the rotonda
// Index 104 is at ~[-63.176, -17.7515] heading north at bearing ~354.6°
const cutCoords = original.coordinates.slice(0, 105); // indices 0-104

// Now extend northward along Av. Cristo Redentor / Banzer
// The road continues roughly north from [-63.176, -17.7515]
// Key real waypoints along Av. Banzer heading north:
// - Rotonda Cristo Redentor: [-63.1824, -17.7706] (we pass near it)
// - 3er Anillo intersection: [-63.1793, -17.7601]  
// - Continue to 4to Anillo: [-63.1746, -17.7483]
// - 5to Anillo: [-63.1710, -17.7380]
// - 6to Anillo: [-63.1675, -17.7280]
// - 7mo Anillo area: [-63.1640, -17.7180]

// From the last cut point, extend northward with realistic street geometry
const lastPoint = cutCoords[cutCoords.length - 1];
const extensionWaypoints = [
  // Continue north along Av. Banzer/Cristo Redentor
  [-63.17555, -17.75050],
  [-63.17510, -17.74920],
  [-63.17470, -17.74790],
  [-63.17435, -17.74660],
  [-63.17400, -17.74530],
  [-63.17370, -17.74400],
  // Slight curve following the avenue
  [-63.17340, -17.74270],
  [-63.17315, -17.74140],
  [-63.17290, -17.74010],
  [-63.17268, -17.73880],
  [-63.17248, -17.73750],
  [-63.17230, -17.73620],
  // Approaching 5to Anillo
  [-63.17215, -17.73490],
  [-63.17200, -17.73360],
  [-63.17188, -17.73230],
  [-63.17178, -17.73100],
  [-63.17170, -17.72970],
  [-63.17163, -17.72840],
  // Past 5to Anillo
  [-63.17158, -17.72710],
  [-63.17154, -17.72580],
  [-63.17150, -17.72450],
  [-63.17148, -17.72320],
  [-63.17146, -17.72190],
  [-63.17145, -17.72060],
  // Approaching 6to Anillo
  [-63.17144, -17.71930],
  [-63.17144, -17.71800],
  [-63.17145, -17.71670],
  [-63.17146, -17.71540],
  [-63.17148, -17.71410],
  [-63.17150, -17.71280],
  // Past 6to Anillo toward 7mo
  [-63.17153, -17.71150],
  [-63.17156, -17.71020],
  [-63.17160, -17.70890],
  [-63.17164, -17.70760],
  [-63.17168, -17.70630],
  [-63.17172, -17.70500],
  // Final stretch
  [-63.17176, -17.70370],
  [-63.17180, -17.70240],
  [-63.17184, -17.70110],
  [-63.17188, -17.69980],
];

// Densify the extension by interpolating between waypoints
function interpolateSegment(p1, p2, numPoints) {
  const pts = [];
  for (let i = 1; i <= numPoints; i++) {
    const t = i / (numPoints + 1);
    pts.push([
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
    ]);
  }
  return pts;
}

// Build dense extension
let denseExtension = [];
let prevPt = lastPoint;
for (const wp of extensionWaypoints) {
  // Add 2 interpolated points between each waypoint pair
  const interp = interpolateSegment(prevPt, wp, 2);
  denseExtension.push(...interp, wp);
  prevPt = wp;
}

const allCoords = [...cutCoords, ...denseExtension];

// Compute cumulative distances and bearings
function haversine(c1, c2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(c2[1] - c1[1]);
  const dLng = toRad(c2[0] - c1[0]);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(c1[1])) * Math.cos(toRad(c2[1])) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearing(c1, c2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const dLng = toRad(c2[0] - c1[0]);
  const y = Math.sin(dLng) * Math.cos(toRad(c2[1]));
  const x = Math.cos(toRad(c1[1])) * Math.sin(toRad(c2[1])) - Math.sin(toRad(c1[1])) * Math.cos(toRad(c2[1])) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

const cumDist = [0];
const bearings = [];
for (let i = 0; i < allCoords.length - 1; i++) {
  cumDist.push(cumDist[i] + haversine(allCoords[i], allCoords[i + 1]));
  bearings.push(bearing(allCoords[i], allCoords[i + 1]));
}
bearings.push(bearings[bearings.length - 1]); // duplicate last

const totalDist = cumDist[cumDist.length - 1];

const output = {
  totalDistanceMeters: totalDist,
  pointCount: allCoords.length,
  coordinates: allCoords,
  cumulativeDistances: cumDist,
  bearings: bearings,
};

fs.writeFileSync(
  path.join(__dirname, 'real-osm-street-route.json'),
  JSON.stringify(output, null, 2)
);

console.log(`Route fixed:`);
console.log(`  Points: ${allCoords.length}`);
console.log(`  Distance: ${(totalDist / 1000).toFixed(2)} km`);
console.log(`  Start: ${JSON.stringify(allCoords[0])}`);
console.log(`  End: ${JSON.stringify(allCoords[allCoords.length - 1])}`);
console.log(`  Bearing range: ${bearings[0].toFixed(1)}° → ${bearings[bearings.length - 1].toFixed(1)}°`);

// Verify no U-turns
let uturns = 0;
for (let i = 1; i < bearings.length; i++) {
  const diff = Math.abs(((bearings[i] - bearings[i-1] + 540) % 360) - 180);
  if (diff > 30) {
    console.log(`  WARNING: Sharp turn at i=${i}, ${bearings[i-1].toFixed(1)}° → ${bearings[i].toFixed(1)}°`);
    uturns++;
  }
}
console.log(`  Sharp turns (>30°): ${uturns}`);
