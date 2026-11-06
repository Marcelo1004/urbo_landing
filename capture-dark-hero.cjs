const { spawn } = require('child_process');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--user-data-dir=d:\\URBO\\.tmp_dark_p2',
    '--window-size=1440,950',
    'http://localhost:3000',
  ]);

  await sleep(3500);
  const listRes = await fetch('http://127.0.0.1:9226/json');
  const tabs = await listRes.json();
  const tab = tabs.find((t) => t.url && t.url.includes('localhost:3000'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  let id = 10;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = ++id;
      const handler = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise((res) => (ws.onopen = res));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 950,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Force dark mode in localStorage and reload
  await send('Runtime.evaluate', {
    expression: `(() => {
      localStorage.setItem('urbo-theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    })()`,
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await sleep(4000);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync('d:\\URBO\\v32-hero-dark.png', buf);
  fs.writeFileSync(`${artifactDir}\\v32-hero-dark.png`, buf);
  console.log('Saved v32-hero-dark.png');

  ws.close();
  proc.kill();
}

run();
