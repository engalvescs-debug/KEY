var Telas = window.Telas || {};

Telas.historias = function (raiz) {
  const lidas = new Set(App.progresso.concluidos.historias || []);
  const capas = CONTENT.historias.map((h, i) => `
    <div class="cartao cartao-livro focavel" data-id="${h.id}" style="${Efeitos.estiloCor(h.cor)}--i:${i}">
      ${lidas.has(h.id) ? '<div class="selo-numero">✅</div>' : ''}
      <div class="emoji emoji-pulando">${h.capa}</div>
      <div class="rotulo">${h.titulo}</div>
    </div>
  `).join('');

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">${Efeitos.arcoIris('Hora da História')}</h1>
      <h2 class="subtitulo">Escolha um livro para a gente ler juntinhos</h2>
      <div class="grade">${capas}</div>
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
