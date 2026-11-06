const { spawn } = require('child_process');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=d:\\URBO\\.tmp_edge_v31_b',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--window-size=1440,960',
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

    if (!pageTab || !pageTab.webSocketDebuggerUrl) {
      console.error('No page tab found');
      proc.kill();
      process.exit(1);
    }

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    ws.onopen = async () => {
      console.log('Connected to CDP');
      let msgId = 1;

      await send(ws, msgId++, 'Page.enable');
      await send(ws, msgId++, 'Runtime.enable');
      await send(ws, msgId++, 'DOM.enable');

      await send(ws, msgId++, 'Page.navigate', { url: 'http://localhost:3000/' });
      await delay(3500);

      // 1. Capture Hero
      const hero = await send(ws, msgId++, 'Page.captureScreenshot');
      fs.writeFileSync('d:\\URBO\\v3.1-hero-map.png', Buffer.from(hero.data, 'base64'));
      console.log('Saved v3.1-hero-map.png');

      // 2. Scroll to Roadmap
      await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `document.getElementById('roadmap')?.scrollIntoView({ behavior: 'instant', block: 'center' })`,
      });
      await delay(1200);

      const roadmapReal = await send(ws, msgId++, 'Page.captureScreenshot');
      fs.writeFileSync('d:\\URBO\\v3.1-roadmap-real.png', Buffer.from(roadmapReal.data, 'base64'));
      console.log('Saved v3.1-roadmap-real.png');

      // Click "¿Cuál es nuestra proyección?"
      await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('proyección'));
          btn?.click();
        })()`,
      });
      await delay(2500); // wait for projection GSAP animation

      const roadmapProj = await send(ws, msgId++, 'Page.captureScreenshot');
      fs.writeFileSync('d:\\URBO\\v3.1-roadmap-projected.png', Buffer.from(roadmapProj.data, 'base64'));
      console.log('Saved v3.1-roadmap-projected.png');

      // Reset to actual
      await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('estado actual'));
          btn?.click();
        })()`,
      });
      await delay(1000);

      // 3. Scroll to Final CTA
      await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `document.getElementById('contacto')?.scrollIntoView({ behavior: 'instant', block: 'center' })`,
      });
      await delay(1200);

      const cardFront = await send(ws, msgId++, 'Page.captureScreenshot');
      fs.writeFileSync('d:\\URBO\\v3.1-card-front.png', Buffer.from(cardFront.data, 'base64'));
      console.log('Saved v3.1-card-front.png');

      // Click "Girar tarjeta"
      await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Girar tarjeta'));
          btn?.click();
        })()`,
      });
      await delay(1500); // wait for 3D flip animation

      const cardBack = await send(ws, msgId++, 'Page.captureScreenshot');
      fs.writeFileSync('d:\\URBO\\v3.1-card-back.png', Buffer.from(cardBack.data, 'base64'));
      console.log('Saved v3.1-card-back.png');

      console.log('All targeted captures saved successfully!');
      ws.close();
      proc.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
}, 2500);
