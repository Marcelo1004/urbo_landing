import https from 'https';
import fs from 'fs';
import path from 'path';

function postOverpass(query) {
  return new Promise((resolve, reject) => {
    const postData = 'data=' + encodeURIComponent(query);
    const req = https.request('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'URBO-Street-Router/1.0',
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse Overpass response: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- FETCHING REAL OSM STREET GEOMETRY FOR SANTA CRUZ CORRIDOR ---');

  // Query contiguous street ways:
  // 1. Calle 24 de Septiembre (between lat -17.7845 and -17.7765)
  // 2. Av. Monseñor Rivero (between lat -17.7766 and -17.7705)
  // 3. Rotonda Cristo Redentor (Segundo Anillo roundabout)
  // 4. Av. Cristo Redentor heading north from Segundo Anillo to Cuarto Anillo (lat -17.7705 to -17.7490)
  const query = `
    [out:json][timeout:30];
    (
      way["highway"]["name"="Calle 24 de Septiembre"](-17.785,-63.183,-17.776,-63.180);
      way["highway"]["name"="Avenida Monseñor Rivero"](-17.777,-63.184,-17.770,-63.180);
      way["highway"]["junction"="roundabout"](-17.772,-63.184,-17.769,-63.181);
      way["highway"]["name"="Avenida Cristo Redentor"](-17.771,-63.184,-17.748,-63.173);
    );
    out body geom;
  `;

  const result = await postOverpass(query);
  console.log(`Received ${result.elements.length} elements from Overpass.`);

  const ways = result.elements.filter((e) => e.type === 'way');
  console.log(`Total ways: ${ways.length}`);

  ways.forEach((w) => {
    const name = w.tags.name || (w.tags.junction === 'roundabout' ? 'Rotonda Cristo Redentor' : 'unnamed');
    const firstPt = w.geometry[0];
    const lastPt = w.geometry[w.geometry.length - 1];
    console.log(
      `Way ${w.id}: "${name}" (${w.geometry.length} pts, one-way: ${w.tags.oneway || 'no'}) | start: [${firstPt.lon}, ${firstPt.lat}] -> end: [${lastPt.lon}, ${lastPt.lat}]`
    );
  });

  fs.writeFileSync('scripts/osm-ways-raw.json', JSON.stringify(ways, null, 2));
  console.log('Saved raw ways to scripts/osm-ways-raw.json');
}

run().catch(console.error);
