var Telas = window.Telas || {};

Telas.historias = function (raiz) {
  const lidas = new Set(App.progresso.concluidos.historias || []);
  let i = 0;
  const estante = (grupo, titulo) => `
    <h2 class="titulo-estante">${titulo}</h2>
    <div class="grade grade-estante">
      ${CONTENT.historias.filter(h => h.grupo === grupo).map(h => `
        <div class="cartao cartao-livro focavel" data-id="${h.id}" style="${Efeitos.estiloCor(h.cor)}--i:${i++}">
          ${lidas.has(h.id) ? '<div class="selo-numero">✅</div>' : ''}
          <div class="emoji emoji-pulando">${h.capa}</div>
          <div class="rotulo">${h.titulo}</div>
        </div>
      `).join('')}
    </div>
  `;

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela tela-rolavel">
      <h1 class="titulo">${Efeitos.arcoIris('Hora da História')}</h1>
      ${estante('classicos', '📖 Contos clássicos')}
      ${estante('folclore', '🇧🇷 Folclore brasileiro')}
      <div class="barra-inferior">${botao('voltar', '⬅️ Voltar')}</div>
    </div>
  `;

  raiz.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', () => {
      Som.pagina();
      App.navegarPara('historiaLeitura', { id: el.dataset.id, pagina: 0 });
    });
  });
  ligarAcoes(raiz, { voltar: () => App.voltar() });

  App.narrarAoAbrir(FALAS.historias);
};
