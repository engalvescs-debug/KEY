var Telas = window.Telas || {};

const DEFINICAO_NIVEIS = [
  { id: 'vogais', numero: 1, titulo: 'Vogais', emoji: '🔤', cor: '#FF6B6B', tela: 'aprender', params: { categoria: 'vogais' }, total: CONTENT.vogais.length },
  { id: 'alfabeto', numero: 2, titulo: 'Alfabeto', emoji: '🔡', cor: '#FF9F45', tela: 'aprender', params: { categoria: 'alfabeto' }, total: CONTENT.alfabeto.length },
  { id: 'silabas', numero: 3, titulo: 'Sílabas', emoji: '🧩', cor: '#4D96FF', tela: 'silabas', params: {}, total: CONTENT.silabas.reduce((s, g) => s + g.itens.length, 0) },
  { id: 'palavras', numero: 4, titulo: 'Palavras', emoji: '🏗️', cor: '#A66DD4', tela: 'montarPalavras', params: {}, total: CONTENT.palavras.length }
];

function progressoNivel(nivel) {
  const feitos = (App.progresso.concluidos[nivel.id] || []).length;
  return { feitos, total: nivel.total, completo: nivel.total > 0 && feitos >= nivel.total };
}

Telas.niveis = function (raiz) {
  // Sugere o próximo nível sem travar os outros (bloqueio frustra a criança).
  const sugerido = DEFINICAO_NIVEIS.findIndex(n => !progressoNivel(n).completo);

  const cartoes = DEFINICAO_NIVEIS.map((nivel, i) => {
    const { feitos, total, completo } = progressoNivel(nivel);
    const pct = Math.round((feitos / total) * 100);
    return `
      <div class="cartao cartao-nivel focavel ${i === sugerido ? 'sugerido' : ''}" data-nivel="${i}" style="${Efeitos.estiloCor(nivel.cor)}--i:${i}">
        <div class="selo-numero">${completo ? '✅' : nivel.numero}</div>
        <div class="emoji">${nivel.emoji}</div>
        <div class="rotulo">${nivel.titulo}</div>
        <div class="barra-progresso"><span style="width:${pct}%"></span></div>
        <div class="palavra">⭐ ${feitos}/${total}</div>
        ${i === sugerido ? '<div class="fita">Próximo!</div>' : ''}
      </div>
    `;
  }).join('<div class="trilha-seta">➜</div>');

  raiz.innerHTML = `
    ${App.estrelasHtml()}
    <div class="tela">
      <h1 class="titulo">🎮 Escolha o nível</h1>
      <h2 class="subtitulo">Passo a passo: vogais, letras, sílabas e palavras!</h2>
      <div class="grade grade-trilha">${cartoes}</div>
      <div class="barra-inferior">${botao('voltar', '⬅️ Voltar')}</div>
    </div>
  `;

  raiz.querySelectorAll('[data-nivel]').forEach(el => {
    const nivel = DEFINICAO_NIVEIS[Number(el.dataset.nivel)];
    el.addEventListener('click', () => { Som.pop(); App.navegarPara(nivel.tela, nivel.params); });
  });
  ligarAcoes(raiz, { voltar: () => App.voltar() });

  App.narrarAoAbrir(FALAS.niveis);
  if (sugerido > 0) requestAnimationFrame(() => requestAnimationFrame(() => Navegacao.focar(sugerido, true)));
};
