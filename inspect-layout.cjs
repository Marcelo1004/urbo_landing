const { execFile } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

execFile(edgePath, [
  '--headless=new',
  '--dump-dom',
  'http://localhost:3000'
], (err, stdout) => {
  if (err) return console.error(err);
  console.log('HTML preview (first 500 chars):');
  console.log(stdout.substring(0, 500));
  
  // Find all sections
  const sections = stdout.match(/<section[^>]*>/g);
  console.log('Found sections:', sections);
});

