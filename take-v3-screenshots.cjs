const { execFile } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const captures = [
  { name: 'v3-hero.png', target: '', width: 1440, height: 950 },
  { name: 'v3-opportunity.png', target: '?scroll=oportunidad', width: 1440, height: 950 },
  { name: 'v3-chat.png', target: '?scroll=comunidad', width: 1440, height: 950 },
  { name: 'v3-roadmap.png', target: '?scroll=roadmap', width: 1440, height: 950 },
  { name: 'v3-businesscard.png', target: '?scroll=contacto', width: 1440, height: 950 },
  { name: 'v3-mobile.png', target: '', width: 375, height: 812 },
];

async function run() {
  for (const c of captures) {
    await new Promise((resolve) => {
      const args = [
        '--headless=new',
        `--screenshot=d:\\URBO\\${c.name}`,
        `--window-size=${c.width},${c.height}`,
        '--default-background-color=00000000',
        '--virtual-time-budget=3500',
        `http://localhost:3000/${c.target}`,
      ];
      execFile(edgePath, args, (err) => {
        if (err) console.error(`Error ${c.name}:`, err);
        else console.log(`Captured ${c.name}`);
        resolve();
      });
    });
  }
}

run().then(() => console.log('All V3 captures complete.'));

