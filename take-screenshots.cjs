const { execFile } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const targets = [
  { name: 'screenshot-1440.png', width: 1440, height: 900 },
  { name: 'screenshot-768.png', width: 768, height: 1024 },
  { name: 'screenshot-375.png', width: 375, height: 812 },
];

async function capture() {
  for (const t of targets) {
    await new Promise((resolve) => {
      const args = [
        '--headless=new',
        `--screenshot=d:\\URBO\\${t.name}`,
        `--window-size=${t.width},${t.height}`,
        '--default-background-color=00000000',
        '--virtual-time-budget=2000',
        'http://localhost:3000',
      ];
      execFile(edgePath, args, (err) => {
        if (err) console.error(`Error capturing ${t.name}:`, err);
        else console.log(`Captured ${t.name}`);
        resolve();
      });
    });
  }
}

capture().then(() => console.log('All screenshots captured successfully.'));
