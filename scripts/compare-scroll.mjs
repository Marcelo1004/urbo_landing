import * as http from 'http';
import * as child_process from 'child_process';
import * as fs from 'fs';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9227;

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

async function compareScroll() {
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
    await cdp.send('Page.navigate', { url: 'http://localhost:3000' });
    await delay(3000);

    // Measure Scroll with current Lenis
    console.log('Testing scroll with Lenis active...');
    const withLenis = await cdp.send('Runtime.evaluate', {
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
            window.scrollBy(0, 30);

            if (time - startTime < 2000) {
              requestAnimationFrame(step);
            } else {
              const avg = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
              const janks = frameDeltas.filter(d => d > 33.3).length;
              resolve({ frames, avgDelta: avg.toFixed(2), approxFPS: (1000/avg).toFixed(1), janks });
            }
          }
          requestAnimationFrame(step);
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Result with Lenis:', withLenis.result.value);

    // Now test Native Scroll by disabling Lenis in runtime
    console.log('Testing native scroll (Lenis disabled)...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        window.__lenisInstance?.destroy();
        window.scrollTo(0, 0);
      `
    });
    await delay(500);

    const nativeScroll = await cdp.send('Runtime.evaluate', {
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
            window.scrollBy(0, 30);

            if (time - startTime < 2000) {
              requestAnimationFrame(step);
            } else {
              const avg = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
              const janks = frameDeltas.filter(d => d > 33.3).length;
              resolve({ frames, avgDelta: avg.toFixed(2), approxFPS: (1000/avg).toFixed(1), janks });
            }
          }
          requestAnimationFrame(step);
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Result Native Scroll:', nativeScroll.result.value);

    await cdp.close();
  } finally {
    chrome.kill();
  }
}

compareScroll();

