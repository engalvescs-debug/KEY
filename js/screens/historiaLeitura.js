var Telas = window.Telas || {};

function destacarPalavras(texto, destaques, cor) {
  if (!destaques || !destaques.length) return texto;
  const escapadas = destaques.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escapadas.join('|')})\\b`, 'g');
  return texto.replace(regex, `<span class="palavra-destaque focavel" data-palavra="$1" style="${Efeitos.estiloCor(cor)}">$1</span>`);
}

Telas.historiaLeitura = function (raiz, { id, pagina }) {
  const historia = CONTENT.historias.find(h => h.id === id);
  if (pagina >= historia.paginas.length) return renderPergunta();

  const pag = historia.paginas[pagina];
  const irPara = p => {
    Som.pagina();
    App.navegarPara('historiaLeitura', { id, pagina: p }, { empilhar: false });
  };

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela tela-historia">
      <h1 class="titulo titulo-livro" style="${Efeitos.estiloCor(historia.cor)}">${historia.titulo}</h1>
      <div class="pagina-livro" style="${Efeitos.estiloCor(historia.cor)}">
        <div class="emoji-cena">${pag.emoji}</div>
        <p class="texto-historia">${destacarPalavras(pag.texto, pag.destaques, historia.cor)}</p>
      </div>
      ${bolinhasProgresso(historia.paginas.length + 1, pagina)}
      <div class="barra-inferior">
        ${botao('sair', '⬅️ Sair')}
        ${pagina > 0 ? botao('anterior', '◀ Voltar página') : ''}
        ${botao('repetir', '🔊 Ler de novo')}
        ${botao('proxima', 'Próxima ▶', true)}
      </div>
    </div>
  `;

  ligarAcoes(raiz, {
    sair: () => App.navegarPara('historias', {}, { aPartirDoMenu: true }),
    anterior: () => irPara(pagina - 1),
    proxima: () => irPara(pagina + 1),
    repetir: () => Mascote.dizer(pag.texto, { semBalao: true })
  });

  raiz.querySelectorAll('[data-palavra]').forEach(el => {
    el.addEventListener('click', () => {
      Som.pop();
      Efeitos.tremer(el);
      Mascote.dizer(el.dataset.palavra, { devagar: true });
    });
  });

  // Foco começa em "Próxima", o caminho mais comum com o controle remoto.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const itens = Array.from(document.querySelectorAll('.focavel'));
    const i = itens.findIndex(el => el.dataset.acao === 'proxima');
    if (i >= 0) Navegacao.focar(i, true);
  }));
  if (App.progresso.preferencias.narracaoAutomatica) Mascote.dizer(pag.texto, { semBalao: true });

  function renderPergunta() {
    const pergunta = historia.pergunta;
    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela">
        <h1 class="titulo">🤔 ${pergunta.texto}</h1>
        <div class="grade grade-quiz">
          ${pergunta.opcoes.map((op, i) => `
            <div class="cartao focavel" data-i="${i}" style="${Efeitos.estiloCor(i ? '#4ECDC4' : '#FF9F45')}--i:${i}">
              <div class="emoji">${op.emoji}</div>
              <div class="rotulo">${op.texto}</div>
            </div>
          `).join('')}
        </div>
        <div class="barra-inferior">
          ${botao('sair', '⬅️ Sair')}
          ${botao('ouvir', '🔊 Ouvir de novo')}
        </div>
      </div>
    `;

    ligarAcoes(raiz, {
      sair: () => App.navegarPara('historias', {}, { aPartirDoMenu: true }),
      ouvir: () => Mascote.dizer(pergunta.texto)
    });

    let erros = 0;
    let respondido = false;
    raiz.querySelectorAll('[data-i]').forEach(el => {
      const opcao = pergunta.opcoes[Number(el.dataset.i)];
      el.addEventListener('click', () => {
        if (respondido) return;
        if (opcao.correta) {
          respondido = true;
          el.classList.add('acertou');
          Som.conquista();
          Mascote.comemorar();
          Mascote.dizer(FALAS.historiaAcerto);
          App.marcarConcluido('historias', historia.id, el);
          setTimeout(() => App.navegarPara('historias', {}, { aPartirDoMenu: true }), 3000);
        } else {
          erros += 1;
          Efeitos.tremer(el);
          Som.quase();
          Mascote.pensar();
          Mascote.dizer([sorteio(FALAS.quase), pergunta.texto]);
          if (erros >= 2) {
            const i = pergunta.opcoes.findIndex(o => o.correta);
            raiz.querySelector(`[data-i="${i}"]`).classList.add('dica');
          }
        }
      });
    });

    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Mascote.dizer(pergunta.texto);
  }
};
