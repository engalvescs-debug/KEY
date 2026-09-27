// Histórias do Modo História. Cada história tem:
//  - paginas: 'texto' (cena animada + narração), 'desafio' (letra, vogal ou
//    montar palavra com palavras da própria história) e 'musica' (karaokê).
//  - destaques escritos com as sílabas separadas (LO-BO): no texto a
//    palavra aparece inteira; ao tocar nela, a criança vê e ouve as sílabas.
//  - cena.a: atores [emoji ou personagem, x%, y%, tamanho, animação, opções]
//    opções: d = atraso da animação, f = filtro ('cinza', 'fogo'),
//    s = som ao tocar no ator.
//  - cancao: versos com sílabas separadas por '-' e as notas (MIDI) de cada
//    verso. A trilha de fundo da história é a melodia da própria canção.
// As histórias são recontadas sem sustos: ninguém é devorado nem se machuca.

CONTENT.historias = [
  {
    id: 'tres-porquinhos',
    titulo: 'Os Três Porquinhos',
    grupo: 'classicos',
    capa: '🐷🐷🐷',
    cor: '#FF7EB6',
    tema: { bpm: 120, baixo: [48, 43, 45, 41, 48, 43, 41, 48] },
    cancao: {
      titulo: 'A canção dos porquinhos',
      versos: ['Três por-qui-nhos, lá, lá, lá,', 'ca-sa for-te vão mon-tar!', 'Lo-bo bo-bo so-pra, fu, fu!', 'Nós não te-mos me-do, não!'],
      notas: [[60, 64, 64, 67, 69, 67, 64], [62, 65, 65, 69, 71, 69, 67], [67, 67, 64, 64, 65, 65, 72, 72], [67, 69, 67, 65, 64, 62, 60]]
    },
    paginas: [
      { t: 'texto', texto: 'Era uma vez três PORQUINHOS irmãos que queriam construir suas CASAS.', d: ['POR-QUI-NHOS', 'CA-SAS'], som: 'passaros',
        cena: { f: 'campo', a: [['🐷', 25, 68, 8, 'pular'], ['🐷', 45, 68, 8, 'pular', { d: 0.2 }], ['🐷', 65, 68, 8, 'pular', { d: 0.4 }], ['☀️', 86, 18, 7, 'girar-lento']] } },
      { t: 'texto', texto: 'O primeiro fez uma casa de PALHA, bem rapidinho.', d: ['PA-LHA'], som: 'martelo',
        cena: { f: 'campo', a: [['🐷', 28, 68, 8, 'pular'], ['🌾', 52, 66, 9, 'balancar'], ['🏠', 76, 58, 12, 'aparecer']] } },
      { t: 'texto', texto: 'O segundo fez uma casa de MADEIRA, e o terceiro, uma casa de TIJOLO.', d: ['MA-DEI-RA', 'TI-JO-LO'], som: 'martelo',
        cena: { f: 'campo', a: [['🌳', 18, 55, 11, 'balancar'], ['🏡', 42, 58, 11, 'aparecer'], ['🧱', 66, 66, 8, 'aparecer', { d: 0.4 }], ['🐷', 86, 70, 7, 'pular']] } },
      { t: 'desafio', modo: 'vogal', palavra: 'CASA', emoji: '🏠' },
      { t: 'texto', texto: 'Então chegou o LOBO, fazendo cara feia e querendo entrar.', d: ['LO-BO'], som: 'uivo',
        cena: { f: 'floresta', a: [['🐺', 22, 62, 10, 'andar', { s: 'uivo' }], ['🐷', 70, 68, 8, 'tremer'], ['🏠', 84, 56, 10]] } },
      { t: 'texto', texto: 'O lobo SOPROU a casa de palha: fuuu! E a palha saiu voando!', d: ['SO-PROU'], som: 'vento',
        cena: { f: 'campo', a: [['🐺', 18, 60, 10, 'soprar', { s: 'uivo' }], ['💨', 38, 58, 8, 'vento'], ['🌾', 62, 50, 8, 'voar'], ['🐷', 82, 68, 7, 'correr']] } },
      { t: 'texto', texto: 'Os porquinhos correram para a casa de TIJOLO. O lobo soprou, soprou... e nada!', d: ['TI-JO-LO'], som: 'vento',
        cena: { f: 'campo', a: [['🐺', 16, 60, 10, 'soprar'], ['💨', 34, 58, 7, 'vento'], ['🏠', 66, 54, 14], ['🐷', 58, 74, 5, 'pular'], ['🐷', 67, 74, 5, 'pular', { d: 0.2 }], ['🐷', 76, 74, 5, 'pular', { d: 0.4 }]] } },
      { t: 'desafio', modo: 'letra', palavra: 'LOBO', emoji: '🐺' },
      { t: 'texto', texto: 'Cansado, o lobo foi embora, e os porquinhos fizeram uma grande FESTA!', d: ['FES-TA'], som: 'magia',
        cena: { f: 'campo', p: 'coracoes', a: [['🐺', 12, 64, 7, 'correr'], ['🐷', 42, 68, 8, 'pular'], ['🐷', 58, 68, 8, 'pular', { d: 0.2 }], ['🐷', 74, 68, 8, 'pular', { d: 0.4 }], ['🎉', 58, 28, 8, 'girar']] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'PALHA', silabas: ['PA', 'LHA'], emoji: '🌾' }
    ],
    pergunta: {
      texto: 'Qual casa o lobo não conseguiu derrubar?',
      opcoes: [{ texto: 'TIJOLO', emoji: '🧱', correta: true }, { texto: 'PALHA', emoji: '🌾', correta: false }]
    }
  },

  {
    id: 'chapeuzinho',
    titulo: 'Chapeuzinho Vermelho',
    grupo: 'classicos',
    capa: '👧🧺🐺',
    cor: '#FF6B6B',
    tema: { bpm: 108, baixo: [43, 48, 43, 50, 43, 48, 50, 43] },
    cancao: {
      titulo: 'Caminho da floresta',
      versos: ['No ca-mi-nho da flo-res-ta,', 'vou can-tan-do sem pa-rar,', 'le-vo do-ces pra vo-vó,', 'tra-lá-lá, tra-lá-lá!'],
      notas: [[67, 69, 71, 71, 72, 71, 69, 67], [67, 69, 71, 74, 72, 71, 69], [66, 67, 69, 71, 72, 69, 67], [74, 72, 71, 74, 72, 67]]
    },
    paginas: [
      { t: 'texto', texto: 'Chapeuzinho Vermelho ia visitar a VOVÓ, levando uma CESTA de doces.', d: ['VO-VÓ', 'CES-TA'], som: 'passaros',
        cena: { f: 'floresta', a: [['👧', 25, 62, 10, 'andar'], ['🧺', 36, 72, 5, 'balancar'], ['🌳', 72, 50, 13, 'balancar'], ['🌸', 88, 76, 5, 'balancar']] } },
      { t: 'texto', texto: 'No caminho, ela colheu FLORES coloridas e cantou com os PÁSSAROS.', d: ['FLO-RES', 'PÁS-SA-ROS'], som: 'passaros',
        cena: { f: 'campo', a: [['👧', 28, 62, 10, 'pular'], ['🌷', 50, 74, 6, 'balancar'], ['🌼', 62, 76, 6, 'balancar', { d: 0.3 }], ['🐦', 72, 25, 6, 'voar', { s: 'passaros' }], ['🐦', 84, 36, 5, 'voar', { d: 0.5, s: 'passaros' }]] } },
      { t: 'desafio', modo: 'vogal', palavra: 'VOVÓ', emoji: '👵' },
      { t: 'texto', texto: 'Na floresta apareceu o LOBO, que perguntou: aonde você vai, menina?', d: ['LO-BO'], som: 'passos',
        cena: { f: 'floresta', a: [['👧', 30, 62, 10, 'balancar'], ['🐺', 64, 60, 10, 'balancar', { s: 'uivo' }], ['🌳', 88, 50, 12]] } },
      { t: 'texto', texto: 'O lobo correu na frente. Mas a vovó, bem esperta, se escondeu no ARMÁRIO!', d: ['AR-MÁ-RIO'], som: 'porta',
        cena: { f: 'casa', a: [['🐺', 24, 62, 9, 'correr'], ['🚪', 70, 56, 12], ['👵', 70, 58, 6, 'piscar']] } },
      { t: 'texto', texto: 'Chapeuzinho bateu na porta: toc, toc! Que OLHOS grandes você tem, vovó!', d: ['O-LHOS'], som: 'porta',
        cena: { f: 'casa', a: [['👧', 24, 62, 10, 'balancar'], ['🛏️', 66, 64, 13], ['🐺', 66, 50, 7, 'balancar', { s: 'uivo' }], ['👀', 46, 28, 6, 'piscar']] } },
      { t: 'desafio', modo: 'letra', palavra: 'OLHOS', emoji: '👀' },
      { t: 'texto', texto: 'Nessa hora chegou o LENHADOR, e o lobo fugiu correndo para bem longe!', d: ['LE-NHA-DOR'], som: 'passos',
        cena: { f: 'floresta', a: [['👨', 22, 62, 10, 'andar'], ['🌲', 48, 52, 11], ['🐺', 76, 62, 9, 'correr']] } },
      { t: 'texto', texto: 'A vovó saiu do armário, e os três comeram os DOCES juntinhos. Que alegria!', d: ['DO-CES'], som: 'magia',
        cena: { f: 'casa', p: 'coracoes', a: [['👵', 34, 62, 10, 'pular'], ['👧', 56, 62, 10, 'pular', { d: 0.3 }], ['👨', 76, 62, 9, 'balancar'], ['🍰', 45, 78, 6, 'balancar']] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'CESTA', silabas: ['CES', 'TA'], emoji: '🧺' }
    ],
    pergunta: {
      texto: 'Onde a vovó se escondeu?',
      opcoes: [{ texto: 'ARMÁRIO', emoji: '🚪', correta: true }, { texto: 'JARDIM', emoji: '🌷', correta: false }]
    }
  },

  {
    id: 'branca-de-neve',
    titulo: 'Branca de Neve',
    grupo: 'classicos',
    capa: '👸🍎',
    cor: '#A66DD4',
    tema: { bpm: 92, baixo: [41, 48, 46, 41, 41, 46, 48, 41] },
    cancao: {
      titulo: 'Sete amigos',
      versos: ['Se-te a-mi-gos pe-que-ni-nos,', 'tra-ba-lhan-do com a-le-gri-a,', 'can-tam jun-to com a prin-ce-sa,', 'lá na flo-res-ta to-do di-a!'],
      notas: [[65, 69, 72, 72, 70, 69, 67, 69, 65], [65, 67, 69, 70, 72, 74, 72, 70, 69], [72, 72, 70, 69, 67, 69, 70, 69, 67], [65, 67, 69, 72, 70, 69, 67, 65, 65]]
    },
    paginas: [
      { t: 'texto', texto: 'Branca de Neve era uma PRINCESA gentil, que adorava os ANIMAIS.', d: ['PRIN-CE-SA', 'A-NI-MAIS'], som: 'passaros',
        cena: { f: 'castelo', a: [['🏰', 76, 44, 14], ['👸', 36, 62, 10, 'balancar'], ['🐰', 20, 74, 5, 'pular'], ['🐦', 52, 24, 5, 'voar', { s: 'passaros' }]] } },
      { t: 'texto', texto: 'A rainha tinha um ESPELHO mágico e ficou com ciúmes da princesa.', d: ['ES-PE-LHO'], som: 'magia',
        cena: { f: 'castelo', p: 'faiscas', a: [['👑', 30, 40, 8, 'girar-lento'], ['🔮', 60, 52, 11, 'brilhar']] } },
      { t: 'texto', texto: 'Branca de Neve foi para a FLORESTA e encontrou uma casinha pequenina.', d: ['FLO-RES-TA'], som: 'passos',
        cena: { f: 'floresta', a: [['👸', 22, 62, 9, 'andar'], ['🌲', 48, 50, 12], ['🌲', 60, 48, 10], ['🏠', 82, 58, 10, 'aparecer']] } },
      { t: 'desafio', modo: 'vogal', palavra: 'MAÇÃ', emoji: '🍎' },
      { t: 'texto', texto: 'Lá moravam SETE anões, que trabalhavam cantando o dia inteiro.', d: ['SE-TE'], som: 'martelo',
        cena: { f: 'floresta', a: [['🧔', 14, 68, 5, 'pular'], ['🧔', 26, 68, 5, 'pular', { d: 0.15 }], ['🧔', 38, 68, 5, 'pular', { d: 0.3 }], ['🧔', 50, 68, 5, 'pular', { d: 0.45 }], ['🧔', 62, 68, 5, 'pular', { d: 0.6 }], ['🧔', 74, 68, 5, 'pular', { d: 0.75 }], ['🧔', 86, 68, 5, 'pular', { d: 0.9 }]] } },
      { t: 'texto', texto: 'A rainha, disfarçada, deu a ela uma MAÇÃ encantada, e a princesa dormiu.', d: ['MA-ÇÃ'], som: 'crocante',
        cena: { f: 'casa', a: [['👵', 22, 62, 9, 'balancar'], ['🍎', 46, 60, 7, 'brilhar'], ['👸', 74, 70, 9, 'dormir'], ['💤', 82, 46, 5, 'flutuar']] } },
      { t: 'desafio', modo: 'letra', palavra: 'SETE', emoji: '7️⃣' },
      { t: 'texto', texto: 'Os anões e os animais cuidaram dela, e um PRÍNCIPE amigo chegou.', d: ['PRÍN-CI-PE'], som: 'sino',
        cena: { f: 'floresta', a: [['🤴', 20, 62, 10, 'andar'], ['👸', 58, 70, 9, 'dormir'], ['🐰', 80, 74, 5, 'pular'], ['🐦', 70, 28, 5, 'voar', { s: 'passaros' }]] } },
      { t: 'texto', texto: 'Com tanto carinho, a princesa ACORDOU! Todos fizeram uma festa na floresta.', d: ['A-COR-DOU'], som: 'magia',
        cena: { f: 'floresta', p: 'coracoes', a: [['👸', 38, 62, 10, 'pular'], ['🤴', 56, 62, 10, 'pular', { d: 0.3 }], ['🧔', 76, 68, 6, 'pular', { d: 0.5 }], ['🐰', 20, 74, 5, 'pular']] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'SETE', silabas: ['SE', 'TE'], emoji: '7️⃣' }
    ],
    pergunta: {
      texto: 'Quantos anões moravam na casinha?',
      opcoes: [{ texto: 'SETE', emoji: '7️⃣', correta: true }, { texto: 'DOIS', emoji: '2️⃣', correta: false }]
    }
  },

  {
    id: 'patinho-feio',
    titulo: 'O Patinho Feio',
    grupo: 'classicos',
    capa: '🐣🦢',
    cor: '#4ECDC4',
    tema: { bpm: 88, baixo: [45, 40, 41, 43, 48, 43, 41, 48] },
    cancao: {
      titulo: 'Patinho diferente',
      versos: ['Pa-ti-nho di-fe-ren-te,', 'na-da no la-go so-zi-nho,', 'cres-ce, cres-ce de re-pen-te,', 'vi-ra cis-ne, que bo-ni-to!'],
      notas: [[69, 72, 71, 69, 67, 69, 64], [64, 65, 67, 69, 71, 69, 67, 69], [72, 71, 72, 71, 69, 71, 72, 74], [76, 74, 72, 71, 72, 74, 72, 72]]
    },
    paginas: [
      { t: 'texto', texto: 'Na beira do LAGO, a mamãe PATA chocava seus ovos com muito carinho.', d: ['LA-GO', 'PA-TA'], som: 'passaros',
        cena: { f: 'lago', a: [['🦆', 45, 58, 11, 'balancar', { s: 'quack' }], ['🥚', 34, 76, 5, 'tremer'], ['🥚', 46, 78, 5, 'tremer', { d: 0.2 }], ['🥚', 58, 76, 5, 'tremer', { d: 0.4 }]] } },
      { t: 'texto', texto: 'Crac, crac! Nasceram os patinhos. Mas um deles era grande e CINZENTO.', d: ['CIN-ZEN-TO'], som: 'quack',
        cena: { f: 'lago', a: [['🐥', 26, 72, 6, 'pular', { s: 'quack' }], ['🐥', 38, 72, 6, 'pular', { d: 0.2, s: 'quack' }], ['🐤', 50, 72, 6, 'pular', { d: 0.4 }], ['🐥', 70, 68, 9, 'balancar', { f: 'cinza' }]] } },
      { t: 'desafio', modo: 'vogal', palavra: 'PATA', emoji: '🦆' },
      { t: 'texto', texto: 'Os outros bichos riam dele. O patinho ficou TRISTE e foi embora.', d: ['TRIS-TE'],
        cena: { f: 'lago', a: [['🐥', 44, 70, 8, 'andar', { f: 'cinza' }], ['💧', 50, 52, 3, 'cair']] } },
      { t: 'texto', texto: 'Ele passou o INVERNO sozinho, escondido no meio do mato.', d: ['IN-VER-NO'], som: 'vento',
        cena: { f: 'neve', p: 'neve', a: [['🐥', 44, 72, 7, 'tremer', { f: 'cinza' }], ['🌾', 62, 72, 7, 'balancar']] } },
      { t: 'texto', texto: 'Quando chegou a PRIMAVERA, ele viu seu reflexo na água e levou um susto bom.', d: ['PRI-MA-VE-RA'], som: 'magia',
        cena: { f: 'lago', p: 'faiscas', a: [['🌸', 18, 32, 6, 'flutuar'], ['🌼', 82, 32, 6, 'flutuar', { d: 0.5 }], ['🦢', 50, 60, 12, 'crescer']] } },
      { t: 'texto', texto: 'Ele tinha virado um lindo CISNE! Os outros cisnes chamaram: vem nadar com a gente!', d: ['CIS-NE'], som: 'agua',
        cena: { f: 'lago', a: [['🦢', 28, 62, 10, 'nadar'], ['🦢', 54, 62, 9, 'nadar', { d: 0.4 }], ['🦢', 78, 62, 9, 'nadar', { d: 0.8 }]] } },
      { t: 'desafio', modo: 'letra', palavra: 'CISNE', emoji: '🦢' },
      { t: 'texto', texto: 'Cada um é especial do seu jeito. Ser DIFERENTE é lindo!', d: ['DI-FE-REN-TE'], som: 'magia',
        cena: { f: 'lago', p: 'coracoes', a: [['🦢', 50, 58, 12, 'balancar'], ['🐥', 26, 72, 5, 'pular'], ['🐥', 76, 72, 5, 'pular', { d: 0.3 }]] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'LAGO', silabas: ['LA', 'GO'], emoji: '🏞️' }
    ],
    pergunta: {
      texto: 'Em que o patinho se transformou?',
      opcoes: [{ texto: 'CISNE', emoji: '🦢', correta: true }, { texto: 'GALINHA', emoji: '🐔', correta: false }]
    }
  },

  {
    id: 'gatinho-lua',
    titulo: 'O Gatinho e a Lua',
    grupo: 'classicos',
    capa: '🐱🌙',
    cor: '#4D96FF',
    tema: { bpm: 76, baixo: [48, 41, 43, 48, 45, 41, 43, 48] },
    cancao: {
      titulo: 'Canção de ninar da lua',
      versos: ['Lu-a, lu-a, lá no céu,', 'bri-lha pa-ra o ga-ti-nho,', 'e-le so-nha bem bai-xi-nho,', 'mi-au, mi-au, bo-a noi-te!'],
      notas: [[67, 64, 67, 64, 69, 67, 64], [65, 64, 62, 64, 65, 67, 65, 64], [67, 69, 71, 72, 71, 69, 67, 65], [72, 67, 72, 67, 65, 64, 62, 60]]
    },
    paginas: [
      { t: 'texto', texto: 'Era uma vez um GATINHO que morava numa CASA pequena.', d: ['GA-TI-NHO', 'CA-SA'], som: 'miau',
        cena: { f: 'campo', a: [['🐱', 38, 66, 9, 'balancar', { s: 'miau' }], ['🏠', 70, 54, 13]] } },
      { t: 'texto', texto: 'Toda noite, ele olhava pela janela e via a LUA brilhando.', d: ['LU-A'], som: 'grilos',
        cena: { f: 'noite', p: 'estrelas', a: [['🐱', 34, 70, 8, 'balancar', { s: 'miau' }], ['🌕', 72, 26, 11, 'brilhar']] } },
      { t: 'desafio', modo: 'vogal', palavra: 'LUA', emoji: '🌙' },
      { t: 'texto', texto: 'Um dia, o gatinho decidiu subir no TELHADO para chegar mais perto da lua.', d: ['TE-LHA-DO'], som: 'pulo',
        cena: { f: 'noite', p: 'estrelas', a: [['🏠', 48, 64, 14], ['🐱', 48, 36, 7, 'pular', { s: 'miau' }], ['🌕', 82, 18, 9, 'brilhar']] } },
      { t: 'texto', texto: 'Ele não conseguiu tocar a lua, mas descobriu que as ESTRELAS também eram lindas.', d: ['ES-TRE-LAS'], som: 'magia',
        cena: { f: 'noite', p: 'estrelas', a: [['🐱', 40, 66, 9, 'balancar'], ['⭐', 22, 26, 6, 'brilhar'], ['🌟', 60, 20, 7, 'brilhar', { d: 0.4 }], ['⭐', 82, 32, 5, 'brilhar', { d: 0.8 }]] } },
      { t: 'desafio', modo: 'letra', palavra: 'GATINHO', emoji: '🐱' },
      { t: 'texto', texto: 'O gatinho voltou feliz para casa e DORMIU sonhando com o céu.', d: ['DOR-MIU'], som: 'sino',
        cena: { f: 'casa', p: 'estrelas', a: [['🐱', 50, 70, 10, 'dormir'], ['💤', 60, 48, 5, 'flutuar']] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'LUA', silabas: ['LU', 'A'], emoji: '🌙' }
    ],
    pergunta: {
      texto: 'O que o gatinho queria tocar?',
      opcoes: [{ texto: 'A LUA', emoji: '🌙', correta: true }, { texto: 'O SOL', emoji: '☀️', correta: false }]
    }
  },

  {
    id: 'sapo-cantor',
    titulo: 'O Sapo Cantor',
    grupo: 'classicos',
    capa: '🐸🎵',
    cor: '#6BCB77',
    tema: { bpm: 116, baixo: [48, 43, 43, 48, 48, 41, 43, 48] },
    cancao: {
      // Cantiga popular brasileira (domínio público).
      titulo: 'O sapo não lava o pé',
      versos: ['O sa-po não la-va o pé,', 'não la-va por-que não quer,', 'e-le mo-ra lá na la-go-a,', 'não la-va o pé por-que não quer!'],
      notas: [[67, 64, 64, 64, 62, 60, 62, 64], [64, 62, 62, 62, 60, 59, 60], [67, 67, 69, 67, 65, 64, 65, 67, 64], [64, 62, 62, 62, 64, 62, 60, 59, 60]]
    },
    paginas: [
      { t: 'texto', texto: 'No lago vivia um SAPO que adorava CANTAR.', d: ['SA-PO', 'CAN-TAR'], som: 'sapo',
        cena: { f: 'lago', a: [['🐸', 44, 64, 10, 'pular', { s: 'sapo' }], ['🎵', 62, 36, 5, 'flutuar']] } },
      { t: 'texto', texto: 'Todos os dias, o sapo cantava para os PATOS e PEIXES.', d: ['PA-TOS', 'PEI-XES'], som: 'quack',
        cena: { f: 'lago', a: [['🐸', 28, 64, 9, 'balancar', { s: 'sapo' }], ['🦆', 54, 62, 8, 'nadar', { s: 'quack' }], ['🐟', 76, 74, 5, 'pular']] } },
      { t: 'desafio', modo: 'vogal', palavra: 'SAPO', emoji: '🐸' },
      { t: 'texto', texto: 'Um dia, o sapo ficou ROUCO e não conseguiu cantar.', d: ['ROU-CO'],
        cena: { f: 'lago', a: [['🐸', 44, 64, 9, 'tremer'], ['🤧', 62, 42, 5, 'flutuar']] } },
      { t: 'texto', texto: 'Os amigos trouxeram MEL com limão, e o sapo ficou bom de novo.', d: ['MEL'], som: 'magia',
        cena: { f: 'lago', a: [['🍯', 32, 62, 7, 'balancar'], ['🍋', 48, 64, 6, 'balancar', { d: 0.3 }], ['🐸', 70, 64, 9, 'pular', { s: 'sapo' }]] } },
      { t: 'desafio', modo: 'letra', palavra: 'MEL', emoji: '🍯' },
      { t: 'texto', texto: 'O sapo agradeceu cantando a CANÇÃO mais bonita de todas!', d: ['CAN-ÇÃO'], som: 'sapo',
        cena: { f: 'lago', p: 'coracoes', a: [['🐸', 44, 62, 10, 'pular', { s: 'sapo' }], ['🎶', 64, 32, 6, 'flutuar'], ['🦆', 80, 64, 6, 'nadar', { s: 'quack' }]] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'PATO', silabas: ['PA', 'TO'], emoji: '🦆' }
    ],
    pergunta: {
      texto: 'O que o sapo adorava fazer?',
      opcoes: [{ texto: 'CANTAR', emoji: '🎤', correta: true }, { texto: 'NADAR', emoji: '🏊', correta: false }]
    }
  },

  {
    id: 'saci',
    titulo: 'Saci Pererê',
    grupo: 'folclore',
    capa: '🌪️👣',
    cor: '#F4722B',
    tema: { bpm: 126, baixo: [50, 48, 50, 45, 50, 48, 45, 50] },
    cancao: {
      titulo: 'Pula, Saci!',
      versos: ['Sa-ci pu-la num pé só,', 'gor-ro ver-me-lho, que le-gal!', 'Gi-ra, gi-ra, re-de-mo-i-nho,', 'fi-u, fi-u, lá vai o Sa-ci!'],
      notas: [[62, 66, 69, 66, 69, 72, 74], [74, 72, 69, 72, 69, 66, 67, 69], [69, 74, 69, 74, 72, 71, 69, 67, 66], [81, 78, 81, 78, 74, 72, 69, 66, 62]]
    },
    paginas: [
      { t: 'texto', texto: 'Nas matas do Brasil vive o SACI, um menino arteiro que pula numa perna só.', d: ['SA-CI'], som: 'risada',
        cena: { f: 'floresta', a: [['@saci', 48, 56, 13, 'pular', { s: 'risada' }], ['🌳', 14, 50, 12], ['🌳', 86, 50, 12]] } },
      { t: 'texto', texto: 'Ele usa um GORRO vermelho mágico e aparece dentro de um REDEMOINHO.', d: ['GOR-RO', 'RE-DE-MO-I-NHO'], som: 'redemoinho',
        cena: { f: 'campo', p: 'folhas', a: [['🌪️', 48, 54, 15, 'girar-lento'], ['@saci', 48, 54, 8, 'girar', { s: 'risada' }]] } },
      { t: 'desafio', modo: 'vogal', palavra: 'SACI', emoji: '🌪️' },
      { t: 'texto', texto: 'O Saci adora fazer TRAVESSURAS: esconde as coisas e dá nó na crina dos cavalos!', d: ['TRA-VES-SU-RAS'], som: 'risada',
        cena: { f: 'campo', a: [['🐴', 64, 58, 12, 'balancar'], ['@saci', 30, 60, 9, 'pular', { s: 'risada' }], ['🧦', 18, 30, 5, 'voar']] } },
      { t: 'texto', texto: 'Quando ele passa, a gente ouve um ASSOBIO: fiu, fiu!', d: ['AS-SO-BI-O'], som: 'assobio',
        cena: { f: 'floresta', a: [['@saci', 46, 56, 11, 'balancar', { s: 'assobio' }], ['🎵', 64, 34, 5, 'flutuar'], ['🎶', 76, 28, 5, 'flutuar', { d: 0.5 }]] } },
      { t: 'texto', texto: 'Um menino chamado Pedro fez amizade com o Saci e dividiu seu PÃO de queijo.', d: ['PÃO'], som: 'magia',
        cena: { f: 'campo', a: [['🧒', 30, 62, 10, 'balancar'], ['@saci', 68, 58, 10, 'pular', { s: 'risada' }], ['🍞', 49, 52, 5, 'flutuar']] } },
      { t: 'desafio', modo: 'letra', palavra: 'GORRO', emoji: '🔴' },
      { t: 'texto', texto: 'Desde então, o Saci ajuda a cuidar da MATA, sempre pulando e rindo.', d: ['MA-TA'], som: 'passaros',
        cena: { f: 'floresta', a: [['@saci', 50, 56, 11, 'pular', { s: 'risada' }], ['🦜', 24, 28, 6, 'voar', { s: 'passaros' }], ['🐒', 80, 56, 8, 'balancar']] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'SACI', silabas: ['SA', 'CI'], emoji: '🌪️' }
    ],
    pergunta: {
      texto: 'Com quantas pernas o Saci pula?',
      opcoes: [{ texto: 'UMA', emoji: '1️⃣', correta: true }, { texto: 'DUAS', emoji: '2️⃣', correta: false }]
    }
  },

  {
    id: 'curupira',
    titulo: 'Curupira',
    grupo: 'folclore',
    capa: '🔥👣🌳',
    cor: '#3BA55C',
    tema: { bpm: 100, baixo: [40, 43, 45, 47, 40, 43, 47, 40] },
    cancao: {
      titulo: 'Guardião da mata',
      versos: ['Cu-ru-pi-ra, pro-te-tor,', 'pés pra trás, ca-be-lo em fo-go,', 'cui-da da ma-ta com a-mor,', 'va-mos a-ju-dar tam-bém!'],
      notas: [[64, 67, 69, 71, 69, 67, 64], [71, 71, 74, 71, 69, 67, 69, 67, 64], [64, 67, 69, 71, 74, 71, 69, 67], [67, 69, 71, 74, 71, 67, 64]]
    },
    paginas: [
      { t: 'texto', texto: 'Na floresta vive o CURUPIRA, o guardião das matas, de cabelo cor de FOGO.', d: ['CU-RU-PI-RA', 'FO-GO'], som: 'passaros',
        cena: { f: 'floresta', a: [['@curupira', 50, 56, 13, 'balancar'], ['🌳', 14, 50, 12], ['🌳', 86, 50, 12]] } },
      { t: 'texto', texto: 'Os PÉS do Curupira são virados para trás! Assim ninguém sabe para onde ele foi.', d: ['PÉS'], som: 'passos',
        cena: { f: 'floresta', a: [['👣', 26, 78, 6, 'piscar'], ['👣', 42, 74, 6, 'piscar', { d: 0.4 }], ['👣', 58, 78, 6, 'piscar', { d: 0.8 }], ['@curupira', 80, 56, 10, 'andar']] } },
      { t: 'desafio', modo: 'vogal', palavra: 'FOGO', emoji: '🔥' },
      { t: 'texto', texto: 'Ele protege os ANIMAIS: a onça, o macaco, a arara e o sapo.', d: ['A-NI-MAIS'], som: 'passaros',
        cena: { f: 'floresta', a: [['🐆', 18, 64, 9, 'balancar'], ['🐒', 40, 56, 8, 'pular'], ['🦜', 62, 28, 6, 'voar', { s: 'passaros' }], ['🐸', 82, 72, 6, 'pular', { s: 'sapo' }]] } },
      { t: 'texto', texto: 'Quem quer machucar a mata ouve o Curupira ASSOBIAR e fica dando voltas, perdido.', d: ['AS-SO-BI-AR'], som: 'assobio',
        cena: { f: 'floresta', a: [['@curupira', 40, 56, 10, 'balancar', { s: 'assobio' }], ['🌀', 70, 46, 9, 'girar'], ['🎵', 55, 30, 5, 'flutuar']] } },
      { t: 'texto', texto: 'Mas com quem cuida da natureza, ele é AMIGO e mostra o caminho de volta.', d: ['A-MI-GO'], som: 'magia',
        cena: { f: 'floresta', a: [['🧒', 28, 62, 10, 'andar'], ['@curupira', 66, 56, 10, 'balancar'], ['🌟', 47, 26, 6, 'brilhar']] } },
      { t: 'desafio', modo: 'letra', palavra: 'MATA', emoji: '🌳' },
      { t: 'texto', texto: 'Vamos ajudar o Curupira: nada de LIXO na floresta, e muito cuidado com as árvores!', d: ['LI-XO'], som: 'passaros',
        cena: { f: 'floresta', p: 'folhas', a: [['🗑️', 28, 66, 8, 'balancar'], ['🌱', 52, 74, 6, 'crescer'], ['🌳', 76, 50, 13, 'balancar']] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'MATA', silabas: ['MA', 'TA'], emoji: '🌳' }
    ],
    pergunta: {
      texto: 'Para que lado ficam virados os pés do Curupira?',
      opcoes: [{ texto: 'PARA TRÁS', emoji: '⬅️', correta: true }, { texto: 'PARA FRENTE', emoji: '➡️', correta: false }]
    }
  },

  {
    id: 'iara',
    titulo: 'Iara, a Mãe d\'Água',
    grupo: 'folclore',
    capa: '🧜🌊',
    cor: '#2E86DE',
    tema: { bpm: 84, baixo: [50, 45, 47, 43, 50, 45, 43, 50] },
    cancao: {
      titulo: 'Canto da Iara',
      versos: ['Na bei-ra do ri-o,', 'I-a-ra vem can-tar,', 'a á-gua faz plim, plim,', 'e os pei-xes vêm dan-çar!'],
      notas: [[62, 66, 69, 74, 73, 71], [69, 71, 73, 74, 76, 74], [74, 73, 71, 69, 81, 81], [66, 67, 69, 71, 73, 74, 74]]
    },
    paginas: [
      { t: 'texto', texto: 'No fundo do RIO Amazonas mora a IARA, uma sereia de cabelos compridos.', d: ['RI-O', 'I-A-RA'], som: 'agua',
        cena: { f: 'rio', p: 'bolhas', a: [['🧜', 50, 52, 12, 'nadar'], ['🐟', 20, 72, 5, 'nadar', { d: 0.3 }], ['🐠', 80, 74, 5, 'nadar', { d: 0.6 }]] } },
      { t: 'texto', texto: 'A Iara tem uma voz linda e CANTA para os peixes dançarem.', d: ['CAN-TA'], som: 'magia',
        cena: { f: 'rio', p: 'bolhas', a: [['🧜', 44, 52, 11, 'balancar'], ['🎶', 62, 28, 6, 'flutuar'], ['🐟', 24, 72, 5, 'pular'], ['🐠', 76, 72, 5, 'pular', { d: 0.3 }]] } },
      { t: 'desafio', modo: 'vogal', palavra: 'RIO', emoji: '🌊' },
      { t: 'texto', texto: 'Ela cuida das ÁGUAS e fica triste quando alguém suja o rio.', d: ['Á-GUAS'], som: 'agua',
        cena: { f: 'rio', p: 'bolhas', a: [['🧜', 50, 54, 11, 'balancar'], ['💧', 30, 30, 5, 'cair'], ['💧', 70, 30, 5, 'cair', { d: 0.5 }]] } },
      { t: 'texto', texto: 'Um dia, uma menina chamada Ana limpou a beira do rio, catando todo o LIXO.', d: ['LI-XO'], som: 'passos',
        cena: { f: 'lago', a: [['👧', 28, 58, 10, 'balancar'], ['🗑️', 50, 62, 7, 'balancar'], ['🧜', 78, 66, 8, 'nadar']] } },
      { t: 'texto', texto: 'A Iara ficou tão feliz que deu à menina uma CONCHA mágica que canta.', d: ['CON-CHA'], som: 'magia',
        cena: { f: 'lago', p: 'faiscas', a: [['🐚', 50, 54, 9, 'brilhar'], ['👧', 24, 58, 9, 'pular'], ['🧜', 78, 64, 9, 'balancar']] } },
      { t: 'desafio', modo: 'letra', palavra: 'PEIXE', emoji: '🐟' },
      { t: 'texto', texto: 'Até hoje, quando Ana encosta a concha no OUVIDO, escuta o canto da Iara.', d: ['OU-VI-DO'], som: 'sino',
        cena: { f: 'lago', a: [['👧', 40, 58, 10, 'balancar'], ['🐚', 52, 46, 5, 'balancar'], ['🎵', 66, 30, 5, 'flutuar'], ['🎶', 78, 24, 5, 'flutuar', { d: 0.5 }]] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'RIO', silabas: ['RI', 'O'], emoji: '🌊' }
    ],
    pergunta: {
      texto: 'O que a Iara deu para a menina?',
      opcoes: [{ texto: 'CONCHA', emoji: '🐚', correta: true }, { texto: 'BOLA', emoji: '⚽', correta: false }]
    }
  },

  {
    id: 'boitata',
    titulo: 'Boitatá',
    grupo: 'folclore',
    capa: '🐍🔥',
    cor: '#E8742A',
    tema: { bpm: 112, baixo: [45, 52, 50, 45, 45, 50, 52, 45] },
    cancao: {
      titulo: 'Cobra de luz',
      versos: ['Boi-ta-tá, co-bra de luz,', 'bri-lha, bri-lha no ca-mi-nho,', 'cui-da da ma-ta à noi-te,', 'nin-guém fi-ca so-zi-nho!'],
      notas: [[69, 73, 76, 76, 74, 73, 69], [76, 73, 76, 73, 74, 76, 78, 76], [74, 74, 73, 71, 73, 74, 76, 73], [71, 73, 74, 73, 71, 69, 69]]
    },
    paginas: [
      { t: 'texto', texto: 'Nas noites escuras, uma COBRA de fogo brilha pelos campos: é o BOITATÁ!', d: ['CO-BRA', 'BOI-TA-TÁ'], som: 'fogo',
        cena: { f: 'noite', p: 'faiscas', a: [['🐍', 48, 62, 13, 'serpentear', { f: 'fogo', s: 'fogo' }], ['🌙', 86, 16, 6, 'brilhar']] } },
      { t: 'texto', texto: 'O Boitatá tem olhos grandes e BRILHANTES, que enxergam tudo no escuro.', d: ['BRI-LHAN-TES'], som: 'magia',
        cena: { f: 'noite', p: 'estrelas', a: [['👀', 50, 46, 12, 'piscar']] } },
      { t: 'desafio', modo: 'vogal', palavra: 'NOITE', emoji: '🌙' },
      { t: 'texto', texto: 'Ele é o protetor dos CAMPOS e das matas contra as queimadas.', d: ['CAM-POS'], som: 'vento',
        cena: { f: 'noite', a: [['🐍', 36, 62, 11, 'serpentear', { f: 'fogo', s: 'fogo' }], ['🌾', 66, 68, 7, 'balancar'], ['🌾', 80, 70, 6, 'balancar', { d: 0.3 }]] } },
      { t: 'texto', texto: 'Quando alguém tenta pôr fogo na mata, o Boitatá aparece e ESPANTA o perigo.', d: ['ES-PAN-TA'], som: 'fogo',
        cena: { f: 'noite', p: 'faiscas', a: [['🐍', 46, 58, 13, 'crescer', { f: 'fogo', s: 'fogo' }], ['💨', 76, 58, 7, 'vento']] } },
      { t: 'desafio', modo: 'letra', palavra: 'COBRA', emoji: '🐍' },
      { t: 'texto', texto: 'Os bichos dormem tranquilos, porque o Boitatá está de GUARDA.', d: ['GUAR-DA'], som: 'grilos',
        cena: { f: 'noite', p: 'estrelas', a: [['🦉', 22, 38, 7, 'piscar'], ['🐇', 42, 72, 6, 'dormir'], ['🦊', 62, 72, 6, 'dormir'], ['🐍', 84, 64, 7, 'balancar', { f: 'fogo' }]] } },
      { t: 'texto', texto: 'Se você vir uma luz dançando no campo à noite, diga OBRIGADO ao Boitatá!', d: ['O-BRI-GA-DO'], som: 'magia',
        cena: { f: 'noite', p: 'estrelas', a: [['🧒', 30, 62, 10, 'balancar'], ['🐍', 66, 60, 10, 'serpentear', { f: 'fogo', s: 'fogo' }]] } },
      { t: 'musica' },
      { t: 'desafio', modo: 'montar', palavra: 'COBRA', silabas: ['CO', 'BRA'], emoji: '🐍' }
    ],
    pergunta: {
      texto: 'Do que é feito o corpo do Boitatá?',
      opcoes: [{ texto: 'FOGO', emoji: '🔥', correta: true }, { texto: 'ÁGUA', emoji: '💧', correta: false }]
    }
  }
];
