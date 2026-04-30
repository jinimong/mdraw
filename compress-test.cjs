const LZString = require('lz-string');
const base64hash = process.argv[2];
const original = Buffer.from(base64hash, 'base64').toString('utf-8');
const originalBytes = Buffer.byteLength(original, 'utf-8');
const base64Bytes = Buffer.byteLength(base64hash, 'utf-8');

const lzCompressed = LZString.compressToEncodedURIComponent(original);
const lzBytes = Buffer.byteLength('\u2301' + lzCompressed, 'utf-8');

const roundtrip = LZString.decompressFromEncodedURIComponent(lzCompressed);

console.log('=== 실제 압축 결과 ===');
console.log('원본 마크다운:       ' + originalBytes + ' bytes (' + (originalBytes/1024).toFixed(2) + ' KB)');
console.log('Base64 해시:         ' + base64Bytes + ' bytes → 원본 대비 ' + (base64Bytes/originalBytes*100).toFixed(1) + '%');
console.log('LZ-string 해시:      ' + lzBytes + ' bytes → 원본 대비 ' + (lzBytes/originalBytes*100).toFixed(1) + '%');
console.log('');
console.log('기존 전체 URL:       ' + (34 + base64Bytes) + ' bytes');
console.log('LZ-string 전체 URL:  ' + (34 + lzBytes) + ' bytes');
console.log('');
console.log('Base64 대비 절감:    ' + ((1 - lzBytes/base64Bytes)*100).toFixed(1) + '%');
console.log('라운드트립:          ' + (roundtrip === original ? '✅ 완벽 복원' : '❌ 불일치'));
