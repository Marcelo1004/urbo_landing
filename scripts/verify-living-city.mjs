import http from 'http';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const TARGET_URL = 'http://localhost:4173';
const CDP_PORT = 9296;
const ARTIFACT_DIR = 'C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
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
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map((a) => a.value || JSON.stringify(a)).join(' ');
        if (!text.includes('sprite')) {
          console.log(`[Browser Console]:`, text);
        }
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params.exceptionDetails;
        console.error(`[Browser Exception]:`, d.text, d.exception?.description || d.exception?.value || JSON.stringify(d));
      }
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
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

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval failed: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  }

  async captureScreenshot(filepath, clip = null) {
    const params = { format: 'png', quality: 95 };
    if (clip) params.clip = clip;
    const res = await this.send('Page.captureScreenshot', params);
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log(`[Screenshot saved]: ${filepath}`);
  }

  async close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('=== URBO — LIVING CITY EXPERIENCE COMPREHENSIVE QA AUDIT ===');

  let previewProcess = null;
  let isListening = false;
  try {
    await httpGet(TARGET_URL);
    isListening = true;
    console.log('[Preview] Already listening on port 4173');
  } catch (e) {
    console.log('[Preview] Starting vite preview on port 4173...');
    previewProcess = child_process.spawn('npx.cmd', ['vite', 'preview', '--port', '4173', '--host'], {
      cwd: 'd:\\URBO',
      stdio: 'pipe',
      shell: true,
    });
  }

  let attempts = 0;
  while (!isListening && attempts < 25) {
    await delay(400);
    attempts++;
    try {
      await httpGet(TARGET_URL);
      isListening = true;
      console.log(`[Preview] Responding on port 4173 (attempt ${attempts})`);
    } catch (e) {}
  }

  if (!isListening) throw new Error('Preview server failed to start on port 4173');

  console.log('[Chrome] Launching Headless Chrome on CDP port', CDP_PORT);
  const chromeProcess = child_process.spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    '--disable-web-security',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    '--user-data-dir=' + path.join(process.env.TEMP, 'chrome-profile-living-city'),
  ]);

  await delay(1800);

  let cdp;
  try {
    const targets = await httpGet(`http://127.0.0.1:${CDP_PORT}/json`);
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    console.log('[CDP] Connected via WebSocket');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    console.log('\nNavigating to', TARGET_URL);
    await cdp.send('Page.navigate', { url: TARGET_URL });

    console.log('Waiting for map tiles, 3D buildings, and city features to render...');
    await delay(3500);

    const runwayHeight = await cdp.evaluate(`document.getElementById('inicio')?.offsetHeight || 4000`);
    console.log(`[Runway Height]: ${runwayHeight}px`);

    // 1. CAPTURE 1: Stage 0% (Día 14:30) - Catedral Metropolitana & Plaza 24
    console.log('\n--- Capture 1: Stage 0% Día (Catedral Metropolitana) ---');
    await cdp.evaluate(`window.scrollTo(0, 0);`);
    await delay(1500);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'living-01-catedral-day.png'));

    // 2. CAPTURE 2: Stage 25% (Tarde 17:15) - Plaza del Estudiante & Golden Hour
    console.log('\n--- Capture 2: Stage 25% Tarde (Plaza del Estudiante) ---');
    const scroll25 = Math.round(runwayHeight * 0.25);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll25}, behavior: 'instant' });`);
    await delay(1500);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'living-02-estudiante-afternoon.png'));

    // 3. CAPTURE 3: Stage 50% (Atardecer 18:45) - Monumento Cristo Redentor & Street Lamps
    console.log('\n--- Capture 3: Stage 50% Atardecer (Cristo Redentor & Farolas) ---');
    const scroll50 = Math.round(runwayHeight * 0.50);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll50}, behavior: 'instant' });`);
    await delay(1500);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'living-03-cristo-sunset.png'));

    // 4. CAPTURE 4: Stage 75% (Noche 20:30) - Corredor Norte & Evidencia del Piloto
    console.log('\n--- Capture 4: Stage 75% Noche (Corredor Norte / 3er Anillo) ---');
    const scroll75 = Math.round(runwayHeight * 0.75);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll75}, behavior: 'instant' });`);
    await delay(1500);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'living-04-corredor-night.png'));

    // 5. CAPTURE 5: Stage 95% (Noche Profunda) - Visión de Escala URBO (4to Anillo)
    console.log('\n--- Capture 5: Stage 95% Visión de URBO (Viaducto Cuarto Anillo) ---');
    const scroll95 = Math.round(runwayHeight * 0.95);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll95}, behavior: 'instant' });`);
    await delay(1500);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'living-05-vision-cuartoanillo.png'));

    // 6. CAPTURE 6: Instagram Live Connect Section
    console.log('\n--- Capture 6: Instagram Live Connect Section (@urbo.corp) ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('instagram');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(1200);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'living-06-instagram-live.png'));

    // 7. CAPTURE 7: Holographic Interface Emerge
    console.log('\n--- Capture 7: Star Wars Holographic Contact Interface Emerge ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('contacto');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(1000);
    // Click "Contáctanos" button
    await cdp.evaluate(`
      (() => {
        const btns = Array.from(document.querySelectorAll('#contacto button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('Contáctanos'));
        if (btn) btn.click();
      })()
    `);
    await delay(1600);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'living-07-hologram-emerged.png'));

    // 8. CAPTURE 8: Mobile 390px Viewport Verification
    console.log('\n--- Capture 8: Mobile 390px Viewport Verification ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.evaluate(`window.scrollTo({ top: 0, behavior: 'instant' });`);
    await delay(1500);
    const mobileMetrics = await cdp.evaluate(`
      (() => {
        return {
          viewportWidth: window.innerWidth,
          bodyScrollWidth: document.body.scrollWidth,
          hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth
        };
      })()
    `);
    console.log('[Mobile 390px Metrics]:', mobileMetrics);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'living-08-mobile-390.png'));

    console.log('\n=== ALL 8 LIVING CITY EXPERIENCE AUDITS COMPLETED WITH SUCCESS! ===');
  } catch (err) {
    console.error('Test Execution Failed:', err);
    process.exitCode = 1;
  } finally {
    if (cdp) await cdp.close();
    if (chromeProcess) chromeProcess.kill('SIGKILL');
    if (previewProcess) previewProcess.kill('SIGKILL');
  }
}

run();
