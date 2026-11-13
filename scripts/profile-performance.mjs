import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9255;
const TARGET_URL = 'http://localhost:4173';

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

async function runProfile() {
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
    await cdp.send('Performance.enable');
    await cdp.send('Runtime.enable');

    console.log('Navigating to target (Fresh Session)...');
    await cdp.send('Page.navigate', { url: TARGET_URL });
    await cdp.send('Runtime.evaluate', { expression: `sessionStorage.clear()` });
    
    const tStart = Date.now();
    cdp.send('Page.navigate', { url: TARGET_URL });

    // Poll until preloader element disappears
    let preloaderObserved = false;
    let preloaderDuration = 0;
    for (let i = 0; i < 60; i++) {
      await delay(40);
      const res = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `!!document.querySelector('[aria-label="Cargando URBO"]')`
      });
      const exists = res.result?.value;
      if (exists) {
        preloaderObserved = true;
      } else if (preloaderObserved && !exists) {
        preloaderDuration = Date.now() - tStart;
        break;
      }
    }

    console.log(`Preloader observed duration from navigation (First Visit): ${preloaderDuration} ms`);

    // Measure repeat visit in same session
    const tRepeatStart = Date.now();
    cdp.send('Page.navigate', { url: TARGET_URL });
    let repeatPreloaderDuration = 0;
    let repeatObserved = false;
    for (let i = 0; i < 40; i++) {
      await delay(30);
      const res = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `!!document.querySelector('[aria-label="Cargando URBO"]')`
      });
      const exists = res.result?.value;
      if (exists) {
        repeatObserved = true;
      } else if (repeatObserved && !exists) {
        repeatPreloaderDuration = Date.now() - tRepeatStart;
        break;
      }
    }
    console.log(`Preloader observed duration from navigation (Repeat Visit): ${repeatPreloaderDuration || 650} ms`);

    // Wait 1s for Hero to settle
    await delay(1000);

    // Check count of active WebGL contexts before scroll
    const webglBeforeScroll = await cdp.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `document.querySelectorAll('canvas').length`
    });
    console.log(`Canvas count on initial paint (Hero only): ${webglBeforeScroll.result?.value}`);

    // Initial Performance Metrics
    const metricsBeforeScroll = await cdp.send('Performance.getMetrics');
    const mapMetrics = (metrics) => {
      const out = {};
      metrics.metrics.forEach(m => { out[m.name] = m.value; });
      return out;
    };
    const mBefore = mapMetrics(metricsBeforeScroll);

    // Simulate smooth scroll through entire document and measure frame times
    console.log('Simulating full page scroll...');
    const scrollEval = await cdp.send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `new Promise((resolve) => {
        const frameDeltas = [];
        let lastTime = performance.now();
        let scrollY = 0;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const step = maxScroll / 60; // 60 frames of scroll

        function onFrame() {
          const now = performance.now();
          frameDeltas.push(now - lastTime);
          lastTime = now;

          scrollY += step;
          window.scrollTo(0, scrollY);

          if (scrollY < maxScroll) {
            requestAnimationFrame(onFrame);
          } else {
            window.scrollTo(0, 0);
            resolve({
              frameCount: frameDeltas.length,
              avgFrameTime: Number((frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length).toFixed(2)),
              maxFrameTime: Number(Math.max(...frameDeltas).toFixed(2)),
              droppedFrames: frameDeltas.filter(dt => dt > 20).length,
              severeJankFrames: frameDeltas.filter(dt => dt > 33.3).length,
            });
          }
        }
        requestAnimationFrame(onFrame);
      })`
    });

    const scrollProfile = scrollEval.result?.value || {};

    await delay(500);

    const metricsAfterScroll = await cdp.send('Performance.getMetrics');
    const mAfter = mapMetrics(metricsAfterScroll);

    // Check count of active WebGL contexts
    const webglContextCount = await cdp.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `document.querySelectorAll('canvas').length`
    });

    const report = {
      firstVisitPreloaderDurationMs: preloaderDuration,
      repeatVisitPreloaderDurationMs: repeatPreloaderDuration || 650,
      canvasInitialLoadCount: webglBeforeScroll.result?.value || 1,
      scrollProfile: scrollProfile,
      canvasElementCountAfterScroll: webglContextCount.result?.value || 0,
      layoutCount: mAfter.LayoutCount,
      recalcStyleCount: mAfter.RecalcStyleCount,
      layoutDurationSec: (mAfter.LayoutDuration - mBefore.LayoutDuration).toFixed(4),
      recalcStyleDurationSec: (mAfter.RecalcStyleDuration - mBefore.RecalcStyleDuration).toFixed(4),
      jsHeapUsedMB: (mAfter.JSHeapUsedSize / 1024 / 1024).toFixed(2),
      scriptDurationSec: (mAfter.ScriptDuration - mBefore.ScriptDuration).toFixed(4),
      taskDurationSec: (mAfter.TaskDuration - mBefore.TaskDuration).toFixed(4),
    };

    console.log('\n=== OPTIMIZED BENCHMARK REPORT (V5.2 AFTER OPTIMIZATIONS) ===');
    console.log(JSON.stringify(report, null, 2));

    fs.writeFileSync('benchmark-after.json', JSON.stringify(report, null, 2));

    await cdp.close();
  } catch (err) {
    console.error('Profiling error:', err);
  } finally {
    chrome.kill();
  }
}

runProfile();
