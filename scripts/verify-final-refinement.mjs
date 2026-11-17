import http from 'http';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const TARGET_URL = 'http://localhost:4173';
const CDP_PORT = 9298;
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
  console.log('=== URBO — FINAL REFINEMENT & NARRATIVE AUDIT ===');

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
    '--user-data-dir=' + path.join(process.env.TEMP, 'chrome-profile-final-audit'),
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

    console.log('Waiting for map tiles & initial 3D scene to settle...');
    await delay(3800);

    const runwayHeight = await cdp.evaluate(`document.getElementById('inicio')?.offsetHeight || 5000`);
    console.log(`[Runway Height (Elongated Route)]: ${runwayHeight}px`);

    // 1. CAPTURE 1: MAÑANA (0% Scroll - 08:30)
    console.log('\n--- Capture 1: Mañana Real en Santa Cruz (08:30, Luz Suave Cálida, Sin Rótulos Flotantes, Bienvenida Editorial) ---');
    await cdp.evaluate(`window.scrollTo(0, 0);`);
    await delay(1800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'final-01-manana.png'));

    // 2. CAPTURE 2: TARDE (25% Scroll - ~14:00, Tarjeta Izquierda Bloque 1, Centro Despejado)
    console.log('\n--- Capture 2: Tarde (14:00, Contraste Urbano Nítido, Tarjeta Izquierda, Centro Despejado) ---');
    const scrollTarde = Math.round(runwayHeight * 0.25);
    await cdp.evaluate(`window.scrollTo({ top: ${scrollTarde}, behavior: 'instant' });`);
    await delay(1800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'final-02-tarde.png'));

    // 3. CAPTURE 3: ATARDECER (48% Scroll - ~17:45, Luz Dorada Ambarina, Tarjeta Derecha Bloque 2, Centro Despejado)
    console.log('\n--- Capture 3: Atardecer desde las 16:00 (17:45, Luz Dorada, Sombras Largas, Tarjeta Derecha, Centro Despejado) ---');
    const scrollAtardecer = Math.round(runwayHeight * 0.48);
    await cdp.evaluate(`window.scrollTo({ top: ${scrollAtardecer}, behavior: 'instant' });`);
    await delay(1800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'final-03-atardecer.png'));

    // 4. CAPTURE 4: NOCHE (88% Scroll - ~21:00, Navy Profundo #070B14, Farolas Vivas, Ruta Cyan Protagonista, Tarjeta Derecha Bloque 4)
    console.log('\n--- Capture 4: Noche desde las 20:00 (21:00, Navy Profundo, Alumbrado Público, Ruta Cyan, Tarjeta Derecha) ---');
    const scrollNoche = Math.round(runwayHeight * 0.88);
    await cdp.evaluate(`window.scrollTo({ top: ${scrollNoche}, behavior: 'instant' });`);
    await delay(1800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'final-04-noche.png'));

    // 5. CAPTURE 5: NUEVA SECCIÓN DE INSTAGRAM (@urbo.corp, 4 Tarjetas Temáticas de Marca, Cero Mockups ni APIs)
    console.log('\n--- Capture 5: Nueva Sección Instagram (@urbo.corp, 4 Tarjetas Temáticas, 100% Marca Honesta) ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('instagram');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(1600);
    const igSummary = await cdp.evaluate(`
      (() => {
        const themeCards = document.querySelectorAll('#instagram .instagram-theme-card');
        const links = Array.from(document.querySelectorAll('#instagram a[href*="instagram.com"]')).map(a => a.href);
        const headers = Array.from(document.querySelectorAll('#instagram .instagram-theme-card h3')).map(h => h.textContent.trim());
        return { count: themeCards.length, themes: headers, linksCount: links.length };
      })()
    `);
    console.log('[Instagram Brand Section Summary]:', igSummary);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'final-05-instagram.png'));

    console.log('\n=== ALL 5 AUDIT DELIVERABLES GENERATED SUCCESSFULLY! ===');
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
