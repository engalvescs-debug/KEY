var Telas = window.Telas || {};

// Letras de som parecido nunca aparecem juntas como opção (evita confundir
// quem está começando: C/S, G/J, B/P...).
const LETRAS_PARECIDAS = {
  B: 'P', P: 'B', D: 'T', T: 'D', F: 'V', V: 'F', G: 'J', J: 'G', M: 'N', N: 'M',
  C: 'SKQZ', S: 'CZX', Z: 'SC', K: 'CQ', Q: 'CK', X: 'SC'
};
const SEM_ACENTO = { Á: 'A', Â: 'A', Ã: 'A', É: 'E', Ê: 'E', Í: 'I', Ó: 'O', Ô: 'O', Õ: 'O', Ú: 'U', Ç: 'C' };
const PARTICULAS = { estrelas: '✨', folhas: '🍃', bolhas: '', faiscas: '✨', neve: '❄️', coracoes: '💖' };

function baseLetra(ch) {
  return SEM_ACENTO[ch] || ch;
}

function temaDaHistoria(h) {
  if (!h._tema) h._tema = { bpm: h.tema.bpm, baixo: h.tema.baixo, versos: h.cancao.notas };
  return h._tema;
}

function destacarPalavras(texto, destaques, cor) {
  const mapa = {};
  (destaques || []).forEach(s => { mapa[s.replace(/-/g, '')] = s; });
  return texto.replace(/[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,}/g, palavra => mapa[palavra]
    ? `<span class="palavra-destaque focavel" data-silabas="${mapa[palavra]}" style="${Efeitos.estiloCor(cor)}">${palavra}</span>`
    : palavra);
}

function cenaHtml(cena) {
  let particulas = '';
  if (cena.p) {
    for (let i = 0; i < 10; i++) {
      particulas += `<span class="part part-${cena.p}" style="left:${(i * 37 + 7) % 100}%;top:${(i * 53 + 11) % 90}%;animation-delay:-${(i * 0.7).toFixed(1)}s">${PARTICULAS[cena.p]}</span>`;
    }
  }
  const atores = cena.a.map(([e, x, y, t, anim, op = {}]) => {
    const conteudo = e[0] === '@' ? PERSONAGENS[e.slice(1)] : e;
    const classes = `ator ${op.s ? 'focavel ator-som' : ''} ${op.f ? 'f-' + op.f : ''}`;
    return `<span class="${classes}" data-som="${op.s || ''}" style="left:${x}%;top:${y}%;--t:${t}">` +
      `<span class="ator-corpo anim-${anim || 'nada'}" style="animation-delay:${op.d || 0}s">${conteudo}</span></span>`;
  }).join('');
  return `<div class="cena fundo-${cena.f}">${particulas}${atores}</div>`;
}

