const { spawn } = require('child_process');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--user-data-dir=d:\\URBO\\.tmp_v32_profile',
    '--window-size=1440,950',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3000',
  ]);

  console.log('Launched Edge headless on port 9223');
  await sleep(2500);

  const listRes = await fetch('http://127.0.0.1:9223/json');
  const tabs = await listRes.json();
  const tab = tabs.find((t) => t.url && t.url.includes('localhost:3000'));

  if (!tab || !tab.webSocketDebuggerUrl) {
    console.error('No tab found', tabs);
    proc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 10;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = ++id;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  const logs = [];
  const errors = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve } = pending.get(data.id);
      pending.delete(data.id);
      resolve(data.result);
      return;
    }

    if (data.method === 'Runtime.consoleAPICalled') {
      const text = data.params.args.map((a) => a.value || a.description || '').join(' ');
      logs.push(`[${data.params.type}] ${text}`);
      if (data.params.type === 'error') {
        errors.push(text);
      }
    } else if (data.method === 'Runtime.exceptionThrown') {
      const desc = data.params.exceptionDetails?.exception?.description || data.params.exceptionDetails?.text;
      errors.push(`[EXCEPTION] ${desc}`);
    }
  };

  await new Promise((res) => {
    ws.onopen = res;
  });

  console.log('Connected to CDP');
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 950,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Navigate to ensure page is loaded
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await sleep(4000);

  // 1. Check copy text in DOM
  const checkTexts = await send('Runtime.evaluate', {
    expression: `(() => {
      const bodyText = document.body.innerText || '';
      return {
        title: document.title,
        bodyLength: bodyText.length,
        hasOldHeroCopy: bodyText.includes('tiempos exactos de llegada'),
        hasNewHeroCopy: bodyText.includes('tiempos de llegada'),
        hasNewOppCopy: bodyText.includes('+1,6 millones de personas'),
        hasDonMauricio: bodyText.toUpperCase().includes('DON MAURICIO'),
        hasChatPilot: bodyText.includes('Piloto Línea 30 · URBO SCZ'),
        activeTheme: document.documentElement.getAttribute('data-theme')
      };
    })()`,
    returnByValue: true,
  });

  console.log('DOM Content Verification:', checkTexts.result.value);

  const artifactDir = 'C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b';

  // Helper to capture screenshot to file
  async function capture(filename) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(`d:\\URBO\\${filename}`, buf);
    try {
      fs.writeFileSync(`${artifactDir}\\${filename}`, buf);
    } catch (e) {}
    console.log(`Saved screenshot: ${filename}`);
  }

  // Screenshot 1: Hero
  await capture('v32-hero.png');

  // Screenshot 2: Opportunity
  await send('Runtime.evaluate', {
    expression: `document.getElementById('oportunidad')?.scrollIntoView({ behavior: 'instant' })`,
  });
  await sleep(1000);
  await capture('v32-opportunity.png');

  // Screenshot 3: Pilot / Community
  await send('Runtime.evaluate', {
    expression: `document.getElementById('comunidad')?.scrollIntoView({ behavior: 'instant' })`,
  });
  await sleep(1000);
  await capture('v32-community.png');

  // Screenshot 4: Roadmap with SciFi Lab
  await send('Runtime.evaluate', {
    expression: `document.getElementById('roadmap')?.scrollIntoView({ behavior: 'instant' })`,
  });
  await sleep(1000);
  await capture('v32-roadmap.png');

  // Screenshot 5: Contact Card State A
  await send('Runtime.evaluate', {
    expression: `document.getElementById('contacto')?.scrollIntoView({ behavior: 'instant' })`,
  });
  await sleep(1000);
  await capture('v32-contact-state-a.png');

  // Trigger Morph to State B by clicking button
  console.log('Triggering morph to State B...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('#contacto [role="button"]');
      if (card) card.click();
    })()`,
  });
  await sleep(900); // allow GSAP morph transition to complete
  await capture('v32-contact-state-b.png');

  // Screenshot 6: Theme Toggle to Light Mode
  console.log('Triggering theme toggle to Light Mode...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const toggle = document.querySelector('header button[aria-label*="modo"]');
      if (toggle) toggle.click();
    })()`,
  });
  await sleep(800);
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 0, behavior: 'instant' })`,
  });
  await sleep(600);
  await capture('v32-light-mode.png');

  // Screenshot 7: Mobile Viewport (375x812)
  console.log('Switching to mobile viewport...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sleep(600);
  await capture('v32-mobile.png');

  console.log('Console errors count:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  ws.close();
  proc.kill();
  console.log('V3.2 verification complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
