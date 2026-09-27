// Conteúdo pedagógico do jogo: vogais, alfabeto, sílabas e palavras.
// Cada item traz sempre: símbolo grande + emoji + palavra + cor consistente
// (suporte visual redundante ajuda crianças autistas e em fase de alfabetização).

const CONTENT = {
  vogais: [
    { id: 'A', emoji: '🐝', palavra: 'ABELHA', cor: '#FF6B6B' },
    { id: 'E', emoji: '🐘', palavra: 'ELEFANTE', cor: '#4ECDC4' },
    { id: 'I', emoji: '🏝️', palavra: 'ILHA', cor: '#FFD93D' },
    { id: 'O', emoji: '🥚', palavra: 'OVO', cor: '#6BCB77' },
    { id: 'U', emoji: '🍇', palavra: 'UVA', cor: '#A66DD4' }
  ],

  alfabeto: [
    { id: 'A', emoji: '🐝', palavra: 'ABELHA', cor: '#FF6B6B' },
    { id: 'B', emoji: '⚽', palavra: 'BOLA', cor: '#4D96FF' },
    { id: 'C', emoji: '🏠', palavra: 'CASA', cor: '#FF9F45' },
    { id: 'D', emoji: '🎲', palavra: 'DADO', cor: '#6BCB77' },
    { id: 'E', emoji: '🐘', palavra: 'ELEFANTE', cor: '#4ECDC4' },
    { id: 'F', emoji: '🚀', palavra: 'FOGUETE', cor: '#FF6B6B' },
    { id: 'G', emoji: '🐱', palavra: 'GATO', cor: '#FFD93D' },
    { id: 'H', emoji: '🚁', palavra: 'HELICÓPTERO', cor: '#4D96FF' },
    { id: 'I', emoji: '🏝️', palavra: 'ILHA', cor: '#A66DD4' },
    { id: 'J', emoji: '🐊', palavra: 'JACARÉ', cor: '#6BCB77' },
    { id: 'K', emoji: '🥝', palavra: 'KIWI', cor: '#FF9F45' },
    { id: 'L', emoji: '🌙', palavra: 'LUA', cor: '#4ECDC4' },
    { id: 'M', emoji: '🐒', palavra: 'MACACO', cor: '#FF6B6B' },
    { id: 'N', emoji: '🪺', palavra: 'NINHO', cor: '#6BCB77' },
    { id: 'O', emoji: '🥚', palavra: 'OVO', cor: '#FFD93D' },
    { id: 'P', emoji: '🦆', palavra: 'PATO', cor: '#4D96FF' },
    { id: 'Q', emoji: '🧀', palavra: 'QUEIJO', cor: '#FF9F45' },
    { id: 'R', emoji: '🐭', palavra: 'RATO', cor: '#A66DD4' },
    { id: 'S', emoji: '☀️', palavra: 'SOL', cor: '#FFD93D' },
    { id: 'T', emoji: '🐢', palavra: 'TARTARUGA', cor: '#6BCB77' },
    { id: 'U', emoji: '🍇', palavra: 'UVA', cor: '#A66DD4' },
    { id: 'V', emoji: '🐄', palavra: 'VACA', cor: '#4ECDC4' },
    { id: 'X', emoji: '☕', palavra: 'XÍCARA', cor: '#FF9F45' },
    { id: 'Z', emoji: '🦓', palavra: 'ZEBRA', cor: '#4D96FF' }
  ],

  // Sílabas simples (consoante + vogal), agrupadas por consoante.
  silabas: [
    { consoante: 'B', itens: ['BA', 'BE', 'BI', 'BO', 'BU'], cor: '#4D96FF' },
    { consoante: 'C', itens: ['CA', 'CE', 'CI', 'CO', 'CU'], cor: '#FF9F45' },
    { consoante: 'D', itens: ['DA', 'DE', 'DI', 'DO', 'DU'], cor: '#6BCB77' },
    { consoante: 'F', itens: ['FA', 'FE', 'FI', 'FO', 'FU'], cor: '#FF6B6B' },
    { consoante: 'G', itens: ['GA', 'GE', 'GI', 'GO', 'GU'], cor: '#FFD93D' },
    { consoante: 'L', itens: ['LA', 'LE', 'LI', 'LO', 'LU'], cor: '#4ECDC4' },
    { consoante: 'M', itens: ['MA', 'ME', 'MI', 'MO', 'MU'], cor: '#A66DD4' },
    { consoante: 'N', itens: ['NA', 'NE', 'NI', 'NO', 'NU'], cor: '#FF9F45' },
    { consoante: 'P', itens: ['PA', 'PE', 'PI', 'PO', 'PU'], cor: '#4D96FF' },
    { consoante: 'S', itens: ['SA', 'SE', 'SI', 'SO', 'SU'], cor: '#FFD93D' },
    { consoante: 'T', itens: ['TA', 'TE', 'TI', 'TO', 'TU'], cor: '#6BCB77' },
    { consoante: 'V', itens: ['VA', 'VE', 'VI', 'VO', 'VU'], cor: '#FF6B6B' }
  ],

  // Palavras montadas a partir de sílabas já aprendidas.
  palavras: [
    { palavra: 'BOLA', silabas: ['BO', 'LA'], emoji: '⚽', cor: '#4D96FF' },
    { palavra: 'CASA', silabas: ['CA', 'SA'], emoji: '🏠', cor: '#FF9F45' },
    { palavra: 'SAPO', silabas: ['SA', 'PO'], emoji: '🐸', cor: '#6BCB77' },
    { palavra: 'GATO', silabas: ['GA', 'TO'], emoji: '🐱', cor: '#FFD93D' },
    { palavra: 'MALA', silabas: ['MA', 'LA'], emoji: '🧳', cor: '#A66DD4' },
    { palavra: 'PATO', silabas: ['PA', 'TO'], emoji: '🦆', cor: '#4D96FF' },
    { palavra: 'DEDO', silabas: ['DE', 'DO'], emoji: '👆', cor: '#FF6B6B' },
    { palavra: 'FADA', silabas: ['FA', 'DA'], emoji: '🧚', cor: '#FFD93D' },
    { palavra: 'VELA', silabas: ['VE', 'LA'], emoji: '🕯️', cor: '#4ECDC4' },
    { palavra: 'NAVE', silabas: ['NA', 'VE'], emoji: '🛸', cor: '#6BCB77' },
    { palavra: 'RODA', silabas: ['RO', 'DA'], emoji: '🛞', cor: '#FF9F45' },
    { palavra: 'TATU', silabas: ['TA', 'TU'], emoji: '🦔', cor: '#A66DD4' }
  ],

  // Histórias curtas e interativas para o Modo História.
  historias: [
    {
      id: 'gatinho-lua',
      titulo: 'O Gatinho e a Lua',
      capa: '🐱🌙',
      cor: '#4D96FF',
      paginas: [
        {
          texto: 'Era uma vez um GATINHO que morava numa CASA pequena.',
          destaques: ['GATINHO', 'CASA'],
          emoji: '🐱🏠'
        },
        {
          texto: 'Toda noite, ele olhava pela janela e via a LUA brilhando.',
          destaques: ['LUA'],
          emoji: '🌙✨'
        },
        {
          texto: 'Um dia, o GATINHO decidiu subir no TELHADO para chegar mais perto da LUA.',
          destaques: ['GATINHO', 'TELHADO', 'LUA'],
          emoji: '🐱🏠🌙'
        },
        {
          texto: 'Ele não conseguiu tocar a LUA, mas descobriu que as ESTRELAS também eram lindas.',
          destaques: ['LUA', 'ESTRELAS'],
          emoji: '⭐🌟'
        },
        {
          texto: 'O GATINHO voltou feliz para CASA e dormiu sonhando com o céu.',
          destaques: ['GATINHO', 'CASA'],
          emoji: '🐱😴'
        }
      ],
      pergunta: {
        texto: 'O que o gatinho queria tocar?',
        opcoes: [
          { texto: 'A LUA', emoji: '🌙', correta: true },
          { texto: 'O SOL', emoji: '☀️', correta: false }
        ]
      }
    },
    {
      id: 'sapo-cantor',
      titulo: 'O Sapo Cantor',
      capa: '🐸🎵',
      cor: '#6BCB77',
      paginas: [
        {
          texto: 'No lago vivia um SAPO que adorava CANTAR.',
          destaques: ['SAPO', 'CANTAR'],
          emoji: '🐸🎤'
        },
        {
          texto: 'Todos os dias, o SAPO cantava para os PATOS e PEIXES.',
          destaques: ['SAPO', 'PATOS', 'PEIXES'],
          emoji: '🐸🦆🐟'
        },
        {
          texto: 'Um dia, o SAPO ficou rouco e não conseguiu CANTAR.',
          destaques: ['SAPO', 'CANTAR'],
          emoji: '🐸😢'
        },
        {
          texto: 'Os amigos trouxeram MEL com limão, e o SAPO ficou bom de novo.',
          destaques: ['MEL', 'SAPO'],
          emoji: '🍯🐸'
        },
        {
          texto: 'O SAPO agradeceu cantando a canção mais bonita de todas!',
          destaques: ['SAPO'],
          emoji: '🐸🎶'
        }
      ],
      pergunta: {
        texto: 'O que o sapo adorava fazer?',
        opcoes: [
          { texto: 'CANTAR', emoji: '🎤', correta: true },
          { texto: 'NADAR', emoji: '🏊', correta: false }
        ]
      }
    }
  ]
};
