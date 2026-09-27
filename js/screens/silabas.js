var Telas = window.Telas || {};

Telas.silabas = function (raiz, { modo = 'explorar' } = {}) {
  if (modo === 'explorar') renderExplorar();
  else renderPraticar();

  function todasSilabas() {
    return CONTENT.silabas.flatMap(grupo => grupo.itens.map(s => ({ id: s, cor: grupo.cor })));
  }

  function renderExplorar() {
    const grupos = CONTENT.silabas.map(grupo => `
      <div style="width:100%">
        <h2 class="subtitulo" style="text-align:left;color:${grupo.cor}">Família do ${grupo.consoante}</h2>
        <div class="grade" style="justify-content:flex-start; margin-bottom:2vh">
          ${grupo.itens.map(s => `
            <div class="cartao focavel" data-silaba="${s}" style="border-color:${grupo.cor}22; min-width:8vw">
              <div class="letra" style="color:${grupo.cor}">${s}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela" style="overflow-y:auto">
        <h1 class="titulo">🧩 Sílabas</h1>
        <h2 class="subtitulo">Toque para ouvir o som de cada sílaba</h2>
        ${grupos}
        <div class="barra-inferior">
          <div class="botao focavel" data-acao="voltar">⬅️ Voltar</div>
          <div class="botao principal focavel" data-acao="praticar">🎯 Praticar</div>
        </div>
      </div>
    `;

    raiz.querySelectorAll('[data-silaba]').forEach(el => {
      el.addEventListener('click', () => Narrador.falar(el.dataset.silaba, { devagar: true }));
    });
    raiz.querySelector('[data-acao="voltar"]').addEventListener('click', () => App.voltar());
    raiz.querySelector('[data-acao="praticar"]').addEventListener('click', () =>
      App.navegarPara('silabas', { modo: 'praticar' })
    );

    App.narrarAoAbrir('Vamos conhecer as sílabas.');
  }

  function renderPraticar() {
    const itens = todasSilabas();
    const ordem = embaralhar(itens);
    let indice = 0;
    let travado = false;

    function montarRodada() {
      if (indice >= ordem.length) return renderCelebracao();
      const alvo = ordem[indice];
      const distratores = embaralhar(itens.filter(i => i.id !== alvo.id)).slice(0, 2);
      const opcoes = embaralhar([alvo, ...distratores]);
      travado = false;

      raiz.innerHTML = `
        ${App.estrelasHtml()}
        <div class="tela">
          <h1 class="titulo">Encontre a sílaba ${alvo.id}</h1>
          <div class="painel-mensagem" id="mensagem"></div>
          <div class="grade">
            ${opcoes.map(op => `
              <div class="cartao focavel" data-id="${op.id}" style="border-color:${op.cor}22; min-width:10vw">
                <div class="letra" style="color:${op.cor}">${op.id}</div>
              </div>
            `).join('')}
          </div>
          <div class="barra-inferior">
            <div class="botao focavel" data-acao="voltar">⬅️ Sair</div>
          </div>
          <p class="rodape-dicas">Não tem pressa, tente quantas vezes quiser 💛</p>
        </div>
      `;

      raiz.querySelector('[data-acao="voltar"]').addEventListener('click', () => App.voltar());
      raiz.querySelectorAll('[data-id]').forEach(el => {
        el.addEventListener('click', () => escolher(el, el.dataset.id, alvo.id));
      });

      requestAnimationFrame(() => Navegacao.focarPrimeiro());
      Narrador.falar(`Encontre a sílaba ${alvo.id}.`, { devagar: true });
    }

    function escolher(el, escolhidoId, alvoId) {
      if (travado) return;
      const mensagem = document.getElementById('mensagem');

      if (escolhidoId === alvoId) {
        travado = true;
        el.style.borderColor = '#6BCB77';
        mensagem.innerHTML = '<span class="mensagem-gentil">🎉 Isso! Muito bem!</span>';
        Narrador.tocarConquista();
        Narrador.falar('Isso! Muito bem!');
        App.marcarConcluido('silabas', alvoId);
        indice += 1;
        setTimeout(montarRodada, 1600);
      } else {
        mensagem.innerHTML = '<span class="mensagem-gentil">💛 Quase! Vamos tentar de novo?</span>';
        Narrador.falar('Quase! Vamos tentar de novo.');
      }
    }

    function renderCelebracao() {
      raiz.innerHTML = `
        ${App.estrelasHtml()}
        <div class="tela">
          <h1 class="titulo">🏆 Você conseguiu!</h1>
          <h2 class="subtitulo">Terminou Sílabas. Parabéns!</h2>
          <div class="grade" style="font-size:6vw">🎉🌟🎊</div>
          <div class="barra-inferior">
            <div class="botao focavel" data-acao="niveis">🎮 Ver Níveis</div>
            <div class="botao principal focavel" data-acao="repetir">🔁 Jogar de Novo</div>
          </div>
        </div>
      `;
      raiz.querySelector('[data-acao="niveis"]').addEventListener('click', () => App.navegarPara('niveis'));
      raiz.querySelector('[data-acao="repetir"]').addEventListener('click', () =>
        App.navegarPara('silabas', { modo: 'praticar' })
      );
      requestAnimationFrame(() => Navegacao.focarPrimeiro());
      Narrador.falar('Você completou este nível! Parabéns!');
    }

    montarRodada();
  }
};
