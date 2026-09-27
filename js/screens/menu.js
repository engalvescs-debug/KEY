var Telas = window.Telas || {};

Telas.menu = function (raiz) {
  const opcoes = [
    { acao: 'niveis', emoji: '🎮', rotulo: 'Jogar', cor: '#FF9F45' },
    { acao: 'historias', emoji: '📖', rotulo: 'Histórias', cor: '#4D96FF' },
    { acao: 'configuracoes', emoji: '⚙️', rotulo: 'Ajustes', cor: '#6BCB77' }
  ];

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo titulo-grande">${Efeitos.arcoIris('Aprender a Ler')}</h1>
      <div class="grade">
        ${opcoes.map((o, i) => `
          <div class="cartao cartao-menu focavel" data-acao="${o.acao}" style="${Efeitos.estiloCor(o.cor)}--i:${i}">
            <div class="emoji emoji-pulando">${o.emoji}</div>
            <div class="rotulo">${o.rotulo}</div>
          </div>
        `).join('')}
      </div>
      <p class="rodape-dicas">Use as setas do controle para escolher e OK para entrar 🕹️</p>
    </div>
  `;

  ligarAcoes(raiz, {
    niveis: () => App.navegarPara('niveis'),
    historias: () => App.navegarPara('historias'),
    configuracoes: () => App.navegarPara('configuracoes')
  });

  App.narrarAoAbrir(FALAS.menu);
};
