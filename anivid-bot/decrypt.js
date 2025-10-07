const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const keyHex = process.env.AES_KEY;
const key = Buffer.from(keyHex, 'hex');

const encFile = path.join(__dirname, 'anime.enc');
const [iv64, data64] = fs.readFileSync(encFile, 'utf8').split(':');
const iv = Buffer.from(iv64, 'base64');
const encrypted = Buffer.from(data64, 'base64');

const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

console.log('Decrypted data:', decrypted.toString());
