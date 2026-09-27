var Telas = window.Telas || {};

Telas.historias = function (raiz) {
  const cartoes = CONTENT.historias.map(h => `
    <div class="cartao focavel" data-id="${h.id}" style="border-color:${h.cor}22; min-width:18vw">
      <div class="emoji" style="font-size:6vw">${h.capa}</div>
      <div class="letra" style="font-size:1.6vw; color:${h.cor}">${h.titulo}</div>
    </div>
  `).join('');

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">📖 Modo História</h1>
      <h2 class="subtitulo">Escolha uma história para ler e ouvir</h2>
      <div class="grade">${cartoes}</div>
      <div class="barra-inferior">
        <div class="botao focavel" data-acao="voltar">⬅️ Voltar</div>
      </div>
    </div>
  `;

  raiz.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', () => App.navegarPara('historiaLeitura', { id: el.dataset.id, pagina: 0 }));
  });
  raiz.querySelector('[data-acao="voltar"]').addEventListener('click', () => App.voltar());

  App.narrarAoAbrir('Escolha uma história para ler.');
};
