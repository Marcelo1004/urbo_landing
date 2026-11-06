async function checkOpenMapTiles() {
  const r = await fetch('https://tiles.openfreemap.org/styles/dark');
  const d = await r.json();
  console.log('openmaptiles source:', d.sources.openmaptiles);
  if (d.sources.openmaptiles.url) {
    const tj = await (await fetch(d.sources.openmaptiles.url)).json();
    console.log('TileJSON:', tj.tiles);
    const testTile = tj.tiles[0].replace('{z}', '15').replace('{x}', '10632').replace('{y}', '17921');
    const tr = await fetch(testTile);
    console.log('tr status:', tr.status, tr.headers.get('content-type'));
  }
}
checkOpenMapTiles();

