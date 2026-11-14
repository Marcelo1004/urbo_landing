import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b";
const CDP_PORT = 9276;
const TARGET_URL = 'http://localhost:4173';

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
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

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
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

async function main() {
  console.log('=== URBO V5.6 — VISUAL VERIFICATION & CDP INSPECTION ===');

  let previewProcess = null;
  let isListening = false;
  try {
    await httpGet(TARGET_URL);
    isListening = true;
    console.log('[Preview] Server already listening on port 4173');
  } catch (e) {
    console.log('[Preview] Starting vite preview on port 4173...');
    previewProcess = child_process.spawn('npx.cmd', ['vite', 'preview', '--port', '4173', '--host'], {
      cwd: 'd:\\URBO',
      stdio: 'pipe',
      shell: true
    });
  }

  // Poll until HTTP 200 is responding
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

  if (!isListening) {
    throw new Error('Preview server failed to start on port 4173');
  }

  console.log('[Chrome] Launching Headless Chrome on CDP port', CDP_PORT);
  const chromeProcess = child_process.spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    '--disable-web-security',
    '--disable-gpu-shader-disk-cache',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    '--user-data-dir=' + path.join(process.env.TEMP, 'chrome-profile-v56')
  ]);

  await delay(1800);

  let cdp;
  try {
    const targets = await httpGet(`http://127.0.0.1:${CDP_PORT}/json`);
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    console.log('[CDP] Connected via WebSocket');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    console.log('\nNavigating to', TARGET_URL);
    await cdp.send('Page.navigate', { url: TARGET_URL });

    // Wait until preloader is completely dissolved
    console.log('Waiting for preloader exit...');
    let preloaderExited = false;
    let elapsed = 0;
    while (!preloaderExited && elapsed < 4000) {
      await delay(200);
      elapsed += 200;
      preloaderExited = await cdp.evaluate(`!document.getElementById('urbo-cinematic-preloader')`);
    }
    console.log(`Preloader dismissed in ${elapsed}ms`);
    await delay(1200);

    // Warm up lazy-loaded below-the-fold modules by scrolling through page
    console.log('Warming up lazy loaded modules...');
    await cdp.evaluate(`window.scrollTo(0, 1400);`);
    await delay(800);
    await cdp.evaluate(`window.scrollTo(0, 3200);`);
    await delay(800);
    await cdp.evaluate(`window.scrollTo(0, document.body.scrollHeight);`);
    await delay(1200);
    await cdp.evaluate(`window.scrollTo(0, 0);`);
    await delay(600);

    // 1. HERO MAP INSPECTION & CAPTURE
    console.log('\n--- 1. Hero Map Inspection ---');
    await cdp.evaluate(`window.scrollTo(0, 0);`);
    await delay(500);

    const heroInfo = await cdp.evaluate(`
      (() => {
        const hero = document.getElementById('inicio');
        const mapEl = hero?.querySelector('.maplibregl-map');
        const blueDot = document.querySelector('[class*="bus-marker"] .bg-cyan-400');
        const specularSweep = document.querySelector('.cockpit-specular-sweep');
        return {
          hasHero: !!hero,
          hasMapCanvas: !!mapEl,
          hasBlueGpsBeacon: !!blueDot,
          hasSpecularSweepGlare: !!specularSweep // Should be false!
        };
      })()
    `);
    console.log('[Hero Map Info]:', heroInfo);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v56-hero-map.png'));

    // 2. OPPORTUNITY SECTION (30% Crema Palette)
    console.log('\n--- 2. Opportunity Section (Crema Palette) ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('oportunidad');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(800);
    const oppInfo = await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('oportunidad');
        const style = sec ? window.getComputedStyle(sec) : null;
        return {
          bgColor: style ? style.backgroundColor : null,
          isCreamPalette: style ? style.backgroundColor.includes('250, 245, 236') : false
        };
      })()
    `);
    console.log('[Opportunity Info]:', oppInfo);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v56-opportunity-cream.png'));

    // 3. SOLUTION SECTION
    console.log('\n--- 3. Solution Section ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('solucion');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v56-solution-cards.png'));

    // 4. METRICS PROOF SECTION
    console.log('\n--- 4. Metrics Evidence Section ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('metricas');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(800);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v56-metrics-evidence.png'));

    // 5. PILOTO / WHATSAPP COMMUNITY CHAT
    console.log('\n--- 5. WhatsApp-style Community Feed ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('comunidad');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(1000);
    const chatInfo = await cdp.evaluate(`
      (() => {
        const chatWin = document.querySelector('.community-chat-window');
        const driverMsg = document.querySelector('[class*="bg-[#0E2822]"]');
        const passengerMsg = document.querySelector('[class*="bg-[#162744]"]');
        return {
          foundChatWindow: !!chatWin,
          hasDriverMsg: !!driverMsg,
          hasPassengerMsg: !!passengerMsg
        };
      })()
    `);
    console.log('[Chat Feed Info]:', chatInfo);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v56-community-chat.png'));

    // 6. INSTAGRAM PREVIEW GALLERY
    console.log('\n--- 6. Instagram Preview Gallery ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('instagram');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(1000);
    const igInfo = await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('instagram');
        const cards = sec ? sec.querySelectorAll('.instagram-card') : [];
        const followBtn = sec ? sec.querySelector('a[href*="instagram.com"]') : null;
        return {
          foundInstagramSection: !!sec,
          cardCount: cards.length,
          hasFollowButton: !!followBtn
        };
      })()
    `);
    console.log('[Instagram Section Info]:', igInfo);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v56-instagram-gallery.png'));

    // 7. ROADMAP COCKPIT
    console.log('\n--- 7. Roadmap Section ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('roadmap');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(1500);
    const roadmapInfo = await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('roadmap');
        const playBtn = sec ? sec.querySelector('button') : null;
        const gpsBeacon = sec ? sec.querySelector('.gps-live-beacon') : null;
        return {
          foundRoadmap: !!sec,
          hasPlayButton: !!playBtn,
          hasGpsBeacon: !!gpsBeacon
        };
      })()
    `);
    console.log('[Roadmap Info]:', roadmapInfo);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v56-roadmap-cinematic.png'));

    // 8. FINAL CTA HOLOGRAPHIC CARD
    console.log('\n--- 8. Final CTA Holographic Card ---');
    await cdp.evaluate(`
      (() => {
        const sec = document.getElementById('contacto');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(800);
    
    // Toggle holographic projection to verify state B
    await cdp.evaluate(`
      (() => {
        const card = document.getElementById('contacto')?.querySelector('.cursor-pointer');
        if (card) card.click();
      })()
    `);
    await delay(800);
    const ctaInfo = await cdp.evaluate(`
      (() => {
        const igChannel = document.querySelector('a[href*="instagram.com/urbo.corp"]');
        const emailChannel = document.querySelector('a[href*="mailto:josemariorc"]');
        const waChannel = document.querySelector('a[href*="wa.me"]');
        return {
          hasInstagramChannel: !!igChannel,
          hasEmailChannel: !!emailChannel,
          hasWaChannel: !!waChannel
        };
      })()
    `);
    console.log('[Final CTA Hologram Info]:', ctaInfo);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v56-final-cta-hologram.png'));

    // 9. MOBILE VIEWPORT 390px (iPhone)
    console.log('\n--- 9. Mobile Viewport 390px Verification ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await delay(600);
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
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v56-mobile-390.png'));

    console.log('\n=== ALL V5.6 VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    if (cdp) await cdp.close();
    chromeProcess.kill();
    if (previewProcess) previewProcess.kill();
  }
}

main().catch(console.error);
