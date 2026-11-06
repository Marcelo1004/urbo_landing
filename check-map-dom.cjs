const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=d:\\URBO\\.tmp_edge_profile2',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  'http://localhost:3000',
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const mainTab = tabs.find(t => t.url && t.url.includes('localhost:3000'));

    if (mainTab && mainTab.webSocketDebuggerUrl) {
      const ws = new WebSocket(mainTab.webSocketDebuggerUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `({
              canvas: !!document.querySelector('.maplibregl-canvas'),
              canvasWidth: document.querySelector('.maplibregl-canvas')?.width,
              canvasHeight: document.querySelector('.maplibregl-canvas')?.height,
              landmark: !!document.querySelector('.landmark-marker'),
              bus32: !!document.querySelector('.bus-marker-32'),
              bus58: !!document.querySelector('.bus-marker-58'),
              containerWidth: document.querySelector('.maplibregl-map')?.clientWidth,
              containerHeight: document.querySelector('.maplibregl-map')?.clientHeight,
            })`,
            returnByValue: true
          }
        }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          console.log('Map DOM state:', msg.result?.result?.value);
          ws.close();
          proc.kill();
          process.exit(0);
        }
      };
    }
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
}, 3000);

