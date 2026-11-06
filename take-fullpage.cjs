const { execFile } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const args = [
  '--headless=new',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--screenshot=d:\\URBO\\v3.1-fullpage-complete.png',
  '--window-size=1440,10800',
  '--default-background-color=00000000',
  '--virtual-time-budget=6000',
  'http://localhost:3000',
];

execFile(edgePath, args, (err) => {
  if (err) console.error(err);
  else console.log('V3 complete page captured successfully!');
});
