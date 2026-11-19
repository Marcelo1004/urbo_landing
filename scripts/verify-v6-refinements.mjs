import http from 'http';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const TARGET_URL = 'http://localhost:4173';
const CDP_PORT = 9299; // fresh port
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
  console.log('=== URBO — V6 COMPREHENSIVE REFINEMENT AUDIT ===');

  let previewProcess = null;
  let isListening = false;
  try {
    await httpGet(TARGET_URL);
    isListening = true;
    console.log('[Preview] Already listening on port 4173');
  } catch (e) {
    console.log('[Preview] Starting preview on port 4173...');
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
    '--user-data-dir=' + path.join(process.env.TEMP, 'chrome-profile-v6-audit'),
  ]);

  await delay(2000);

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

    console.log('Waiting for map tiles & initial 3D scene to settle...');
    await delay(4000);

    const runwayHeight = await cdp.evaluate(`
      (() => {
        const el = document.getElementById('inicio');
        return el ? el.scrollHeight : 0;
      })()
    `);
    console.log(`[Runway Height]: ${runwayHeight}px`);

    // -------------------------------------------------------------
    // CAPTURE 1: INICIO (Progress = 0%)
    // -------------------------------------------------------------
    console.log('\n--- Capture 1: Inicio del Recorrido (0%) ---');
    await cdp.evaluate('window.scrollTo(0, 0)');
    await delay(1500);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v6-01-inicio.png'));

    // -------------------------------------------------------------
    // CAPTURE 2: TRAMO DEL SEGUNDO ANILLO CON CRISTO REDENTOR (~17%)
    // -------------------------------------------------------------
    console.log('\n--- Capture 2: Tramo del Segundo Anillo con Cristo Redentor (~17%) ---');
    const cristoScrollY = Math.round((runwayHeight - 900) * 0.17);
    await cdp.evaluate(`window.scrollTo({ top: ${cristoScrollY}, behavior: 'instant' })`);
    await delay(2500);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v6-02-segundo-anillo-cristo.png'));

    // -------------------------------------------------------------
    // CAPTURE 3: TRAMO MEDIO CON CAMBIO DE ÁNGULO (~44%)
    // -------------------------------------------------------------
    console.log('\n--- Capture 3: Tramo Medio con Cambio de Ángulo y Perspectiva (~44%) ---');
    const midScrollY = Math.round((runwayHeight - 900) * 0.44);
    await cdp.evaluate(`window.scrollTo({ top: ${midScrollY}, behavior: 'instant' })`);
    await delay(2200);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v6-03-tramo-medio-angulo.png'));

    // -------------------------------------------------------------
    // CAPTURE 4: TOMA FINAL CENITAL (TOP-DOWN) CON LOGO URBO (~96%)
    // -------------------------------------------------------------
    console.log('\n--- Capture 4: Toma Final Cenital Top-Down con Logo URBO (~96%) ---');
    const cenitalScrollY = Math.round((runwayHeight - 900) * 0.96);
    await cdp.evaluate(`window.scrollTo({ top: ${cenitalScrollY}, behavior: 'instant' })`);
    await delay(2600);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v6-04-toma-final-cenital.png'));

    // -------------------------------------------------------------
    // CAPTURE 5: SECCIÓN DE INSTAGRAM REDISEÑADA
    // -------------------------------------------------------------
    console.log('\n--- Capture 5: Nueva Sección Editorial Instagram (@urbo.corp) ---');
    await cdp.evaluate(`
      (() => {
        const el = document.getElementById('instagram');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()
    `);
    await delay(1800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v6-05-seccion-instagram.png'));

    // -------------------------------------------------------------
    // CAPTURE 6: HOLOGRAMA MEJORADO Y PROYECTADO
    // -------------------------------------------------------------
    console.log('\n--- Capture 6: Holograma de Información Desplegado y Refinado ---');
    await cdp.evaluate(`
      (() => {
        const el = document.getElementById('contacto');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(1200);

    // Click the "Proyectar Canales" button to trigger the holographic timeline
    await cdp.evaluate(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && (b.textContent.includes('Proyectar') || b.textContent.includes('Contáctanos')));
        if (btn) btn.click();
      })()
    `);
    await delay(2200);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v6-06-holograma-proyectado.png'));

    console.log('\n=== ALL 6 DELIVERABLE AUDIT SCREENSHOTS COMPLETED! ===');

  } catch (err) {
    console.error('Audit execution error:', err);
  } finally {
    if (cdp) await cdp.close();
    chromeProcess.kill();
    if (previewProcess) previewProcess.kill();
    process.exit(0);
  }
}

run();