Telas.historiaLeitura = function (raiz, { id, pagina }) {
  const historia = CONTENT.historias.find(h => h.id === id);
  const total = historia.paginas.length;
  const geracao = App.geracao;
  const naMesmaTela = () => geracao === App.geracao;
  const estiloHistoria = Efeitos.estiloCor(historia.cor);
  Musica.definirTema(temaDaHistoria(historia));

  const irPara = p => {
    Som.pagina();
    App.navegarPara('historiaLeitura', { id, pagina: p }, { empilhar: false });
  };
  const sair = () => App.navegarPara('historias', {}, { aPartirDoMenu: true });

  if (pagina >= total) return renderPergunta();
  const pag = historia.paginas[pagina];
  if (pag.t === 'desafio') return renderDesafio();
  if (pag.t === 'musica') return renderMusica();
  return renderTexto();

  function moldura(conteudo, botoesExtras = '') {
    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela tela-historia">
        <h1 class="titulo titulo-livro" style="${estiloHistoria}">${historia.titulo}</h1>
        <div class="pagina-livro" style="${estiloHistoria}">${conteudo}</div>
        ${bolinhasProgresso(total + 1, pagina)}
        <div class="barra-inferior">
          ${botao('sair', '⬅️ Sair')}
          ${pagina > 0 ? botao('anterior', '◀') : ''}
          ${botoesExtras}
          ${botao('proxima', 'Próxima ▶', true)}
        </div>
      </div>
    `;
    ligarAcoes(raiz, {
      sair,
      anterior: () => irPara(pagina - 1),
      proxima: () => irPara(pagina + 1)
    });
  }

  function focarEm(acao) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const itens = Array.from(document.querySelectorAll('.focavel')).filter(el => el.offsetParent !== null);
      const i = itens.findIndex(el => el.dataset.acao === acao);
      if (i >= 0) Navegacao.focar(i, true);
    }));
  }

  function depois(ms, fn) {
    setTimeout(() => { if (naMesmaTela()) fn(); }, ms);
  }

  function acertou(el, chave, avancar = true) {
    el.classList.add('acertou');
    Som.conquista();
    Mascote.comemorar();
    Mascote.dizer(sorteio(FALAS.acertos));
    App.marcarConcluido('desafios', `${historia.id}-${chave}`, el);
    if (avancar) depois(2400, () => irPara(pagina + 1));
  }

  function errou(el, fala, certo, erros) {
    Efeitos.tremer(el);
    Som.quase();
    Mascote.pensar();
    Mascote.dizer([sorteio(FALAS.quase), ...fala]);
    if (erros >= 2 && certo) certo.classList.add('dica');
  }

  function renderTexto() {
    moldura(`
      ${cenaHtml(pag.cena)}
      <p class="texto-historia">${destacarPalavras(pag.texto, pag.d, historia.cor)}</p>
      <div class="silabas-popup"></div>
    `, botao('repetir', '🔊 Ler de novo'));

    ligarAcoes(raiz, { repetir: () => Mascote.dizer(pag.texto, { semBalao: true }) });

    const popup = raiz.querySelector('.silabas-popup');
    raiz.querySelectorAll('[data-silabas]').forEach(el => {
      el.addEventListener('click', () => {
        const partes = el.dataset.silabas.split('-');
        const palavra = partes.join('');
        popup.innerHTML =
          partes.map((s, i) => `<span class="silaba-pilula" style="${estiloHistoria}--i:${i}">${s}</span>`).join('<span class="silaba-sep">-</span>') +
          `<span class="silaba-sep">=</span><span class="silaba-palavra">${palavra}</span>`;
        popup.classList.remove('visivel');
        void popup.offsetWidth;
        popup.classList.add('visivel');
        Som.pop();
        Efeitos.tremer(el);
        const fala = `${partes.map(s => s.toLowerCase()).join(', ')}... ${palavra.toLowerCase()}`;
        Mascote.dizer(fala, { devagar: true, balao: `${partes.join(' - ')} = ${palavra}` });
      });
    });

    raiz.querySelectorAll('.ator-som').forEach(el => {
      el.addEventListener('click', () => {
        Som.efeito(el.dataset.som);
        el.classList.remove('tocado');
        void el.offsetWidth;
        el.classList.add('tocado');
      });
    });

    focarEm('proxima');
    if (pag.som) depois(250, () => Som.efeito(pag.som));
    if (App.progresso.preferencias.narracaoAutomatica) {
      depois(pag.som ? 1300 : 300, () => Mascote.dizer(pag.texto, { semBalao: true }));
    }
  }

  function renderDesafio() {
    const palavra = pag.palavra;

    if (pag.modo === 'montar') {
      moldura(`<h2 class="pergunta-desafio">🧩 Monte a palavra!</h2><div class="area-montar"></div>`,
        botao('ouvir', '🔊 Ouvir'));
      const outras = CONTENT.historias.flatMap(h => h.paginas.filter(p => p.modo === 'montar' && p.palavra !== palavra).flatMap(p => p.silabas));
      montarPalavraUI(raiz.querySelector('.area-montar'), {
        palavra, silabas: pag.silabas, emoji: pag.emoji, cor: historia.cor,
        distratores: embaralhar(outras),
        aoConcluir: el => {
          App.marcarConcluido('desafios', `${historia.id}-${pagina}`, el);
          depois(2800, () => irPara(pagina + 1));
        }
      });
      ligarAcoes(raiz, { ouvir: () => Mascote.dizer(palavra, { devagar: true }) });
      requestAnimationFrame(() => Navegacao.focarPrimeiro());
      Mascote.dizer([FALAS.montarPalavra, palavra, FALAS.montarDica], { balao: `${FALAS.montarPalavra} ${palavra}! ${FALAS.montarDica}` });
      return;
    }

    let correta;
    let opcoes;
    let palavraHtml;
    let fala;
    let posicaoVogal = -1;

    if (pag.modo === 'vogal') {
      posicaoVogal = Array.from(palavra).findIndex(ch => 'AEIOU'.includes(baseLetra(ch)));
      correta = baseLetra(palavra[posicaoVogal]);
      opcoes = embaralhar([correta, ...embaralhar('AEIOU'.split('').filter(v => v !== correta)).slice(0, 2)]);
      palavraHtml = Array.from(palavra).map((ch, i) =>
        `<span class="letra-caixa ${i === posicaoVogal ? 'vazia' : ''}" ${i === posicaoVogal ? 'data-lacuna' : ''}>${i === posicaoVogal ? '?' : ch}</span>`).join('');
      fala = [FALAS.vogalFaltando, palavra];
    } else {
      correta = baseLetra(palavra[0]);
      const evitar = correta + (LETRAS_PARECIDAS[correta] || '');
      const pool = 'ABCDEFGILMNOPRSTUVZ'.split('').filter(l => !evitar.includes(l));
      opcoes = embaralhar([correta, ...embaralhar(pool).slice(0, 2)]);
      palavraHtml = Array.from(palavra).map((ch, i) =>
        `<span class="letra-caixa ${i === 0 ? 'vazia' : ''}" ${i === 0 ? 'data-lacuna' : ''}>${i === 0 ? '?' : ch}</span>`).join('');
      fala = [FALAS.letraInicial, palavra];
    }

    moldura(`
      <h2 class="pergunta-desafio">${pag.modo === 'vogal' ? '🔤 Qual vogal está faltando?' : '🔡 Com qual letra começa?'}</h2>
      <div class="palavra-desafio"><span class="emoji-desafio">${pag.emoji}</span><span class="letras">${palavraHtml}</span></div>
      <div class="grade grade-quiz grade-desafio">
        ${opcoes.map((l, i) => `
          <div class="cartao focavel" data-letra="${l}" style="${Efeitos.estiloCor(['#FF9F45', '#4D96FF', '#6BCB77'][i])}--i:${i}">
            <div class="letra">${l}</div>
          </div>
        `).join('')}
      </div>
    `, botao('ouvir', '🔊 Ouvir'));

    ligarAcoes(raiz, { ouvir: () => Mascote.dizer(fala) });

    let erros = 0;
    let resolvido = false;
    raiz.querySelectorAll('[data-letra]').forEach(el => {
      el.addEventListener('click', () => {
        if (resolvido) return;
        if (el.dataset.letra === correta) {
          resolvido = true;
          const lacuna = raiz.querySelector('[data-lacuna]');
          lacuna.textContent = palavra[pag.modo === 'vogal' ? posicaoVogal : 0];
          lacuna.classList.remove('vazia');
          lacuna.classList.add('preenchida');
          acertou(el, pagina);
        } else {
          erros += 1;
          errou(el, fala, raiz.querySelector(`[data-letra="${correta}"]`), erros);
        }
      });
    });

    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Mascote.dizer(fala);
  }

  function renderMusica() {
    const cancao = historia.cancao;
    const silabasPorVerso = [];
    const versosHtml = cancao.versos.map((verso, v) => {
      let s = 0;
      const html = verso.split(' ').map(palavra =>
        `<span class="palavra-k">${palavra.split('-').map(sil => `<span class="silaba-k" data-v="${v}" data-s="${s++}">${sil}</span>`).join('')}</span>`
      ).join(' ');
      silabasPorVerso.push(s);
      return `<div class="verso">${html}</div>`;
    }).join('');

    moldura(`
      <h2 class="pergunta-desafio">🎵 ${cancao.titulo}</h2>
      <div class="karaoke">${versosHtml}</div>
    `, botao('cantar', '🎤 Cantar de novo'));

    function cantar() {
      raiz.querySelectorAll('.silaba-k').forEach(el => el.classList.remove('ativa', 'cantada'));
      Mascote.dancar(true);
      Cancao.tocar({ silabasPorVerso, notas: cancao.notas, bpm: historia.tema.bpm, baixo: historia.tema.baixo }, (v, i) => {
        const anterior = raiz.querySelector('.silaba-k.ativa');
        if (anterior) {
          anterior.classList.remove('ativa');
          anterior.classList.add('cantada');
        }
        const atual = raiz.querySelector(`.silaba-k[data-v="${v}"][data-s="${i}"]`);
        if (atual) atual.classList.add('ativa');
      }, () => {
        if (!naMesmaTela()) return;
        Mascote.dancar(false);
        raiz.querySelectorAll('.silaba-k').forEach(el => { el.classList.remove('ativa'); el.classList.add('cantada'); });
        Mascote.comemorar();
        App.marcarConcluido('desafios', `${historia.id}-musica`, raiz.querySelector('.karaoke'));
      });
    }

    ligarAcoes(raiz, { cantar: () => { Narrador.parar(); cantar(); } });
    focarEm('proxima');
    Mascote.dizer(FALAS.horaMusica).then(() => depois(300, cantar));
  }

  function renderPergunta() {
    const pergunta = historia.pergunta;
    moldura(`
      <h2 class="pergunta-desafio">🤔 ${pergunta.texto}</h2>
      <div class="grade grade-quiz grade-desafio">
        ${pergunta.opcoes.map((op, i) => `
          <div class="cartao focavel" data-i="${i}" style="${Efeitos.estiloCor(i ? '#4ECDC4' : '#FF9F45')}--i:${i}">
            <div class="emoji">${op.emoji}</div>
            <div class="rotulo">${op.texto}</div>
          </div>
        `).join('')}
      </div>
    `, botao('ouvir', '🔊 Ouvir'));

    ligarAcoes(raiz, { ouvir: () => Mascote.dizer(pergunta.texto) });

    let erros = 0;
    let resolvido = false;
    raiz.querySelectorAll('[data-i]').forEach(el => {
      const opcao = pergunta.opcoes[Number(el.dataset.i)];
      el.addEventListener('click', () => {
        if (resolvido) return;
        if (opcao.correta) {
          resolvido = true;
          el.classList.add('acertou');
          Som.conquista();
          Mascote.comemorar();
          Mascote.dizer(FALAS.historiaAcerto);
          App.marcarConcluido('historias', historia.id, el);
          depois(2600, renderFim);
        } else {
          erros += 1;
          const certo = raiz.querySelector(`[data-i="${pergunta.opcoes.findIndex(o => o.correta)}"]`);
          errou(el, [pergunta.texto], certo, erros);
        }
      });
    });

    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Mascote.dizer(pergunta.texto);
  }

  function renderFim() {
    raiz.innerHTML = `
      ${App.estrelasHtml()}
      <div class="tela tela-celebracao">
        <h1 class="titulo">${Efeitos.arcoIris('Fim!')}</h1>
        <div class="trofeu">📚</div>
        <h2 class="subtitulo">Você leu: ${historia.titulo}</h2>
        <div class="barra-inferior">
          ${botao('outras', '📚 Outras histórias', true)}
          ${botao('denovo', '🔁 Ler de novo')}
        </div>
      </div>
    `;
    ligarAcoes(raiz, { outras: sair, denovo: () => irPara(0) });
    requestAnimationFrame(() => Navegacao.focarPrimeiro());
    Efeitos.confete(60);
    Som.conquista();
    Mascote.comemorar(false);
    Mascote.dizer(FALAS.fimHistoria);
  }
};
