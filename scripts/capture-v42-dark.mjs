import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b";
const CDP_PORT = 9226;

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

async function captureDarkRoadmapAndOpp() {
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

    await cdp.send('Page.navigate', { url: 'http://localhost:3000' });
    await delay(3000);

    // Scroll to opportunity to check "+1,6 millones"
    console.log('Capturing Opportunity...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('oportunidad').scrollIntoView({ behavior: 'instant' });`
    });
    await delay(1200);
    let shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v42-opportunity-typography.png'), Buffer.from(shot.data, 'base64'));

    // Scroll to Roadmap (Dark Mode)
    console.log('Capturing Roadmap Dark...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('roadmap').scrollIntoView({ behavior: 'instant' });`
    });
    await delay(1500);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v42-roadmap-dark.png'), Buffer.from(shot.data, 'base64'));

    // Click Projection
    console.log('Clicking projection in dark mode...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('#roadmap button')).find(b => b.textContent && b.textContent.includes('proyección'));
        if (btn) btn.click();
      `
    });
    await delay(1800);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v42-roadmap-projected-dark.png'), Buffer.from(shot.data, 'base64'));

    await cdp.close();
    console.log('Captured v42 artifacts successfully!');
  } finally {
    chrome.kill();
  }
}

captureDarkRoadmapAndOpp();

