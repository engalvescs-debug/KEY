var Telas = window.Telas || {};

const CATEGORIAS_LETRAS = {
  vogais: { titulo: 'Vogais', explorar: FALAS.explorarVogais, pergunta: FALAS.encontreVogal, limite: 5 },
  alfabeto: { titulo: 'Alfabeto', explorar: FALAS.explorarAlfabeto, pergunta: FALAS.encontreLetra, limite: 8 }
};

Telas.aprender = function (raiz, { categoria, modo = 'explorar' }) {
  const itens = CONTENT[categoria];
  const cfg = CATEGORIAS_LETRAS[categoria];

  if (modo === 'praticar') {
    return rodarQuiz(raiz, {
      categoria,
      itens,
      titulo: cfg.titulo,
      pergunta: cfg.pergunta,
      limite: cfg.limite,
      cartao: cartaoLetra,
      repetir: () => App.navegarPara('aprender', { categoria, modo: 'praticar' }, { empilhar: false })
    });
  }

  const feitos = new Set(App.progresso.concluidos[categoria] || []);
  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">${Efeitos.arcoIris(cfg.titulo)}</h1>
      <h2 class="subtitulo">Toque em cada uma para ouvir. Depois vamos praticar!</h2>
      <div class="grade ${itens.length > 8 ? 'grade-compacta' : ''}">
        ${itens.map((item, i) => cartaoLetra(item, i).replace('class="cartao', `class="cartao ${feitos.has(item.id) ? 'aprendido' : ''}`)).join('')}
      </div>
      <div class="barra-inferior">
        ${botao('voltar', '⬅️ Voltar')}
        ${botao('praticar', '🎯 Praticar', true)}
      </div>
    </div>
  `;

  raiz.querySelectorAll('.grade [data-id]').forEach(el => {
    const item = itens.find(i => i.id === el.dataset.id);
    el.addEventListener('click', () => {
      Som.pop();
      Efeitos.tremer(el);
      Mascote.dizer(fraseLetra(item));
    });
  });
  ligarAcoes(raiz, {
    voltar: () => App.voltar(),
    praticar: () => App.navegarPara('aprender', { categoria, modo: 'praticar' })
  });

  App.narrarAoAbrir(cfg.explorar);
};
