// Atualiza audio/manifest.js com os slugs de todos os audio/*.mp3 existentes.
// Uso: node tools/gerar-manifest.js
const fs = require('fs');
const path = require('path');

const pasta = path.join(__dirname, '..', 'audio');
const slugs = fs.readdirSync(pasta).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();

fs.writeFileSync(
  path.join(pasta, 'manifest.js'),
  '// Gerado por tools/gerar-manifest.js — slugs das falas que têm áudio gravado.\n' +
  `var FALAS_GRAVADAS = ${JSON.stringify(slugs, null, 2)};\n`
);
console.log(`${slugs.length} áudios no manifest.`);
