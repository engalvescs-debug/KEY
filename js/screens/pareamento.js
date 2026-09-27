var Telas = window.Telas || {};

Telas.pareamento = function (raiz) {
  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">📱 Controle pelo Celular</h1>
      <h2 class="subtitulo">No celular, abra o endereço abaixo e digite o código</h2>
      <div class="grade">
        <div class="cartao" style="min-width:22vw; cursor:default">
          <div class="palavra" style="font-size:1.2vw">${location.origin}${location.pathname.replace(/index\.html$/, '')}mic/</div>
          <div class="letra" id="codigo-pareamento" style="font-size:5vw; letter-spacing:0.3em">----</div>
        </div>
      </div>
      <p class="painel-mensagem" id="status-pareamento">Preparando conexão...</p>
      <div class="barra-inferior">
        <div class="botao focavel" data-acao="voltar">⬅️ Voltar</div>
      </div>
      <p class="rodape-dicas">A TV e o celular precisam estar com internet ligada.</p>
    </div>
  `;

  raiz.querySelector('[data-acao="voltar"]').addEventListener('click', () => App.voltar());
  requestAnimationFrame(() => Navegacao.focarPrimeiro());
  App.narrarAoAbrir('Abra o endereço no celular e digite o código para conectar.');

  VozRemota.iniciar(estado => {
    const elCodigo = document.getElementById('codigo-pareamento');
    const elStatus = document.getElementById('status-pareamento');
    if (!elCodigo || !elStatus) return; // a pessoa já saiu desta tela
    if (estado.erro) {
      elStatus.textContent = '⚠️ ' + estado.erro;
      return;
    }
    elCodigo.textContent = estado.codigo || '----';
    elStatus.textContent = estado.conectado
      ? '✅ Celular conectado! Já pode falar ou usar as setas.'
      : '🔄 Aguardando o celular conectar...';
  });
};
