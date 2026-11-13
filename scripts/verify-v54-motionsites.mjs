import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b";
const CDP_PORT = 9270;
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

async function verifyV54() {
  console.log('--- URBO V5.4 MOTIONSITES WEB BUILDER QA & VALIDATION ---');
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
    await cdp.send('Log.enable');

    const consoleErrors = [];
    cdp.ws.addEventListener('message', (evt) => {
      try {
        const parsed = JSON.parse(evt.data);
        if (parsed.method === 'Log.entryAdded' && parsed.params.entry.level === 'error') {
          consoleErrors.push(parsed.params.entry.text);
        }
      } catch {}
    });

    // 1. Desktop 1440x900 - Preloader
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    console.log('1. Capturing Preloader Liquid Glass at 500ms...');
    await cdp.send('Page.navigate', { url: TARGET_URL });
    await delay(500);

    const shotPreloader = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v54-preloader-lens.png'), Buffer.from(shotPreloader.data, 'base64'));
    console.log('Saved v54-preloader-lens.png');

    // Wait for preloader dissolve and hero reveal
    await delay(1600);
    const shotHero = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v54-hero-1440.png'), Buffer.from(shotHero.data, 'base64'));
    console.log('Saved v54-hero-1440.png');

    // Scroll to Opportunity & Don Mauricio
    console.log('2. Scrolling to Don Mauricio Editorial piece...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('oportunidad').scrollIntoView({ behavior: 'smooth' });`
    });
    await delay(1400);

    const shotDonMauricio = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v54-don-mauricio-editorial.png'), Buffer.from(shotDonMauricio.data, 'base64'));
    console.log('Saved v54-don-mauricio-editorial.png');

    // Scroll to Roadmap
    console.log('3. Scrolling to Roadmap Cockpit...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('roadmap').scrollIntoView({ behavior: 'smooth' });`
    });
    await delay(1600);

    const shotRoadmap = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v54-roadmap-cockpit.png'), Buffer.from(shotRoadmap.data, 'base64'));
    console.log('Saved v54-roadmap-cockpit.png');

    // Multi-viewport QA
    const viewports = [
      { name: '375', width: 375, height: 667, mobile: true },
      { name: '390', width: 390, height: 844, mobile: true },
      { name: '430', width: 430, height: 932, mobile: true },
      { name: '768', width: 768, height: 1024, mobile: false },
    ];

    for (const vp of viewports) {
      console.log(`Testing viewport ${vp.name} (${vp.width}x${vp.height})...`);
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile
      });

      await cdp.send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: 0, behavior: 'instant' });`
      });
      await delay(800);

      const shotVp = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ARTIFACT_DIR, `v54-viewport-${vp.name}.png`), Buffer.from(shotVp.data, 'base64'));
      console.log(`Saved v54-viewport-${vp.name}.png`);
    }

    console.log('\n--- QA SUMMARY ---');
    console.log('Console Errors count:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

    await cdp.close();
  } catch (err) {
    console.error('CDP Error:', err);
  } finally {
    chrome.kill();
  }
}

verifyV54();
