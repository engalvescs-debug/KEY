var Telas = window.Telas || {};

Telas.silabas = function (raiz, { modo = 'explorar' } = {}) {
  const todas = CONTENT.silabas.flatMap(g => g.itens.map(s => ({ id: s, cor: g.cor })));

  if (modo === 'praticar') {
    return rodarQuiz(raiz, {
      categoria: 'silabas',
      itens: todas,
      titulo: 'Sílabas',
      pergunta: FALAS.encontreSilaba,
      limite: 10,
      cartao: cartaoLetra,
      repetir: () => App.navegarPara('silabas', { modo: 'praticar' }, { empilhar: false })
    });
  }

  const feitos = new Set(App.progresso.concluidos.silabas || []);
  let i = 0;
  const familias = CONTENT.silabas.map(grupo => `
    <div class="familia">
      <div class="familia-titulo" style="${Efeitos.estiloCor(grupo.cor)}">${grupo.consoante}</div>
      ${grupo.itens.map(s => `
        <div class="cartao cartao-silaba focavel ${feitos.has(s) ? 'aprendido' : ''}" data-silaba="${s}" style="${Efeitos.estiloCor(grupo.cor)}--i:${i++ % 10}">
          <div class="letra">${s}</div>
        </div>
      `).join('')}
    </div>
  `).join('');

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela tela-rolavel">
      <h1 class="titulo">${Efeitos.arcoIris('Sílabas')}</h1>
      <h2 class="subtitulo">Cada família tem 5 sons. Toque para ouvir!</h2>
      <div class="familias">${familias}</div>
      <div class="barra-inferior">
        ${botao('voltar', '⬅️ Voltar')}
        ${botao('praticar', '🎯 Praticar', true)}
      </div>
    </div>
  `;

  raiz.querySelectorAll('[data-silaba]').forEach(el => {
    el.addEventListener('click', () => {
      Som.pop();
      Efeitos.tremer(el);
      Mascote.dizer(el.dataset.silaba, { devagar: true });
    });
  });
  ligarAcoes(raiz, {
    voltar: () => App.voltar(),
    praticar: () => App.navegarPara('silabas', { modo: 'praticar' })
  });

  App.narrarAoAbrir(FALAS.explorarSilabas);
};
