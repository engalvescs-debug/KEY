var Telas = window.Telas || {};

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function cartaoLetra(item, i) {
  return `
    <div class="cartao focavel" data-id="${item.id}" style="${Efeitos.estiloCor(item.cor)}--i:${i}">
      ${item.emoji ? `<div class="emoji">${item.emoji}</div>` : ''}
      <div class="letra">${item.id}</div>
      ${item.palavra ? `<div class="palavra">${item.palavra}</div>` : ''}
    </div>
  `;
}

function botao(acao, rotulo, principal = false) {
  return `<div class="botao ${principal ? 'principal' : ''} focavel" data-acao="${acao}">${rotulo}</div>`;
}

function ligarAcoes(raiz, acoes) {
  Object.keys(acoes).forEach(acao => {
    raiz.querySelectorAll(`[data-acao="${acao}"]`).forEach(el => {
      el.addEventListener('click', () => { Som.pop(); acoes[acao](el); });
    });
  });
}

function bolinhasProgresso(total, atual) {
  let html = '';
  for (let i = 0; i < total; i++) {
    html += `<span class="bolinha ${i < atual ? 'feita' : ''} ${i === atual ? 'atual' : ''}"></span>`;
  }
  return `<div class="bolinhas">${html}</div>`;
}

function telaCelebracao(raiz, { titulo, repetir }) {
  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela tela-celebracao">
      <h1 class="titulo">${Efeitos.arcoIris('Você conseguiu!')}</h1>
      <div class="trofeu">🏆</div>
      <h2 class="subtitulo">Terminou: ${titulo}</h2>
      <div class="barra-inferior">
        ${botao('niveis', '🎮 Ver Níveis')}
        ${botao('repetir', '🔁 Jogar de Novo', true)}
      </div>
    </div>
  `;
  ligarAcoes(raiz, {
    niveis: () => App.navegarPara('niveis', {}, { aPartirDoMenu: true }),
    repetir
  });
  Mascote.comemorar();
  setTimeout(() => Efeitos.confete(60), 500);
  Som.conquista();
  Mascote.dizer(FALAS.nivelCompleto);
}

// "Monte a palavra" tocando nas sílabas em ordem. Renderiza dentro de `el`
// e chama aoConcluir(elementoDaPalavra) quando a palavra fica completa.
function montarPalavraUI(el, { palavra, silabas, emoji, cor, distratores, aoConcluir }) {
  let posicao = 0;
  let erros = 0;
  const opcoes = embaralhar([...silabas, ...distratores.filter(s => !silabas.includes(s)).slice(0, 2)]);

  el.innerHTML = `
    <div class="cena-palavra">
      <div class="emoji-cena">${emoji}</div>
      <div class="espacos">
        ${silabas.map((_, i) => `<div class="espaco" data-pos="${i}" style="${Efeitos.estiloCor(cor)}">?</div>`).join('')}
      </div>
    </div>
    <div class="grade grade-quiz">
      ${opcoes.map((s, i) => `
        <div class="cartao cartao-silaba focavel" data-silaba="${s}" style="${Efeitos.estiloCor(cor)}--i:${i}">
          <div class="letra">${s}</div>
        </div>
      `).join('')}
    </div>
  `;

  el.querySelectorAll('[data-silaba]').forEach(card => card.addEventListener('click', () => escolher(card)));

  function escolher(card) {
    if (card.dataset.usado || posicao >= silabas.length) return;
    const silaba = card.dataset.silaba;

    if (silaba !== silabas[posicao]) {
      erros += 1;
      Efeitos.tremer(card);
      Som.quase();
      Mascote.pensar();
      Mascote.dizer([sorteio(FALAS.quase), palavra]);
      if (erros >= 2) {
        const certo = el.querySelector(`[data-silaba="${silabas[posicao]}"]:not([data-usado])`);
        if (certo) certo.classList.add('dica');
      }
      return;
    }

    erros = 0;
    el.querySelectorAll('.dica').forEach(d => d.classList.remove('dica'));
    card.dataset.usado = '1';
    card.classList.add('usado');
    const espaco = el.querySelector(`.espaco[data-pos="${posicao}"]`);
    espaco.textContent = silaba;
    espaco.classList.add('preenchido');
    posicao += 1;
    Som.pop();

    if (posicao < silabas.length) {
      Mascote.dizer(silaba, { devagar: true });
      return;
    }

    const espacos = el.querySelector('.espacos');
    espacos.classList.add('completa');
    Som.conquista();
    Mascote.comemorar();
    Mascote.dizer([palavra, FALAS.palavraMontada], { balao: `${palavra}! ${FALAS.palavraMontada}` });
    aoConcluir(espacos);
  }
}

// Quiz genérico "encontre o item": prioriza itens ainda não aprendidos,
// nunca pune o erro e mostra uma dica visual após duas tentativas.
function rodarQuiz(raiz, cfg) {
  const feitos = new Set(App.progresso.concluidos[cfg.categoria] || []);
  const pendentes = embaralhar(cfg.itens.filter(i => !feitos.has(i.id)));
  const revisao = embaralhar(cfg.itens.filter(i => feitos.has(i.id)));
  const rodadas = [...pendentes, ...revisao].slice(0, cfg.limite || cfg.itens.length);
  let indice = 0;

  function montarRodada() {
    if (indice >= rodadas.length) return telaCelebracao(raiz, { titulo: cfg.titulo, repetir: cfg.repetir });

    const alvo = rodadas[indice];
    const distratores = embaralhar(cfg.itens.filter(i => i.id !== alvo.id)).slice(0, 2);
    const opcoes = embaralhar([alvo, ...distratores]);
    const pergunta = [cfg.pergunta, alvo.id];
    let erros = 0;
    let travado = false;

    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela">
        ${bolinhasProgresso(rodadas.length, indice)}
        <h1 class="titulo">${cfg.pergunta} <span class="alvo" style="${Efeitos.estiloCor(alvo.cor)}">${alvo.id}</span></h1>
        <div class="grade grade-quiz">${opcoes.map((op, i) => cfg.cartao(op, i)).join('')}</div>
        <div class="barra-inferior">
          ${botao('voltar', '⬅️ Sair')}
          ${botao('ouvir', '🔊 Ouvir de novo')}
        </div>
      </div>
    `;

    ligarAcoes(raiz, {
      voltar: () => App.voltar(),
      ouvir: () => Mascote.dizer(pergunta, { devagar: true })
    });

    raiz.querySelectorAll('.grade-quiz [data-id]').forEach(el => {
      el.addEventListener('click', () => {
        if (travado) return;
        if (el.dataset.id === alvo.id) {
          travado = true;
          el.classList.add('acertou');
          Som.conquista();
          Mascote.comemorar();
          Mascote.dizer(sorteio(FALAS.acertos));
          App.marcarConcluido(cfg.categoria, alvo.id, el);
          indice += 1;
          setTimeout(montarRodada, 2000);
        } else {
          erros += 1;
          Efeitos.tremer(el);
          Som.quase();
          Mascote.pensar();
          Mascote.dizer([sorteio(FALAS.quase), ...pergunta]);
          if (erros >= 2) {
            const certo = raiz.querySelector(`.grade-quiz [data-id="${alvo.id}"]`);
            if (certo) certo.classList.add('dica');
          }
        }
      });
    });

    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Mascote.dizer(pergunta, { devagar: true });
  }

  montarRodada();
}
