var Telas = window.Telas || {};

Telas.configuracoes = function (raiz) {
  const p = App.progresso.preferencias;

  function linha(chave, rotulo, valor) {
    return `
      <div class="linha-config focavel" data-chave="${chave}">
        <span>${rotulo}</span>
        <div class="chave ${valor ? 'ligado' : ''}"></div>
      </div>
    `;
  }

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">⚙️ Configurações</h1>
      <h2 class="subtitulo">Ajuste o jogo do jeito que for mais confortável</h2>
      <div class="opcoes-config">
        ${linha('modoCalmo', '🌙 Modo Calmo (cores mais suaves)', p.modoCalmo)}
        ${linha('reduzirAnimacoes', '🎬 Reduzir animações e movimento', p.reduzirAnimacoes)}
        ${linha('narracaoAutomatica', '🔊 Narrar automaticamente ao abrir telas', p.narracaoAutomatica)}
        <div class="linha-config focavel" data-acao="pareamento">
          <span>📱 Controle pelo Celular (voz ou setas)</span>
          <span>➡️</span>
        </div>
      </div>
      <div class="barra-inferior">
        <div class="botao focavel" data-acao="voltar">⬅️ Voltar</div>
      </div>
    </div>
  `;

  raiz.querySelectorAll('[data-chave]').forEach(el => {
    el.addEventListener('click', () => {
      const chave = el.dataset.chave;
      const novoValor = !App.progresso.preferencias[chave];
      App.atualizarPreferencia(chave, novoValor);
      el.querySelector('.chave').classList.toggle('ligado', novoValor);
    });
  });

  raiz.querySelector('[data-acao="pareamento"]').addEventListener('click', () => App.navegarPara('pareamento'));
  raiz.querySelector('[data-acao="voltar"]').addEventListener('click', () => App.voltar());

  App.narrarAoAbrir('Aqui você pode ajustar as configurações do jogo.');
};
