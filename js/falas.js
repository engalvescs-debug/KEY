// Catálogo central de tudo o que o jogo fala. Cada frase pode ter um áudio
// gravado em audio/<slug>.mp3 (listado em audio/manifest.js); se não tiver,
// o Narrador usa a voz sintética do aparelho como reserva.

var FALAS = {
  menu: 'Oi! Eu sou a Lulu! O que vamos fazer hoje?',
  niveis: 'Escolha um nível para jogar!',
  historias: 'Escolha uma história para a gente ler juntinhos!',
  configuracoes: 'Aqui você deixa o jogo do seu jeitinho.',
  pareamento: 'Abra o endereço no celular e digite o código para conectar.',
  explorarVogais: 'Vamos conhecer as vogais! Toque em cada uma para ouvir.',
  explorarAlfabeto: 'Vamos conhecer o alfabeto! Toque em cada letra para ouvir.',
  explorarSilabas: 'Vamos conhecer as sílabas! Toque para ouvir o som.',
  encontreVogal: 'Encontre a vogal',
  encontreLetra: 'Encontre a letra',
  encontreSilaba: 'Encontre a sílaba',
  montarPalavra: 'Vamos montar a palavra',
  montarDica: 'Toque nas sílabas na ordem certa.',
  palavraMontada: 'Isso! Você montou a palavra!',
  historiaAcerto: 'Isso mesmo! Você entendeu a história!',
  nivelCompleto: 'Uhuu! Você completou este nível! Estou muito orgulhosa de você!',
  acertos: ['Isso! Muito bem!', 'Uau, você acertou!', 'Parabéns, que incrível!'],
  quase: ['Quase! Vamos tentar de novo?', 'Hmm, quase lá! Tenta outra vez.']
};

// Letras isoladas soam melhor escritas como se falam.
var NOME_LETRAS = {
  A: 'á', B: 'bê', C: 'cê', D: 'dê', E: 'é', F: 'éfe', G: 'gê', H: 'agá',
  I: 'i', J: 'jota', K: 'cá', L: 'éle', M: 'ême', N: 'êne', O: 'ó', P: 'pê',
  Q: 'quê', R: 'érre', S: 'ésse', T: 'tê', U: 'u', V: 'vê', W: 'dáblio',
  X: 'xis', Y: 'ípsilon', Z: 'zê'
};

var VOGAL_ABERTA = { A: 'á', E: 'é', I: 'i', O: 'ó', U: 'u' };

function sorteio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function slugFala(texto) {
  var base = String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (base.length <= 48) return base || 'fala';
  var h = 5381;
  for (var i = 0; i < texto.length; i++) h = ((h * 33) ^ texto.charCodeAt(i)) >>> 0;
  return base.slice(0, 40).replace(/-+$/, '') + '-' + h.toString(36);
}

// Texto que a voz deve pronunciar (difere do texto exibido para letras
// soltas e sílabas, que a voz sintética costuma soletrar errado).
function pronunciaFala(texto) {
  if (/^[A-Z]$/.test(texto)) return NOME_LETRAS[texto];
  var letraDe = /^([A-Z]) de (.+)$/.exec(texto);
  if (letraDe) return NOME_LETRAS[letraDe[1]] + ' de ' + letraDe[2];
  if (/^[BCDFGJLMNPRSTVZ][AEIOU]$/.test(texto)) {
    return texto[0].toLowerCase() + VOGAL_ABERTA[texto[1]];
  }
  return texto.toLowerCase();
}

// Lista completa de falas (usada pelo gerador de áudios em tools/).
function listarTodasFalas(conteudo) {
  var textos = [];
  Object.keys(FALAS).forEach(function (k) {
    textos = textos.concat(FALAS[k]);
  });
  conteudo.alfabeto.forEach(function (l) {
    textos.push(l.id, fraseLetra(l));
  });
  conteudo.silabas.forEach(function (g) { textos = textos.concat(g.itens); });
  conteudo.palavras.forEach(function (p) { textos.push(p.palavra); });
  conteudo.historias.forEach(function (h) {
    textos.push(h.titulo, h.pergunta.texto);
    h.paginas.forEach(function (pg) { textos = textos.concat(pg.texto, pg.destaques); });
  });
  var vistos = {};
  return textos.filter(function (t) {
    var s = slugFala(t);
    if (vistos[s]) return false;
    vistos[s] = true;
    return true;
  }).map(function (t) {
    return { texto: t, slug: slugFala(t), pronuncia: pronunciaFala(t) };
  });
}

function fraseLetra(item) {
  return item.id + ' de ' + item.palavra.toLowerCase();
}
