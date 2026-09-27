var Telas = window.Telas || {};

// Tela de abertura: além de receber a criança, o primeiro toque/OK é o que
// libera som e música (navegadores bloqueiam áudio antes de uma interação).
Telas.inicio = function (raiz) {
  raiz.innerHTML = `
    <div class="tela tela-inicio">
      <h1 class="logo">${Efeitos.arcoIris('Aprender a Ler')}</h1>
      <div class="lulu-grande">${Mascote.svg('acenando')}</div>
      <div class="botao principal focavel botao-comecar" data-acao="comecar">▶ Vamos brincar!</div>
      <p class="rodape-dicas">Aperte OK no controle ou toque na tela</p>
    </div>
  `;
  raiz.querySelector('[data-acao="comecar"]').addEventListener('click', () => App.comecar());
};
