const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=d:\\URBO\\.tmp_edge_profile',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  'http://localhost:3000',
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const mainTab = tabs.find(t => t.url && t.url.includes('localhost:3000'));
    console.log('Target tab:', mainTab?.id, mainTab?.url);

    if (mainTab && mainTab.webSocketDebuggerUrl) {
      const ws = new WebSocket(mainTab.webSocketDebuggerUrl);

      ws.onopen = () => {
        console.log('Connected to tab websocket');
        ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 3, method: 'Log.enable' }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          console.log('[BROWSER CONSOLE]', msg.params.type, JSON.stringify(msg.params.args));
        } else if (msg.method === 'Runtime.exceptionThrown') {
          console.log('[BROWSER EXCEPTION]', msg.params.exceptionDetails?.text, msg.params.exceptionDetails?.exception?.description);
        } else if (msg.method === 'Log.entryAdded') {
          console.log('[BROWSER LOG ENTRY]', msg.params.entry?.level, msg.params.entry?.text);
        }
      };

      setTimeout(() => {
        ws.close();
        proc.kill();
        process.exit(0);
      }, 5000);
    } else {
      console.log('No main tab found');
      proc.kill();
      process.exit(0);
    }
  } catch (err) {
    console.error('Error connecting to CDP:', err);
    proc.kill();
    process.exit(1);
  }
}, 2500);
