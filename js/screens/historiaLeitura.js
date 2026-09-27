var Telas = window.Telas || {};

function destacarPalavras(texto, destaques) {
  if (!destaques || !destaques.length) return texto;
  const escapadas = destaques.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapadas.join('|')})`, 'g');
  return texto.replace(regex, '<span class="palavra-destaque focavel" data-palavra="$1">$1</span>');
}

Telas.historiaLeitura = function (raiz, { id, pagina }) {
  const historia = CONTENT.historias.find(h => h.id === id);
  const ultimaPagina = pagina >= historia.paginas.length;

  if (ultimaPagina) return renderPergunta();

  const pag = historia.paginas[pagina];
  const textoHtml = destacarPalavras(pag.texto, pag.destaques);

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">${historia.titulo}</h1>
      <div class="pagina-historia">
        <div class="emoji-cena">${pag.emoji}</div>
        <p class="texto-historia">${textoHtml}</p>
      </div>
      <div class="barra-inferior">
        <div class="botao focavel" data-acao="voltar">⬅️ Sair</div>
        ${pagina > 0 ? '<div class="botao focavel" data-acao="anterior">◀ Página Anterior</div>' : ''}
        <div class="botao principal focavel" data-acao="proxima">Próxima Página ▶</div>
      </div>
      <p class="rodape-dicas">Página ${pagina + 1} de ${historia.paginas.length} · toque nas palavras destacadas para ouvir</p>
    </div>
  `;

  raiz.querySelector('[data-acao="voltar"]').addEventListener('click', () => App.navegarPara('historias'));
  raiz.querySelector('[data-acao="proxima"]').addEventListener('click', () =>
    App.navegarPara('historiaLeitura', { id, pagina: pagina + 1 })
  );
  const anteriorBtn = raiz.querySelector('[data-acao="anterior"]');
  if (anteriorBtn) anteriorBtn.addEventListener('click', () =>
    App.navegarPara('historiaLeitura', { id, pagina: pagina - 1 })
  );

  raiz.querySelectorAll('[data-palavra]').forEach(el => {
    el.addEventListener('click', () => Narrador.falar(el.dataset.palavra, { devagar: true }));
  });

  requestAnimationFrame(() => Navegacao.focarPrimeiro());
  Narrador.falar(pag.texto);

  function renderPergunta() {
    const pergunta = historia.pergunta;
    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela">
        <h1 class="titulo">🤔 ${pergunta.texto}</h1>
        <div class="painel-mensagem" id="mensagem"></div>
        <div class="grade">
          ${pergunta.opcoes.map((op, i) => `
            <div class="cartao focavel" data-i="${i}" style="min-width:16vw">
              <div class="emoji">${op.emoji}</div>
              <div class="letra" style="font-size:1.6vw">${op.texto}</div>
            </div>
          `).join('')}
        </div>
        <div class="barra-inferior">
          <div class="botao focavel" data-acao="sair">⬅️ Sair</div>
        </div>
      </div>
    `;

    raiz.querySelector('[data-acao="sair"]').addEventListener('click', () => App.navegarPara('historias'));
    raiz.querySelectorAll('[data-i]').forEach(el => {
      const opcao = pergunta.opcoes[Number(el.dataset.i)];
      el.addEventListener('click', () => {
        const mensagem = document.getElementById('mensagem');
        if (opcao.correta) {
          mensagem.innerHTML = '<span class="mensagem-gentil">🎉 Isso mesmo! Você entendeu a história!</span>';
          Narrador.tocarConquista();
          Narrador.falar('Isso mesmo! Você entendeu a história!');
          App.marcarConcluido('historias', historia.id);
          setTimeout(() => App.navegarPara('historias'), 2200);
        } else {
          mensagem.innerHTML = '<span class="mensagem-gentil">💛 Quase! Vamos pensar de novo?</span>';
          Narrador.falar('Quase! Vamos pensar de novo.');
        }
      });
    });

    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Narrador.falar(pergunta.texto);
  }
};
