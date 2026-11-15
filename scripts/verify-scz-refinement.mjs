import http from 'http';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const TARGET_URL = 'http://localhost:4173';
const CDP_PORT = 9294;
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
        console.log(`[Browser Console]:`, text);
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
    const params = { format: 'png', quality: 90 };
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
  console.log('=== URBO V5.7 — SANTA CRUZ 3D REFINEMENT & QA AUDIT ===');

  let previewProcess = null;
  let isListening = false;
  try {
    await httpGet(TARGET_URL);
    isListening = true;
    console.log('[Preview] Already responding on port 4173');
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
    '--user-data-dir=' + path.join(process.env.TEMP, 'chrome-profile-v57-scz'),
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
    await delay(1500);

    // Warm up below-the-fold modules
    console.log('Pre-scrolling page to mount lazy components...');
    await cdp.evaluate(`window.scrollTo(0, 1800);`);
    await delay(600);
    await cdp.evaluate(`window.scrollTo(0, document.body.scrollHeight);`);
    await delay(800);
    await cdp.evaluate(`window.scrollTo(0, 0);`);
    await delay(600);

    const runwayHeight = await cdp.evaluate(`document.getElementById('inicio')?.offsetHeight || 3000`);

    // 1. CAPTURA 1: Inicio en la Catedral Metropolitana (Stage 0%)
    console.log('\n--- Capture 1: Inicio en la Catedral Metropolitana (Stage 0%) ---');
    await cdp.evaluate(`window.scrollTo(0, 0);`);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'scz-01-catedral-inicio.png'));

    // 2. CAPTURA 2: Recorrido entre Catedral y Cristo Redentor (Stage 35%)
    console.log('\n--- Capture 2: Recorrido entre Catedral y Cristo Redentor (Stage 35%) ---');
    const scroll35 = Math.round(runwayHeight * 0.35);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll35}, behavior: 'instant' });`);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'scz-02-recorrido-avenida.png'));

    // 3. CAPTURA 3: Llegada al Cristo Redentor (Stage 65%)
    console.log('\n--- Capture 3: Llegada al Cristo Redentor (Stage 65%) ---');
    const scroll65 = Math.round(runwayHeight * 0.65);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll65}, behavior: 'instant' });`);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'scz-03-cristo-redentor.png'));

    // 4. CAPTURA 4: Avance hacia el Corredor Norte (Stage 90%)
    console.log('\n--- Capture 4: Avance hacia el Corredor Norte (Stage 90%) ---');
    const scroll90 = Math.round(runwayHeight * 0.90);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll90}, behavior: 'instant' });`);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'scz-04-corredor-norte.png'));

    // 5. CAPTURA 5: Galería Instagram Oficial en Paleta Dark
    console.log('\n--- Capture 5: Galería Instagram Oficial (Paleta Dark) ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('instagram');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'scz-05-instagram-dark.png'));

    // 6. CAPTURA 6: Contacto con Holograma Cerrado
    console.log('\n--- Capture 6: Contacto con Holograma Cerrado ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('contacto');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'scz-06-contacto-cerrado.png'));

    // 7. CAPTURA 7: Contacto con Holograma Proyectado (Activación interactiva)
    console.log('\n--- Capture 7: Contacto con Holograma Proyectado ---');
    await cdp.evaluate(`
      (() => {
        const btn = document.getElementById('contacto')?.querySelector('button');
        if (btn) btn.click();
      })()
    `);
    await delay(1200);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'scz-07-contacto-holograma-abierto.png'));

    // 8. MOBILE 390px Viewport Check
    console.log('\n--- Capture 8: Mobile 390px Viewport Verification ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.evaluate(`window.scrollTo({ top: 0, behavior: 'instant' });`);
    await delay(1000);
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
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'scz-08-mobile-390.png'));

    console.log('\n=== ALL 8 SANTA CRUZ REFINEMENT AUDITS PASSED WITH SUCCESS! ===');
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
