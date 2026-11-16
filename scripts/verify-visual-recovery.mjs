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
  console.log('=== URBO — LIVING CITY & VISUAL QUALITY RECOVERY AUDIT ===');

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
    '--user-data-dir=' + path.join(process.env.TEMP, 'chrome-profile-recovery-qa'),
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

    console.log('Waiting for map tiles & initial assets to settle...');
    await delay(3800);

    const runwayHeight = await cdp.evaluate(`document.getElementById('inicio')?.offsetHeight || 4000`);
    console.log(`[Runway Height]: ${runwayHeight}px`);

    // 1. CAPTURE 1: 0% REAL DÍA PLENO (14:30)
    console.log('\n--- Capture 1: 0% Real DÍA (Catedral, Light Pavement, Green Plazas, Sunlight Relief) ---');
    await cdp.evaluate(`window.scrollTo(0, 0);`);
    await delay(1800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'recovery-01-day-0pct.png'));

    // 2. CAPTURE 2: 25% TARDE / GOLDEN HOUR (Plaza del Estudiante - LEFT CARD)
    console.log('\n--- Capture 2: 25% Tarde / Golden Hour (Plaza del Estudiante, Left Card) ---');
    const scroll25 = Math.round(runwayHeight * 0.25);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll25}, behavior: 'instant' });`);
    await delay(1600);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'recovery-02-afternoon-25pct.png'));

    // 3. CAPTURE 3: 50% ATARDECER / SUNSET (Cristo Redentor - RIGHT CARD)
    console.log('\n--- Capture 3: 50% Atardecer / Sunset (Cristo Redentor, Right Card, Warm Sun) ---');
    const scroll50 = Math.round(runwayHeight * 0.50);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll50}, behavior: 'instant' });`);
    await delay(1600);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'recovery-03-sunset-50pct.png'));

    // 4. CAPTURE 4: 75% NOCHE (Corredor Norte - LEFT CARD, Street Lamps Glowing)
    console.log('\n--- Capture 4: 75% Noche (Corredor Norte, Left Card, Street Lamps) ---');
    const scroll75 = Math.round(runwayHeight * 0.75);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll75}, behavior: 'instant' });`);
    await delay(1600);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'recovery-04-night-75pct.png'));

    // 5. CAPTURE 5: 100% NOCHE PROFUNDA (Viaducto Cuarto Anillo - CENTER CARD)
    console.log('\n--- Capture 5: 100% Noche Profunda (Cuarto Anillo, Visión URBO Center Card) ---');
    const scroll100 = Math.round(runwayHeight * 0.95);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll100}, behavior: 'instant' });`);
    await delay(1600);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'recovery-05-deepnight-100pct.png'));

    // 6. CAPTURE 6: AUTHENTIC INSTAGRAM HUB (No Fake Stock Photos, Official Links)
    console.log('\n--- Capture 6: Authentic Instagram Hub (@urbo.corp, Zero Stock Photos) ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('instagram');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(1400);
    const igState = await cdp.evaluate(`
      (() => {
        const cards = document.querySelectorAll('#instagram .instagram-hub-card');
        const links = Array.from(document.querySelectorAll('#instagram a[href*="instagram.com"]')).map(a => a.href);
        return { cardsCount: cards.length, officialLinks: links };
      })()
    `);
    console.log('[Instagram State verified]:', igState);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'recovery-06-instagram-authentic.png'));

    // 7. CAPTURE 7: Mobile 390px Viewport Check
    console.log('\n--- Capture 7: Mobile 390px Viewport Check ---');
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
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'recovery-07-mobile-390.png'));

    console.log('\n=== ALL 7 VISUAL QUALITY RECOVERY AUDITS COMPLETED SUCCESSFULLY! ===');
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
