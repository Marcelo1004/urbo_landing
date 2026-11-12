import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b";
const CDP_PORT = 9222;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
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
    // Dynamically import or load standard WebSocket (available in modern Node 22+)
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

async function capture() {
  console.log('Spawning Chrome with remote debugging on port ' + CDP_PORT);
  const chromeProcess = child_process.spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + CDP_PORT,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'about:blank'
  ]);

  await delay(2000);

  try {
    const targets = await httpGet(`http://127.0.0.1:${CDP_PORT}/json`);
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error('No page target found');
    }

    const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
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
    await delay(3500); // Wait for initial load and GSAP timeline

    // Capture Hero Dark Mode
    console.log('Capturing Hero Dark...');
    let shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v4-hero-dark.png'), Buffer.from(shot.data, 'base64'));

    // Toggle Light Mode
    console.log('Toggling Light Mode...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[aria-label="Cambiar a modo claro"]') || document.querySelector('button[aria-label="Cambiar a modo oscuro"]');
        if (btn) btn.click();
      `
    });
    await delay(1000);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v4-hero-light.png'), Buffer.from(shot.data, 'base64'));

    // Toggle back to Dark Mode
    await cdp.send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[aria-label="Cambiar a modo claro"]') || document.querySelector('button[aria-label="Cambiar a modo oscuro"]');
        if (btn) btn.click();
      `
    });
    await delay(600);

    // Scroll to #solucion
    console.log('Scrolling to Solution...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('solucion')?.scrollIntoView({ behavior: 'instant' });`
    });
    await delay(1200);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v4-solution-tabs.png'), Buffer.from(shot.data, 'base64'));

    // Scroll to #roadmap (Three.js WebGL Test Tube)
    console.log('Scrolling to Roadmap Three.js...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('roadmap')?.scrollIntoView({ behavior: 'instant' });`
    });
    await delay(1500);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v4-roadmap-threejs.png'), Buffer.from(shot.data, 'base64'));

    // Click Projection Button
    console.log('Triggering Roadmap Projection (Three.js liquid animation)...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const buttons = Array.from(document.querySelectorAll('button'));
        const projBtn = buttons.find(b => b.textContent && b.textContent.includes('proyección'));
        if (projBtn) projBtn.click();
      `
    });
    await delay(2200); // Wait for GSAP fill to animate up to 100%
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v4-roadmap-projected.png'), Buffer.from(shot.data, 'base64'));

    // Scroll to Final CTA #contacto
    console.log('Scrolling to Final CTA Contact Card (State A)...');
    await cdp.send('Runtime.evaluate', {
      expression: `(document.getElementById('contacto') || document.getElementById('unirse'))?.scrollIntoView({ behavior: 'instant' });`
    });
    await delay(1500);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v4-contact-state-a.png'), Buffer.from(shot.data, 'base64'));

    // Flip/Toggle card to State B
    console.log('Toggling Contact Card to State B...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const flipBtn = document.querySelector('button[aria-label="Ver datos de contacto directo"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Ver Canales'));
        if (flipBtn) flipBtn.click();
      `
    });
    await delay(1500);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v4-contact-state-b.png'), Buffer.from(shot.data, 'base64'));

    // Mobile Viewport Check (390 x 844)
    console.log('Emulating Mobile Viewport (390x844)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await cdp.send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 0);`
    });
    await delay(1000);
    shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v4-mobile.png'), Buffer.from(shot.data, 'base64'));

    // Check Console / Runtime Errors
    const evalErrors = await cdp.send('Runtime.evaluate', {
      expression: `window.__capturedErrors || []`
    });
    console.log('Evaluated runtime errors on page:', evalErrors.result.value);

    await cdp.close();
    console.log('Verification suite finished successfully!');

  } catch (err) {
    console.error('Error during CDP testing:', err);
  } finally {
    chromeProcess.kill();
  }
}

capture();

