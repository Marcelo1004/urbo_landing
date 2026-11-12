import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b";
const CDP_PORT = 9229;
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

async function verifyMobile() {
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
    
    // Set iPhone 14/15/16 viewport (390 x 844, scale 2)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    console.log(`Navigating to ${TARGET_URL} ...`);
    await cdp.send('Page.navigate', { url: TARGET_URL });
    await delay(3500);

    // 1. Capture Hero on Mobile
    console.log('Capturing Hero on mobile...');
    const shotHero = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v43-mobile-hero.png'), Buffer.from(shotHero.data, 'base64'));
    console.log('Saved v43-mobile-hero.png');

    // 2. Scroll to Metrics and capture
    console.log('Scrolling to #metricas...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('metricas').scrollIntoView({ behavior: 'instant' });`
    });
    await delay(2000);
    const shotMetrics = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v43-mobile-metrics.png'), Buffer.from(shotMetrics.data, 'base64'));
    console.log('Saved v43-mobile-metrics.png');

    // 3. Scroll to Opportunity and capture
    console.log('Scrolling to #oportunidad...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('oportunidad').scrollIntoView({ behavior: 'instant' });`
    });
    await delay(2000);
    const shotOpp = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v43-mobile-opportunity.png'), Buffer.from(shotOpp.data, 'base64'));
    console.log('Saved v43-mobile-opportunity.png');

    // 4. Scroll to Contact and capture
    console.log('Scrolling to #contacto...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('contacto').scrollIntoView({ behavior: 'instant' });`
    });
    await delay(2000);
    const shotCta = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v43-mobile-finalcta.png'), Buffer.from(shotCta.data, 'base64'));
    console.log('Saved v43-mobile-finalcta.png');

    await cdp.close();
  } catch (err) {
    console.error('Mobile verification error:', err);
  } finally {
    chrome.kill();
  }
}

verifyMobile();

