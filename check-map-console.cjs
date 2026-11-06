const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=d:\\URBO\\.tmp_edge_test_map',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  'http://localhost:4321/',
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.url && t.url.includes(':4321'));

    if (pageTab && pageTab.webSocketDebuggerUrl) {
      const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
        ws.send(JSON.stringify({ id: 3, method: 'Runtime.enable' }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          console.log('[CONSOLE]', msg.params.type, JSON.stringify(msg.params.args));
        } else if (msg.method === 'Runtime.exceptionThrown') {
          console.log('[EXCEPTION]', msg.params.exceptionDetails);
        }
      };

      setTimeout(() => {
        ws.close();
        proc.kill();
        process.exit(0);
      }, 6000);
    }
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
}, 2000);

