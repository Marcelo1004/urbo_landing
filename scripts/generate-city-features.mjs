import fs from 'fs';

const stitched = JSON.parse(fs.readFileSync('scripts/stitched-route.json', 'utf8'));

// Generate Street Lamps along Av. Monseñor Rivero and Cristo Redentor
// Monseñor Rivero extends from -17.7760 to -17.7710
const streetLamps = [];
for (let lat = -17.7762; lat <= -17.7708; lat += 0.00035) {
  // East sidewalk lamp
  streetLamps.push({
    type: 'Feature',
    properties: { type: 'lamp', side: 'east' },
    geometry: { type: 'Point', coordinates: [-63.18185 + (Math.sin(lat * 1000) * 0.00005), lat] },
  });
  // West sidewalk lamp
  streetLamps.push({
    type: 'Feature',
    properties: { type: 'lamp', side: 'west' },
    geometry: { type: 'Point', coordinates: [-63.18245 + (Math.sin(lat * 1000) * 0.00005), lat] },
  });
}
// Cristo Redentor roundabout lamps (circular ring)
const crCenter = [-63.18250, -17.77055];
for (let a = 0; a < 360; a += 30) {
  const rad = (a * Math.PI) / 180;
  const lng = crCenter[0] + (Math.cos(rad) * 0.00045);
  const lat = crCenter[1] + (Math.sin(rad) * 0.00040);
  streetLamps.push({
    type: 'Feature',
    properties: { type: 'lamp', side: 'roundabout' },
    geometry: { type: 'Point', coordinates: [lng, lat] },
  });
}

// Generate Urban Greenery (Plaza 24 de Septiembre, Plaza del Estudiante, Monseñor Rivero median)
const urbanGreenery = [
  // Plaza 24 de Septiembre garden square
  {
    type: 'Feature',
    properties: { name: 'Plaza 24 de Septiembre', type: 'park' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-63.18270, -17.78350],
        [-63.18190, -17.78360],
        [-63.18175, -17.78265],
        [-63.18255, -17.78255],
        [-63.18270, -17.78350],
      ]],
    },
  },
  // Plaza del Estudiante
  {
    type: 'Feature',
    properties: { name: 'Plaza del Estudiante', type: 'park' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-63.18260, -17.77660],
        [-63.18210, -17.77670],
        [-63.18195, -17.77580],
        [-63.18245, -17.77570],
        [-63.18260, -17.77660],
      ]],
    },
  },
  // Camellón Central de Av. Monseñor Rivero (boulevard green strip)
  {
    type: 'Feature',
    properties: { name: 'Camellón Central Monseñor Rivero', type: 'median' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-63.18205, -17.77570],
        [-63.18210, -17.77480],
        [-63.18218, -17.77380],
        [-63.18228, -17.77250],
        [-63.18240, -17.77120],
      ],
    },
  },
  // Monumento Cristo Redentor inner garden circle
  {
    type: 'Feature',
    properties: { name: 'Jardín Cristo Redentor', type: 'roundabout_garden' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        Array.from({ length: 16 }).map((_, i) => {
          const a = (i * 2 * Math.PI) / 15;
          return [
            crCenter[0] + Math.cos(a) * 0.00025,
            crCenter[1] + Math.sin(a) * 0.00022,
          ];
        }),
      ],
    },
  },
];

// Generate Stylized Pedestrians in pedestrian zones (Plaza 24 de Septiembre, Plaza del Estudiante, Monseñor Rivero sidewalks)
const pedestrians = [
  // Plaza 24 de Septiembre
  { id: 'ped-1', base: [-63.18230, -17.78310], radius: 0.00018, speed: 1.2 },
  { id: 'ped-2', base: [-63.18215, -17.78290], radius: 0.00022, speed: 0.9 },
  { id: 'ped-3', base: [-63.18245, -17.78330], radius: 0.00015, speed: 1.5 },
  // Plaza del Estudiante
  { id: 'ped-4', base: [-63.18235, -17.77620], radius: 0.00020, speed: 1.1 },
  { id: 'ped-5', base: [-63.18218, -17.77605], radius: 0.00017, speed: 1.4 },
  // Sidewalks of Monseñor Rivero
  { id: 'ped-6', base: [-63.18190, -17.77450], radius: 0.00012, speed: 1.0 },
  { id: 'ped-7', base: [-63.18240, -17.77350], radius: 0.00014, speed: 0.8 },
  { id: 'ped-8', base: [-63.18195, -17.77250], radius: 0.00011, speed: 1.3 },
  { id: 'ped-9', base: [-63.18245, -17.77180], radius: 0.00013, speed: 0.95 },
];

fs.writeFileSync(
  'scripts/city-features.json',
  JSON.stringify(
    {
      streetLamps: { type: 'FeatureCollection', features: streetLamps },
      urbanGreenery: { type: 'FeatureCollection', features: urbanGreenery },
      pedestrians,
    },
    null,
    2
  )
);

console.log(`Generated ${streetLamps.length} street lamps, ${urbanGreenery.length} green spaces, and ${pedestrians.length} pedestrians.`);
