const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=d:\\URBO\\.tmp_edge_profile5',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  'http://localhost:3000',
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    console.log('Page tab:', pageTab?.id, pageTab?.url);

    if (pageTab && pageTab.webSocketDebuggerUrl) {
      const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Page.navigate',
          params: { url: 'http://localhost:3000/' }
        }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          // Wait 3 seconds for load
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: {
                expression: `({
                  title: document.title,
                  headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.slice(0, 30)),
                  maplibreCanvas: !!document.querySelector('.maplibregl-canvas'),
                  maplibreCanvasSize: document.querySelector('.maplibregl-canvas') ? {
                    width: document.querySelector('.maplibregl-canvas').width,
                    height: document.querySelector('.maplibregl-canvas').height,
                  } : null,
                  markers: document.querySelectorAll('.landmark-marker, [class*="bus-marker"]').length,
                  testTube: !!document.querySelector('.test-tube-liquid'),
                  businessCard: !!document.querySelector('.business-card-flipper')
                })`,
                returnByValue: true
              }
            }));
          }, 3500);
        } else if (msg.id === 2) {
          console.log('PAGE EVALUATION RESULT:', JSON.stringify(msg.result?.result?.value, null, 2));
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
}, 2000);
