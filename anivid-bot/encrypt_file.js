const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const keyHex = process.env.AES_KEY;
if (!keyHex) {
  console.error('Set AES_KEY env first.');
  process.exit(1);
}
if (keyHex.length !== 64) {
  console.error('AES_KEY must be 64 hex chars.');
  process.exit(1);
}
const key = Buffer.from(keyHex, 'hex');

const filePath = path.join(__dirname, 'anime.json');
const outPath = path.join(__dirname, 'anime.enc');

if (!fs.existsSync(filePath)) {
  console.error('anime.json not found');
  process.exit(1);
}

const plain = fs.readFileSync(filePath);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
// store as iv:encrypted (base64)
const out = iv.toString('base64') + ':' + encrypted.toString('base64');
fs.writeFileSync(outPath, out, 'utf8');
console.log('Encrypted ->', outPath);
