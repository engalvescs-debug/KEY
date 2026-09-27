var Telas = window.Telas || {};

Telas.menu = function (raiz) {
  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">📚 Aprender a Ler</h1>
      <h2 class="subtitulo">Escolha o que vamos fazer hoje!</h2>
      <div class="grade">
        <div class="cartao focavel" data-acao="niveis">
          <div class="emoji">🎮</div>
          <div class="letra" style="font-size:1.6vw">Jogo dos Níveis</div>
        </div>
        <div class="cartao focavel" data-acao="historias">
          <div class="emoji">📖</div>
          <div class="letra" style="font-size:1.6vw">Modo História</div>
        </div>
        <div class="cartao focavel" data-acao="configuracoes">
          <div class="emoji">⚙️</div>
          <div class="letra" style="font-size:1.6vw">Configurações</div>
        </div>
      </div>
      <p class="rodape-dicas">Use as setas do controle para navegar e OK para escolher 🕹️</p>
    </div>
  `;

  raiz.querySelectorAll('[data-acao]').forEach(el => {
    el.addEventListener('click', () => App.navegarPara(el.dataset.acao));
  });

  App.narrarAoAbrir('O que vamos fazer hoje? Escolha uma opção.');
};
