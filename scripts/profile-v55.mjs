import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b";
const CDP_PORT = 9272;
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
  console.log('=== URBO V5.5 — PROFILING, ORCHESTRATION & OPTICAL GLASS VERIFICATION ===');

  // 1. Launch Vite preview if not running
  let previewProcess = null;
  try {
    await httpGet(TARGET_URL);
    console.log('[Preview] Server already listening on port 4173');
  } catch (e) {
    console.log('[Preview] Starting vite preview on port 4173...');
    previewProcess = child_process.spawn('npx.cmd', ['vite', 'preview', '--port', '4173', '--host'], {
      cwd: 'd:\\URBO',
      stdio: 'pipe',
      shell: true
    });
    await delay(2500);
  }

  // 2. Launch headless Chrome with CDP
  console.log('[Chrome] Launching with remote debugging port', CDP_PORT);
  const chromeProcess = child_process.spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    '--disable-web-security',
    '--disable-gpu-shader-disk-cache',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    '--user-data-dir=' + path.join(process.env.TEMP, 'chrome-profile-v55')
  ]);

  await delay(1800);

  let cdp;
  try {
    const versionInfo = await httpGet(`http://127.0.0.1:${CDP_PORT}/json/version`);
    console.log('[CDP] Chrome Version:', versionInfo['Browser']);
    const targets = await httpGet(`http://127.0.0.1:${CDP_PORT}/json`);
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    console.log('[CDP] Connected via WebSocket');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Performance.enable');

    // -------------------------------------------------------------
    // TEST 1: PRELOADER LIFECYCLE & SCALE-X DETERMINISM
    // -------------------------------------------------------------
    console.log('\n--- TEST 1: Preloader Lifecycle & scaleX Transform ---');
    const startNav = Date.now();
    await cdp.send('Page.navigate', { url: TARGET_URL });
    
    // Quick capture during preloader active phase
    await delay(250);
    const preloaderState = await cdp.evaluate(`
      (() => {
        const preloader = document.getElementById('urbo-cinematic-preloader');
        const progressBar = preloader?.querySelector('.h-full.rounded-full');
        const transform = progressBar ? window.getComputedStyle(progressBar).transform : null;
        let visited = null;
        try { visited = window.sessionStorage?.getItem('urbo_visited_v55'); } catch (e) {}
        return {
          exists: !!preloader,
          hasProgressBar: !!progressBar,
          transform: transform,
          sessionFirstVisit: visited
        };
      })()
    `);
    console.log('[Preloader at 250ms]:', preloaderState);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v55-preloader-scale.png'));

    // Wait until preloader completes (should take < 1200ms total)
    let preloaderCompleted = false;
    let elapsed = 0;
    while (!preloaderCompleted && elapsed < 3500) {
      await delay(100);
      elapsed += 100;
      preloaderCompleted = await cdp.evaluate(`
        !document.getElementById('urbo-cinematic-preloader')
      `);
    }
    const preloaderTotalMs = Date.now() - startNav;
    console.log(`[Preloader Exit Completed in]: ${elapsed}ms (Total from nav: ${preloaderTotalMs}ms)`);

    // -------------------------------------------------------------
    // TEST 2: GSAP HERO ORCHESTRATION & VISIBILITY
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: GSAP Hero Orchestration & Visual State ---');
    await delay(300); // Allow hero entrance timeline to complete
    const heroMetrics = await cdp.evaluate(`
      (() => {
        const hero = document.getElementById('inicio');
        const headline = hero?.querySelector('h1');
        const mapContainer = hero?.querySelector('.maplibregl-map');
        const heroStyles = headline ? window.getComputedStyle(headline) : null;
        return {
          heroVisible: !!hero && hero.offsetHeight > 0,
          headlineOpacity: heroStyles ? heroStyles.opacity : null,
          headlineTransform: heroStyles ? heroStyles.transform : null,
          hasMap: !!mapContainer,
          windowScrollY: window.scrollY
        };
      })()
    `);
    console.log('[Hero Orchestration Metrics]:', heroMetrics);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v55-hero-orchestrated.png'));

    // -------------------------------------------------------------
    // TEST 3: OPTICAL GLASS SURFACE AT FINAL CTA
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: Optical Glass Refraction Surface Verification ---');
    await cdp.evaluate(`
      (() => {
        const cta = document.getElementById('contacto');
        if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await delay(800);

    const opticalMetrics = await cdp.evaluate(`
      (() => {
        const opticalSurface = document.querySelector('.glass-optical');
        const svgFilter = document.getElementById('urbo-optical-refraction');
        const specularHighlight = opticalSurface?.querySelector('[class*="h-[1.5px]"]');
        return {
          foundOpticalSurface: !!opticalSurface,
          foundSvgRefractionFilter: !!svgFilter,
          hasSpecularHighlight: !!specularHighlight,
          computedFilter: opticalSurface ? window.getComputedStyle(opticalSurface).backdropFilter : null,
          boxShadow: opticalSurface ? window.getComputedStyle(opticalSurface).boxShadow : null
        };
      })()
    `);
    console.log('[Optical Glass Metrics]:', opticalMetrics);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v55-optical-glass-refraction.png'));

    // -------------------------------------------------------------
    // TEST 4: SCROLL SMOOTHNESS & LONG TASKS
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Scroll Smoothness & Long Tasks Profiling ---');
    const scrollPerf = await cdp.evaluate(`
      new Promise((resolve) => {
        let frameTimes = [];
        let lastTime = performance.now();
        let running = true;

        function recordFrame(now) {
          const delta = now - lastTime;
          lastTime = now;
          if (delta > 0) frameTimes.push(delta);
          if (running) requestAnimationFrame(recordFrame);
        }
        const rafId = requestAnimationFrame(recordFrame);

        // Perform programmatic smooth scroll down and up
        let distance = 0;
        const interval = setInterval(() => {
          distance += 150;
          window.scrollBy(0, 150);
          if (distance > 3000 || (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            clearInterval(interval);
            running = false;
            cancelAnimationFrame(rafId);
            
            // Calculate stats
            const avgDelta = frameTimes.reduce((a, b) => a + b, 0) / (frameTimes.length || 1);
            const fps = 1000 / avgDelta;
            const droppedFrames = frameTimes.filter(t => t > 25).length; // frames > 25ms (~40fps drop)
            const maxDelta = Math.max(...frameTimes, 0);

            resolve({
              avgDeltaMs: avgDelta.toFixed(2),
              estimatedFps: Math.min(60, fps).toFixed(1),
              totalFramesSampled: frameTimes.length,
              droppedFrames: droppedFrames,
              maxFrameDeltaMs: maxDelta.toFixed(2)
            });
          }
        }, 16);
      })
    `);
    console.log('[Scroll Performance Results]:', scrollPerf);

    // -------------------------------------------------------------
    // TEST 5: VIEWPORT RESPONSIVENESS (390px, 375px, 768px)
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Multi-Viewport Responsive Validation ---');

    // Reset scroll
    await cdp.evaluate(`window.scrollTo(0, 0);`);
    await delay(300);

    // 390px iPhone Viewport
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await delay(500);
    const mobileMetrics = await cdp.evaluate(`
      (() => {
        const opticalSurface = document.querySelector('.glass-optical');
        const svgFilterInDom = !!document.getElementById('urbo-optical-refraction');
        return {
          viewportWidth: window.innerWidth,
          bodyScrollWidth: document.body.scrollWidth,
          hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth,
          fallbackActiveOnMobile: !svgFilterInDom // on mobile, heavy SVG filter should be excluded
        };
      })()
    `);
    console.log('[Mobile 390px Metrics]:', mobileMetrics);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v55-mobile-390.png'));

    // 375px Narrow Viewport
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });
    await delay(400);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v55-responsive-375.png'));

    // 768px Tablet Viewport
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: false
    });
    await delay(400);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'v55-responsive-768.png'));

    // Performance Timing Metrics
    const perfTiming = await cdp.evaluate(`
      (() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find(p => p.name === 'first-contentful-paint');
        return {
          domInteractive: nav ? Math.round(nav.domInteractive) : null,
          domComplete: nav ? Math.round(nav.domComplete) : null,
          fcp: fcp ? Math.round(fcp.startTime) : null,
          loadEventEnd: nav ? Math.round(nav.loadEventEnd) : null,
          memory: performance.memory ? {
            usedJSHeapSizeMB: (performance.memory.usedJSHeapSize / 1048576).toFixed(1),
            totalJSHeapSizeMB: (performance.memory.totalJSHeapSize / 1048576).toFixed(1)
          } : 'N/A'
        };
      })()
    `);
    console.log('\n[Navigation & Paint Timings]:', perfTiming);

    console.log('\n=== ALL PROFILING TESTS COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Error during CDP profiling:', err);
  } finally {
    if (cdp) await cdp.close();
    chromeProcess.kill();
    if (previewProcess) previewProcess.kill();
  }
}

main().catch(console.error);
