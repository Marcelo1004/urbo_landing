const http = require('http');
const fs = require('fs');
const { execFile } = require('child_process');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync('d:\\URBO\\test-openfreemap.html'));
});

server.listen(4321, () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const args = [
    '--headless=new',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--screenshot=d:\\URBO\\test-ofm-render.png',
    '--window-size=1100,550',
    '--virtual-time-budget=8000',
    'http://localhost:4321/',
  ];

  execFile(edgePath, args, (err) => {
    if (err) console.error(err);
    else console.log('Saved test-ofm-render.png');
    server.close();
  });
});

