import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9225;

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

async function audit() {
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
    await cdp.send('Runtime.enable');
    await cdp.send('Performance.enable');

    console.log('Navigating to http://localhost:3000 ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000' });
    await delay(3000);

    const perfMetrics = await cdp.send('Performance.getMetrics');
    console.log('--- Initial Load Performance Metrics ---');
    const metricsMap = {};
    perfMetrics.metrics.forEach(m => metricsMap[m.name] = m.value);
    console.log('JSHeapUsedSize (MB):', (metricsMap.JSHeapUsedSize / 1024 / 1024).toFixed(2));
    console.log('LayoutCount:', metricsMap.LayoutCount);
    console.log('RecalcStyleCount:', metricsMap.RecalcStyleCount);
    console.log('LayoutDuration:', metricsMap.LayoutDuration);
    console.log('RecalcStyleDuration:', metricsMap.RecalcStyleDuration);
    console.log('ScriptDuration:', metricsMap.ScriptDuration);

    // Audit DOM elements with backdrop-filter
    const backdropCheck = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const all = Array.from(document.querySelectorAll('*'));
          let count = 0;
          let blurElements = [];
          all.forEach(el => {
            const style = window.getComputedStyle(el);
            const bf = style.backdropFilter || style.webkitBackdropFilter;
            if (bf && bf !== 'none') {
              count++;
              blurElements.push({ tag: el.tagName, class: el.className, bf });
            }
          });
          return { count, sample: blurElements.slice(0, 10) };
        })()
      `,
      returnByValue: true
    });
    console.log('Elements with backdrop-filter:', backdropCheck.result.value);

    // Audit scroll smoothness by simulating mouse wheel events over 3 seconds
    console.log('Simulating continuous scroll and measuring FPS/jank...');
    const scrollEval = await cdp.send('Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          let frames = 0;
          let lastTime = performance.now();
          let frameDeltas = [];
          let startTime = performance.now();

          function step(time) {
            frames++;
            const delta = time - lastTime;
            lastTime = time;
            frameDeltas.push(delta);
            window.scrollBy(0, 25);

            if (time - startTime < 2000) {
              requestAnimationFrame(step);
            } else {
              const avgDelta = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
              const janks = frameDeltas.filter(d => d > 33.3).length; // >33.3ms is <30fps
              resolve({
                totalFrames: frames,
                avgDelta: avgDelta.toFixed(2),
                approxFPS: (1000 / avgDelta).toFixed(1),
                jankFramesOver33ms: janks,
                totalRecorded: frameDeltas.length
              });
            }
          }
          requestAnimationFrame(step);
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('--- Scroll Profiling Result ---', scrollEval.result.value);

    await cdp.close();
  } catch (err) {
    console.error('Audit error:', err);
  } finally {
    chrome.kill();
  }
}

audit();

