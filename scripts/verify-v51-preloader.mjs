import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b";
const CDP_PORT = 9240;
const TARGET_URL = 'http://localhost:4173';

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

async function verifyV51() {
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

    // 1. Capture Liquid Glass Preloader on Desktop (1440x900)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    console.log(`Navigating to ${TARGET_URL} to capture active Liquid Glass Preloader...`);
    cdp.send('Page.navigate', { url: TARGET_URL });
    
    // Capture at ~1150ms while Liquid Glass progress is in mid-late phase (~55%-80%)
    await delay(1150);
    const shotPreloader = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v51-preloader-liquid-glass.png'), Buffer.from(shotPreloader.data, 'base64'));
    console.log('Saved v51-preloader-liquid-glass.png');

    // Wait until preloader curtain is lifting and hero is revealing (~1.8s)
    await delay(1100);
    const shotHandshake = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v51-preloader-reveal-handshake.png'), Buffer.from(shotHandshake.data, 'base64'));
    console.log('Saved v51-preloader-reveal-handshake.png');

    // Wait until preloader is completely gone from DOM and Hero timeline finishes
    console.log('Waiting for preloader to completely finish...');
    await cdp.send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
          const preloader = document.querySelector('[aria-label="Cargando URBO"]');
          if (!preloader || Date.now() - start > 4500) {
            resolve(true);
          } else {
            setTimeout(check, 80);
          }
        };
        check();
      })`
    });

    await delay(1200);
    const shotHero = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v51-hero-synchronized.png'), Buffer.from(shotHero.data, 'base64'));
    console.log('Saved v51-hero-synchronized.png');

    // 2. Mobile Viewport (iPhone 14 / 15: 390 x 844)
    console.log('Testing Mobile Viewport (390x844)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    cdp.send('Page.navigate', { url: TARGET_URL });
    await delay(600);
    const shotMobilePreloader = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v51-mobile-preloader.png'), Buffer.from(shotMobilePreloader.data, 'base64'));
    console.log('Saved v51-mobile-preloader.png');

    // Wait for mobile hero to reveal
    await cdp.send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
          const preloader = document.querySelector('[aria-label="Cargando URBO"]');
          if (!preloader || Date.now() - start > 4500) {
            resolve(true);
          } else {
            setTimeout(check, 80);
          }
        };
        check();
      })`
    });

    await delay(1200);
    const shotMobileHero = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v51-mobile-hero.png'), Buffer.from(shotMobileHero.data, 'base64'));
    console.log('Saved v51-mobile-hero.png');

    await cdp.close();
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    chrome.kill();
  }
}

verifyV51();
