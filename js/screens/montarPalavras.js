var Telas = window.Telas || {};

Telas.montarPalavras = function (raiz) {
  const ordem = embaralhar(CONTENT.palavras);
  let indice = 0;

  function montarRodada() {
    if (indice >= ordem.length) return renderCelebracao();

    const alvo = ordem[indice];
    const silabasAlvo = alvo.silabas;
    let posicao = 0; // próxima sílaba esperada

    const outrasSilabas = CONTENT.palavras
      .filter(p => p.palavra !== alvo.palavra)
      .flatMap(p => p.silabas);
    const distratores = embaralhar([...new Set(outrasSilabas.filter(s => !silabasAlvo.includes(s)))]).slice(0, 2);
    const opcoes = embaralhar([...silabasAlvo, ...distratores]);

    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela">
        <h1 class="titulo">Monte a palavra</h1>
        <div class="pagina-historia" style="gap:1vh">
          <div class="emoji-cena">${alvo.emoji}</div>
          <div class="letra" id="espacos" style="font-size:3.5vw; letter-spacing:0.2em">
            ${silabasAlvo.map(() => '__').join(' ')}
          </div>
        </div>
        <div class="painel-mensagem" id="mensagem"></div>
        <div class="grade">
          ${opcoes.map((s, i) => `
            <div class="cartao focavel" data-silaba="${s}" data-i="${i}" style="min-width:9vw">
              <div class="letra" style="color:${alvo.cor}">${s}</div>
            </div>
          `).join('')}
        </div>
        <div class="barra-inferior">
          <div class="botao focavel" data-acao="voltar">⬅️ Sair</div>
        </div>
        <p class="rodape-dicas">Toque nas sílabas na ordem certa 💛</p>
      </div>
    `;

    raiz.querySelector('[data-acao="voltar"]').addEventListener('click', () => App.voltar());
    raiz.querySelectorAll('[data-silaba]').forEach(el => {
      el.addEventListener('click', () => escolher(el));
    });

    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Narrador.falar(`Vamos montar a palavra ${alvo.palavra.toLowerCase()}. Toque nas sílabas em ordem.`);

    function escolher(el) {
      if (el.dataset.usado) return;
      const silaba = el.dataset.silaba;
      const mensagem = document.getElementById('mensagem');

      if (silaba === silabasAlvo[posicao]) {
        el.dataset.usado = '1';
        el.style.opacity = '0.35';
        el.style.borderColor = '#6BCB77';
        posicao += 1;
        Narrador.falar(silaba, { devagar: true });

        const espacos = document.getElementById('espacos');
        espacos.textContent = silabasAlvo
          .map((s, i) => (i < posicao ? s : '__'))
          .join(' ');

        if (posicao === silabasAlvo.length) {
          mensagem.innerHTML = '<span class="mensagem-gentil">🎉 Isso! Você montou a palavra!</span>';
          Narrador.tocarConquista();
          setTimeout(() => Narrador.falar(alvo.palavra), 400);
          App.marcarConcluido('palavras', alvo.palavra);
          indice += 1;
          setTimeout(montarRodada, 2000);
        }
      } else {
        mensagem.innerHTML = '<span class="mensagem-gentil">💛 Quase! Olhe os espaços e tente de novo.</span>';
        Narrador.falar('Quase! Tenta de novo.');
      }
    }
  }

  function renderCelebracao() {
    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela">
        <h1 class="titulo">🏆 Você conseguiu!</h1>
        <h2 class="subtitulo">Montou todas as palavras. Parabéns!</h2>
        <div class="grade" style="font-size:6vw">🎉🌟🎊</div>
        <div class="barra-inferior">
          <div class="botao focavel" data-acao="niveis">🎮 Ver Níveis</div>
          <div class="botao principal focavel" data-acao="repetir">🔁 Jogar de Novo</div>
        </div>
      </div>
    `;
    raiz.querySelector('[data-acao="niveis"]').addEventListener('click', () => App.navegarPara('niveis'));
    raiz.querySelector('[data-acao="repetir"]').addEventListener('click', () => App.navegarPara('montarPalavras'));
    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Narrador.falar('Você completou este nível! Parabéns!');
  }

  montarRodada();
};
