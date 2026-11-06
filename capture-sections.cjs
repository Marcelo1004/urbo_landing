const { execFile } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const sections = [
  { name: 'section-opportunity.png', target: 'oportunidad' },
  { name: 'section-solution.png', target: 'solucion' },
  { name: 'section-metrics.png', target: 'piloto' },
  { name: 'section-community.png', target: 'comunidad' },
  { name: 'section-audiences.png', target: 'audiencias' },
  { name: 'section-roadmap.png', target: 'roadmap' },
  { name: 'section-cta.png', target: 'contacto' },
];

async function captureAll() {
  for (const s of sections) {
    await new Promise((resolve) => {
      const args = [
        '--headless=new',
        `--screenshot=d:\\URBO\\${s.name}`,
        '--window-size=1440,950',
        '--default-background-color=00000000',
        '--virtual-time-budget=3000',
        `http://localhost:3000/?scroll=${s.target}`,
      ];
      execFile(edgePath, args, (err) => {
        if (err) console.error(`Error capturing ${s.name}:`, err);
        else console.log(`Captured ${s.name}`);
        resolve();
      });
    });
  }
}

captureAll().then(() => console.log('All sections captured.'));
