var Telas = window.Telas || {};

const DEFINICAO_NIVEIS = [
  { id: 'vogais', numero: 1, titulo: 'Vogais', emoji: '🔤', tela: 'aprender', params: { categoria: 'vogais' }, total: CONTENT.vogais.length },
  { id: 'alfabeto', numero: 2, titulo: 'Alfabeto', emoji: '🔡', tela: 'aprender', params: { categoria: 'alfabeto' }, total: CONTENT.alfabeto.length },
  { id: 'silabas', numero: 3, titulo: 'Sílabas', emoji: '🧩', tela: 'silabas', params: {}, total: CONTENT.silabas.reduce((s, g) => s + g.itens.length, 0) },
  { id: 'palavras', numero: 4, titulo: 'Montar Palavras', emoji: '🏗️', tela: 'montarPalavras', params: {}, total: CONTENT.palavras.length }
];

function progressoNivel(nivel) {
  const feitos = (App.progresso.concluidos[nivel.id] || []).length;
  return { feitos, total: nivel.total, completo: nivel.total > 0 && feitos >= nivel.total };
}

Telas.niveis = function (raiz) {
  const cartoes = DEFINICAO_NIVEIS.map((nivel, i) => {
    const { feitos, total, completo } = progressoNivel(nivel);
    const anteriorCompleto = i === 0 || progressoNivel(DEFINICAO_NIVEIS[i - 1]).completo;
    const selo = completo ? '✅' : (anteriorCompleto ? '' : '💡');
    return `
      <div class="cartao focavel" data-nivel="${i}" style="border-color:${completo ? '#6BCB77' : 'transparent'}">
        <div class="emoji">${nivel.emoji}</div>
        <div class="letra" style="font-size:1.6vw">Nível ${nivel.numero}</div>
        <div class="palavra">${nivel.titulo} ${selo}</div>
        <div class="palavra">${feitos}/${total} ⭐</div>
      </div>
    `;
  }).join('');

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">🎮 Jogo dos Níveis</h1>
      <h2 class="subtitulo">Vamos passo a passo: vogais, letras, sílabas e palavras!</h2>
      <div class="grade">${cartoes}</div>
      <div class="barra-inferior">
        <div class="botao focavel" data-acao="voltar">⬅️ Voltar</div>
      </div>
    </div>
  `;

  raiz.querySelectorAll('[data-nivel]').forEach(el => {
    const nivel = DEFINICAO_NIVEIS[Number(el.dataset.nivel)];
    el.addEventListener('click', () => App.navegarPara(nivel.tela, nivel.params));
  });
  raiz.querySelector('[data-acao="voltar"]').addEventListener('click', () => App.voltar());

  App.narrarAoAbrir('Escolha um nível para jogar.');
};
