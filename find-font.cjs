async function find() {
  const r = await fetch('https://www.fontspace.com/sd-dystopian-font-f109410', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await r.text();
  const regex = /href="([^"]*(?:download|get|fontspace|zip|otf|ttf)[^"]*)"/gi;
  let m;
  const links = new Set();
  while ((m = regex.exec(html)) !== null) {
    links.add(m[1]);
  }
  console.log('Found links:', Array.from(links));
}
find();

