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
  // Mobile full viewport
  await capture('http://localhost:3000', 'd:\\URBO\\v3-mobile-hero.png', 375, 812, 3000);
  console.log('Mobile screenshot done');
}

run();

