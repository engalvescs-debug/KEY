// Lista todas as falas do jogo (texto, slug do arquivo e pronúncia) em JSON.
// Uso: node tools/listar-falas.js > falas.json
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
for (const arquivo of ['js/data/content.js', 'js/data/historias.js', 'js/falas.js']) {
  vm.runInThisContext(fs.readFileSync(path.join(raiz, arquivo), 'utf8'), { filename: arquivo });
}

const lista = vm.runInThisContext('listarTodasFalas(CONTENT)');
const comGravacao = new Set(fs.readdirSync(path.join(raiz, 'audio')).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));
const faltando = process.argv.includes('--faltando');

console.log(JSON.stringify(faltando ? lista.filter(f => !comGravacao.has(f.slug)) : lista, null, 2));
