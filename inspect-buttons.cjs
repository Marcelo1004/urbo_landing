const { spawn } = require('child_process');

async function check() {
  const listRes = await fetch('http://127.0.0.1:9223/json').catch(() => null);
  if (!listRes) {
    console.log('No debugger at 9223');
    return;
  }
  const tabs = await listRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('localhost:3000'));
  if (!tab) {
    console.log('No tab at 9223');
    return;
  }

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const btns = document.querySelectorAll('.hero-buttons a');
          return Array.from(btns).map(b => ({
            text: b.innerText,
            display: window.getComputedStyle(b).display,
            visibility: window.getComputedStyle(b).visibility,
            opacity: window.getComputedStyle(b).opacity,
            transform: window.getComputedStyle(b).transform,
            rect: b.getBoundingClientRect()
          }));
        })()`,
        returnByValue: true
      }
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id === 1) {
      console.log('Buttons style check:', JSON.stringify(data.result.value, null, 2));
      ws.close();
      process.exit(0);
    }
  };
}

check();

