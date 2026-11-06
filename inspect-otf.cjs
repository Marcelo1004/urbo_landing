const fs = require('fs');

const fontBuf = fs.readFileSync('d:\\URBO\\sd-font-unpacked\\Sddystopiandemo-GO7xa.otf');
console.log('Font file size:', fontBuf.length);

// Check strings in font table (name table)
const str = fontBuf.toString('binary');
const names = [];
const matches = str.match(/[\x20-\x7E]{4,}/g) || [];
console.log('Sample strings in font:', matches.filter(s => s.toLowerCase().includes('dystopian') || s.toLowerCase().includes('sudezine')));

