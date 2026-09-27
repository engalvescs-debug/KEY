var Telas = window.Telas || {};

Telas.montarPalavras = function (raiz) {
  const feitos = new Set(App.progresso.concluidos.palavras || []);
  const rodadas = [
    ...embaralhar(CONTENT.palavras.filter(p => !feitos.has(p.palavra))),
    ...embaralhar(CONTENT.palavras.filter(p => feitos.has(p.palavra)))
  ].slice(0, 6);
  let indice = 0;

  function montarRodada() {
    if (indice >= rodadas.length) {
      return telaCelebracao(raiz, {
        titulo: 'Montar Palavras',
        repetir: () => App.navegarPara('montarPalavras', {}, { empilhar: false })
      });
    }

    const alvo = rodadas[indice];
    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela">
        ${bolinhasProgresso(rodadas.length, indice)}
        <h1 class="titulo">Monte a palavra!</h1>
        <div class="area-montar"></div>
        <div class="barra-inferior">
          ${botao('voltar', '⬅️ Sair')}
          ${botao('ouvir', '🔊 Ouvir de novo')}
        </div>
      </div>
    `;

    montarPalavraUI(raiz.querySelector('.area-montar'), {
      palavra: alvo.palavra,
      silabas: alvo.silabas,
      emoji: alvo.emoji,
      cor: alvo.cor,
      distratores: embaralhar(CONTENT.palavras.filter(p => p !== alvo).flatMap(p => p.silabas)),
      aoConcluir: el => {
        App.marcarConcluido('palavras', alvo.palavra, el);
        indice += 1;
        setTimeout(montarRodada, 2600);
      }
    });

    ligarAcoes(raiz, {
      voltar: () => App.voltar(),
      ouvir: () => Mascote.dizer([alvo.palavra], { devagar: true })
    });

    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Mascote.dizer([FALAS.montarPalavra, alvo.palavra, FALAS.montarDica], { balao: `${FALAS.montarPalavra} ${alvo.palavra}! ${FALAS.montarDica}` });
  }

  montarRodada();
};
