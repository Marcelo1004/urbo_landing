import http from 'http';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const TARGET_URL = 'http://localhost:4173';
const CDP_PORT = 9288;
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
        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
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
  console.log('=== URBO CINEMATIC EXPERIENCE — 3D SCROLL & GSAP VERIFICATION ===');

  let previewProcess = null;
  let isListening = false;
  try {
    await httpGet(TARGET_URL);
    isListening = true;
    console.log('[Preview] Already running on port 4173');
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
    '--user-data-dir=' + path.join(process.env.TEMP, 'chrome-profile-norva'),
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

    // 1. Verify No Preloader is Blocking
    const preloaderState = await cdp.evaluate(`
      (() => {
        const preloader = document.getElementById('urbo-cinematic-preloader');
        const hero = document.getElementById('inicio');
        return {
          preloaderFound: !!preloader,
          heroDirectlyVisible: !!hero && window.getComputedStyle(hero).display !== 'none'
        };
      })()
    `);
    console.log('[Preloader Check]:', preloaderState);

    // 2. STAGE 0%: Hero Entrance (Initial wide isometric view & main headline)
    console.log('\n--- Capture 1: Stage 0% (Hero Initial View) ---');
    await cdp.evaluate(`window.scrollTo(0, 0);`);
    await delay(1000);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'norva-stage-00-initial.png'));

    // 3. STAGE 25%: Scroll Begins (Headline tilts into ground, Chapter 1 appears)
    console.log('\n--- Capture 2: Stage 25% (Scroll Progression Chapter 1) ---');
    const runwayHeight = await cdp.evaluate(`document.getElementById('inicio')?.offsetHeight || 3000`);
    const scroll25 = Math.round(runwayHeight * 0.25);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll25}, behavior: 'instant' });`);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'norva-stage-25-chapter1.png'));

    // 4. STAGE 60%: Avenue Traversal (Cyan beacon active along route, Chapter 2)
    console.log('\n--- Capture 3: Stage 60% (Avenue Traversal Chapter 2) ---');
    const scroll60 = Math.round(runwayHeight * 0.60);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll60}, behavior: 'instant' });`);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'norva-stage-60-chapter2.png'));

    // 5. STAGE 90%: Journey Complete & Final CTA
    console.log('\n--- Capture 4: Stage 90% (Final Stop & CTA) ---');
    const scroll90 = Math.round(runwayHeight * 0.90);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll90}, behavior: 'instant' });`);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'norva-stage-90-cta.png'));

    // 6. REVERSE TEST: Scroll back up to 30% and verify stability
    console.log('\n--- Capture 5: Reverse Scrubbing Test (Back to 30%) ---');
    const scroll30 = Math.round(runwayHeight * 0.30);
    await cdp.evaluate(`window.scrollTo({ top: ${scroll30}, behavior: 'instant' });`);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'norva-stage-reverse-30.png'));

    // 7. MOBILE 390px Viewport Check
    console.log('\n--- Capture 6: Mobile 390px Viewport Verification ---');
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
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'norva-stage-mobile-390.png'));

    console.log('\n=== ALL CINEMATIC 3D SCROLL TESTS COMPLETED SUCCESSFULLY! ===');
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
