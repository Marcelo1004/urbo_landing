const fs = require('fs');

async function download() {
  const url = 'https://www.fontspace.com/get/family/oxno0';
  console.log('Downloading from', url);
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': 'https://www.fontspace.com/sd-dystopian-font-f109410'
    }
  });
  console.log('Status:', r.status, 'Content-Type:', r.headers.get('content-type'));
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync('d:\\URBO\\sd-dystopian.zip', buf);
  console.log('Saved bytes:', buf.length);
}
download();

