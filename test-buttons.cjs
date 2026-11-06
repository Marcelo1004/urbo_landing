const { spawn } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9224',
  '--user-data-dir=d:\\URBO\\.tmp_p2',
  '--window-size=1440,950',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const r = await fetch('http://127.0.0.1:9224/json');
  const tabs = await r.json();
  const tab = tabs.find(t => t.url && t.url.includes('localhost:3000'));
  if (!tab) {
    console.log('No tab found');
    proc.kill();
    return;
  }
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    setTimeout(() => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `Array.from(document.querySelectorAll('.hero-buttons a')).map(b => ({
            text: b.innerText,
            opacity: window.getComputedStyle(b).opacity,
            transform: window.getComputedStyle(b).transform,
            rect: b.getBoundingClientRect()
          }))`,
          returnByValue: true
        }
      }));
    }, 3500);
  };
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id === 1) {
      console.log('Result after 3.5s:', d.result.value);
      ws.close();
      proc.kill();
      process.exit(0);
    }
  };
}, 1500);

