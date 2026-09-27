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
    const partes = alvo.silabas;
    let posicao = 0;
    let erros = 0;

    const outras = CONTENT.palavras.filter(p => p.palavra !== alvo.palavra).flatMap(p => p.silabas);
    const distratores = embaralhar([...new Set(outras.filter(s => !partes.includes(s)))]).slice(0, 2);
    const opcoes = embaralhar([...partes, ...distratores]);

    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela">
        ${bolinhasProgresso(rodadas.length, indice)}
        <h1 class="titulo">Monte a palavra!</h1>
        <div class="cena-palavra">
          <div class="emoji-cena">${alvo.emoji}</div>
          <div class="espacos">
            ${partes.map((_, i) => `<div class="espaco" data-pos="${i}" style="${Efeitos.estiloCor(alvo.cor)}">?</div>`).join('')}
          </div>
        </div>
        <div class="grade grade-quiz">
          ${opcoes.map((s, i) => `
            <div class="cartao cartao-silaba focavel" data-silaba="${s}" style="${Efeitos.estiloCor(alvo.cor)}--i:${i}">
              <div class="letra">${s}</div>
            </div>
          `).join('')}
        </div>
        <div class="barra-inferior">
          ${botao('voltar', '⬅️ Sair')}
          ${botao('ouvir', '🔊 Ouvir de novo')}
        </div>
      </div>
    `;

    const falaInicial = [FALAS.montarPalavra, alvo.palavra, FALAS.montarDica];
    ligarAcoes(raiz, {
      voltar: () => App.voltar(),
      ouvir: () => Mascote.dizer([alvo.palavra], { devagar: true })
    });

    raiz.querySelectorAll('[data-silaba]').forEach(el => {
      el.addEventListener('click', () => escolher(el));
    });

    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Mascote.dizer(falaInicial);

    function escolher(el) {
      if (el.dataset.usado || posicao >= partes.length) return;
      const silaba = el.dataset.silaba;

      if (silaba !== partes[posicao]) {
        erros += 1;
        Efeitos.tremer(el);
        Som.quase();
        Mascote.pensar();
        Mascote.dizer([sorteio(FALAS.quase), alvo.palavra]);
        if (erros >= 2) {
          const certo = raiz.querySelector(`[data-silaba="${partes[posicao]}"]:not([data-usado])`);
          if (certo) certo.classList.add('dica');
        }
        return;
      }

      erros = 0;
      raiz.querySelectorAll('.dica').forEach(d => d.classList.remove('dica'));
      el.dataset.usado = '1';
      el.classList.add('usado');
      const espaco = raiz.querySelector(`.espaco[data-pos="${posicao}"]`);
      espaco.textContent = silaba;
      espaco.classList.add('preenchido');
      posicao += 1;
      Som.pop();

      if (posicao < partes.length) {
        Mascote.dizer(silaba, { devagar: true });
        return;
      }

      raiz.querySelector('.espacos').classList.add('completa');
      Som.conquista();
      Mascote.comemorar();
      Mascote.dizer([alvo.palavra, FALAS.palavraMontada], { balao: `${alvo.palavra}! ${FALAS.palavraMontada}` });
      App.marcarConcluido('palavras', alvo.palavra, raiz.querySelector('.espacos'));
      indice += 1;
      setTimeout(montarRodada, 2600);
    }
  }

  montarRodada();
};
