async function testTiles() {
  const styles = [
    'https://tiles.openfreemap.org/styles/liberty',
    'https://tiles.openfreemap.org/styles/bright',
    'https://tiles.openfreemap.org/styles/dark',
  ];

  for (const s of styles) {
    try {
      const res = await fetch(s);
      const data = await res.json();
      console.log('Style:', s, 'Status:', res.status, 'Sources:', Object.keys(data.sources));
      // Look at tile urls
      const sourceKey = Object.keys(data.sources)[0];
      const source = data.sources[sourceKey];
      console.log('Source info:', source);
      if (source.url) {
        const tileJsonRes = await fetch(source.url);
        const tileJson = await tileJsonRes.json();
        console.log('TileJSON tiles:', tileJson.tiles);
        // Test fetching first tile for Santa Cruz (zoom 15, coords: -63.18212, -17.78329)
        // lon2tile = Math.floor((lon+180)/360 * 2^15)
        // -63.18212 -> (116.81788 / 360) * 32768 = 10632
        // lat2tile = Math.floor((1 - Math.log(Math.tan(lat*PI/180) + 1/Math.cos(lat*PI/180)) / PI) / 2 * 2^15) = 17921
        const testTileUrl = tileJson.tiles[0]
          .replace('{z}', '15')
          .replace('{x}', '10632')
          .replace('{y}', '17921');
        console.log('Testing tile fetch:', testTileUrl);
        const tileRes = await fetch(testTileUrl);
        console.log('Tile fetch status:', tileRes.status, 'Content-type:', tileRes.headers.get('content-type'), 'bytes:', (await tileRes.arrayBuffer()).byteLength);
      }
    } catch (e) {
      console.error('Error with style', s, e.message);
    }
  }
}

testTiles();

