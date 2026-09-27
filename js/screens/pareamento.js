var Telas = window.Telas || {};

Telas.pareamento = function (raiz) {
  const endereco = `${location.origin}${location.pathname.replace(/index\.html$/, '')}mic/`;
  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">📱 Controle pelo Celular</h1>
      <h2 class="subtitulo">No celular, abra o endereço abaixo e digite o código</h2>
      <div class="grade">
        <div class="cartao cartao-codigo" style="${Efeitos.estiloCor('#4D96FF')}">
          <div class="palavra">${endereco}</div>
          <div class="codigo" id="codigo-pareamento">----</div>
        </div>
      </div>
      <p class="painel-mensagem" id="status-pareamento">Preparando conexão...</p>
      <div class="barra-inferior">${botao('voltar', '⬅️ Voltar')}</div>
      <p class="rodape-dicas">A TV e o celular precisam estar com internet ligada.</p>
    </div>
  `;

  ligarAcoes(raiz, { voltar: () => App.voltar() });
  App.narrarAoAbrir(FALAS.pareamento);

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
