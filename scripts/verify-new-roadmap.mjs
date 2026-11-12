import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b";
const CDP_PORT = 9228;

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) {
          reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        } else {
          resolve(msg.result);
        }
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function verifyNewMapRoadmap() {
  const chrome = child_process.spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + CDP_PORT,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await delay(2000);

  try {
    const targets = await httpGet(`http://127.0.0.1:${CDP_PORT}/json`);
    const page = targets.find(t => t.type === 'page');
    const cdp = new CDPClient(page.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    console.log('Navigating to http://localhost:3000 ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000' });
    await delay(3500);

    // 1. Scroll to the new cartographic roadmap
    console.log('Scrolling to #roadmap ...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('roadmap').scrollIntoView({ behavior: 'instant' });`
    });
    // Wait for MapLibre map tiles & vector layers to render
    await delay(3000);

    let shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v43-roadmap-cartography-dark.png'), Buffer.from(shot.data, 'base64'));
    console.log('Captured v43-roadmap-cartography-dark.png');

    // 2. Click "¿Cuál es nuestra proyección?" to test vehicle transit animation
    console.log('Clicking projection button...');
    const clickRes = await cdp.send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('#roadmap button')).find(b => b.textContent && b.textContent.includes('proyección'));
        if (btn) {
          btn.click();
          'clicked';
        } else {
          'not found';
        }
      `
    });
    console.log('Projection click result:', clickRes.result.value);

    // Wait 2.5s for GSAP to animate bus from Phase 3 to Phase 5
    await delay(2500);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v43-roadmap-projected-dark.png'), Buffer.from(shot.data, 'base64'));
    console.log('Captured v43-roadmap-projected-dark.png');

    // 3. Click "Volver al estado actual"
    console.log('Clicking restore button...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('#roadmap button')).find(b => b.textContent && b.textContent.includes('Volver'));
        if (btn) btn.click();
      `
    });
    await delay(2000);

    // 4. Test Light Mode
    console.log('Testing Light Mode in Roadmap...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[aria-label="Cambiar a modo claro"]') || document.querySelector('button[aria-label="Cambiar a modo oscuro"]');
        if (btn) btn.click();
      `
    });
    await delay(1500);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v43-roadmap-light.png'), Buffer.from(shot.data, 'base64'));
    console.log('Captured v43-roadmap-light.png');

    // 5. Test Mobile Viewport (390 x 844)
    console.log('Testing Mobile Viewport in Roadmap...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await delay(1500);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v43-roadmap-mobile.png'), Buffer.from(shot.data, 'base64'));
    console.log('Captured v43-roadmap-mobile.png');

    await cdp.close();
    console.log('Verification finished successfully!');
  } finally {
    chrome.kill();
  }
}

verifyNewMapRoadmap();

