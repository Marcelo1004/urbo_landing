const { spawn } = require('child_process');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=d:\\URBO\\.tmp_edge_card',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--window-size=1440,1050',
  'http://localhost:3000',
]);

function send(ws, id, method, params = {}) {
  return new Promise((resolve) => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    ws.onopen = async () => {
      let msgId = 1;
      await send(ws, msgId++, 'Page.enable');
      await send(ws, msgId++, 'Runtime.enable');

      await send(ws, msgId++, 'Page.navigate', { url: 'http://localhost:3000/#contacto' });
      await delay(2500);

      // Scroll perfectly so card is centered in viewport
      await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `(() => {
          const card = document.querySelector('.perspective-1200');
          card?.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()`,
      });
      await delay(1000);

      // Front
      const front = await send(ws, msgId++, 'Page.captureScreenshot');
      fs.writeFileSync('d:\\URBO\\v3.1-card-front-perfect.png', Buffer.from(front.data, 'base64'));

      // Click "Girar tarjeta"
      await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Girar'));
          btn?.click();
        })()`,
      });
      await delay(1200);

      // Back
      const back = await send(ws, msgId++, 'Page.captureScreenshot');
      fs.writeFileSync('d:\\URBO\\v3.1-card-back-perfect.png', Buffer.from(back.data, 'base64'));

      console.log('Saved card front and back perfect!');
      ws.close();
      proc.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    proc.kill();
    process.exit(1);
  }
}, 2500);

