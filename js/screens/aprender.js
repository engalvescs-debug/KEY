var Telas = window.Telas || {};

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

const ROTULO_CATEGORIA = {
  vogais: { titulo: 'Vogais', pergunta: 'a vogal' },
  alfabeto: { titulo: 'Alfabeto', pergunta: 'a letra' }
};

Telas.aprender = function (raiz, { categoria, modo = 'explorar' }) {
  const itens = CONTENT[categoria];
  const rotulo = ROTULO_CATEGORIA[categoria];

  if (modo === 'explorar') renderExplorar();
  else renderPraticar();

  function renderExplorar() {
    const cartoes = itens.map(item => `
      <div class="cartao focavel" data-id="${item.id}" style="border-color:${item.cor}22">
        <div class="emoji">${item.emoji}</div>
        <div class="letra" style="color:${item.cor}">${item.id}</div>
        <div class="palavra">${item.palavra}</div>
      </div>
    `).join('');

    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela">
        <h1 class="titulo">${rotulo.titulo}</h1>
        <h2 class="subtitulo">Toque para ouvir. Depois vamos praticar!</h2>
        <div class="grade">${cartoes}</div>
        <div class="barra-inferior">
          <div class="botao focavel" data-acao="voltar">⬅️ Voltar</div>
          <div class="botao principal focavel" data-acao="praticar">🎯 Praticar</div>
        </div>
      </div>
    `;

    raiz.querySelectorAll('[data-id]').forEach(el => {
      const item = itens.find(i => i.id === el.dataset.id);
      el.addEventListener('click', () => Narrador.falar(`${item.id}. ${item.palavra}.`));
    });
    raiz.querySelector('[data-acao="voltar"]').addEventListener('click', () => App.voltar());
    raiz.querySelector('[data-acao="praticar"]').addEventListener('click', () =>
      App.navegarPara('aprender', { categoria, modo: 'praticar' })
    );

    App.narrarAoAbrir(`Vamos conhecer ${rotulo.pergunta === 'a vogal' ? 'as vogais' : 'o alfabeto'}.`);
  }

  function renderPraticar() {
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
          <h1 class="titulo">Encontre ${rotulo.pergunta} ${alvo.id}</h1>
          <div class="painel-mensagem" id="mensagem"></div>
          <div class="grade">
            ${opcoes.map(op => `
              <div class="cartao focavel" data-id="${op.id}" style="border-color:${op.cor}22">
                <div class="emoji">${op.emoji}</div>
                <div class="letra" style="color:${op.cor}">${op.id}</div>
                <div class="palavra">${op.palavra}</div>
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
        el.addEventListener('click', () => escolher(el, opcoes.find(o => o.id === el.dataset.id), alvo));
      });

      requestAnimationFrame(() => Navegacao.focarPrimeiro());
      Narrador.falar(`Encontre ${rotulo.pergunta} ${alvo.id}.`);
    }

    function escolher(el, escolhido, alvo) {
      if (travado) return;
      const mensagem = document.getElementById('mensagem');

      if (escolhido.id === alvo.id) {
        travado = true;
        el.style.borderColor = '#6BCB77';
        mensagem.innerHTML = '<span class="mensagem-gentil">🎉 Isso! Muito bem!</span>';
        Narrador.tocarConquista();
        Narrador.falar('Isso! Muito bem!');
        App.marcarConcluido(categoria, alvo.id);
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
          <h2 class="subtitulo">Terminou ${rotulo.titulo}. Parabéns!</h2>
          <div class="grade" style="font-size:6vw">🎉🌟🎊</div>
          <div class="barra-inferior">
            <div class="botao focavel" data-acao="niveis">🎮 Ver Níveis</div>
            <div class="botao principal focavel" data-acao="repetir">🔁 Jogar de Novo</div>
          </div>
        </div>
      `;
      raiz.querySelector('[data-acao="niveis"]').addEventListener('click', () => App.navegarPara('niveis'));
      raiz.querySelector('[data-acao="repetir"]').addEventListener('click', () =>
        App.navegarPara('aprender', { categoria, modo: 'praticar' })
      );
      requestAnimationFrame(() => Navegacao.focarPrimeiro());
      Narrador.falar('Você completou este nível! Parabéns!');
    }

    montarRodada();
  }
};
