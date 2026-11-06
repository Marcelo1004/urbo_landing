const { execFile } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const args = [
  '--headless=new',
  '--screenshot=d:\\URBO\\fullpage-complete.png',
  '--window-size=1440,8800',
  '--default-background-color=00000000',
  '--virtual-time-budget=3000',
  'http://localhost:3000',
];

execFile(edgePath, args, (err) => {
  if (err) console.error(err);
  else console.log('Complete page captured!');
});

