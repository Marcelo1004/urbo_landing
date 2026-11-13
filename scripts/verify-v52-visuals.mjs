import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b";
const CDP_PORT = 9260;
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

async function verifyV52() {
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

    // 1. Desktop Viewport (1440x900)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    console.log('Navigating to target...');
    await cdp.send('Page.navigate', { url: TARGET_URL });
    await delay(350);
    
    // Wait for preloader curtain to finish and exit
    console.log('Waiting for preloader to exit...');
    await cdp.send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
          const preloader = document.querySelector('[aria-label="Cargando URBO"]');
          if (!preloader && Date.now() - start > 500) {
            resolve(true);
          } else if (Date.now() - start > 4500) {
            resolve(true);
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      })`
    });

    // Allow Hero entrance timeline to settle completely
    await delay(1200);
    const shotHero = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v52-hero-fluid.png'), Buffer.from(shotHero.data, 'base64'));
    console.log('Saved v52-hero-fluid.png');

    // Scroll to Roadmap to trigger lazy map and capture
    console.log('Scrolling to #roadmap...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('roadmap').scrollIntoView({ behavior: 'instant' });`
    });
    await delay(1500);
    const shotRoadmap = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v52-roadmap-deferred.png'), Buffer.from(shotRoadmap.data, 'base64'));
    console.log('Saved v52-roadmap-deferred.png');

    // 2. Mobile Viewport (iPhone 14: 390x844)
    console.log('Switching to iPhone viewport (390x844)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('oportunidad').scrollIntoView({ behavior: 'instant' });`
    });
    await delay(1000);
    const shotMobile = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v52-mobile-performance.png'), Buffer.from(shotMobile.data, 'base64'));
    console.log('Saved v52-mobile-performance.png');

    await cdp.close();
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    chrome.kill();
  }
}

verifyV52();
