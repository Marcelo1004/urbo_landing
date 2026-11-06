const { execFile } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function capture(url, outputFile, width, height, delay = 4000) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      `--screenshot=${outputFile}`,
      `--window-size=${width},${height}`,
      '--default-background-color=00000000',
      `--virtual-time-budget=${delay}`,
      url,
    ];

    execFile(edgePath, args, (err) => {
      if (err) reject(err);
      else {
        console.log(`Saved ${outputFile}`);
        resolve();
      }
    });
  });
}

async function run() {
  await capture('http://localhost:3000/#solucion', 'd:\\URBO\\v3-solution.png', 1440, 950, 4000);
  await capture('http://localhost:3000/#comunidad', 'd:\\URBO\\v3-community.png', 1440, 950, 4000);
  await capture('http://localhost:3000/#roadmap', 'd:\\URBO\\v3-roadmap.png', 1440, 1050, 4000);
  await capture('http://localhost:3000/#contacto', 'd:\\URBO\\v3-business-card.png', 1440, 950, 4000);
  console.log('All sections captured!');
}

run();

