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
      <h1 class="titulo">⚙️ Ajustes</h1>
      <h2 class="subtitulo">Deixe o jogo do jeito mais confortável</h2>
      <div class="opcoes-config">
        ${linha('musica', '🎵 Música de fundo', p.musica)}
        ${linha('modoCalmo', '🌙 Modo Calmo (cores e sons mais suaves)', p.modoCalmo)}
        ${linha('reduzirAnimacoes', '🎬 Parar animações e movimento', p.reduzirAnimacoes)}
        ${linha('narracaoAutomatica', '🔊 Lulu fala ao abrir cada tela', p.narracaoAutomatica)}
        <div class="linha-config focavel" data-acao="pareamento">
          <span>📱 Controle pelo celular (voz ou setas)</span>
          <span>➡️</span>
        </div>
      </div>
      <div class="barra-inferior">${botao('voltar', '⬅️ Voltar')}</div>
    </div>
  `;

  raiz.querySelectorAll('[data-chave]').forEach(el => {
    el.addEventListener('click', () => {
      const chave = el.dataset.chave;
      const novoValor = !App.progresso.preferencias[chave];
      Som.pop();
      App.atualizarPreferencia(chave, novoValor);
      el.querySelector('.chave').classList.toggle('ligado', novoValor);
    });
  });

  ligarAcoes(raiz, {
    pareamento: () => App.navegarPara('pareamento'),
    voltar: () => App.voltar()
  });

  App.narrarAoAbrir(FALAS.configuracoes);
};
