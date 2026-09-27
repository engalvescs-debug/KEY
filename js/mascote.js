// Lulu, a corujinha guia do jogo. Desenhada em SVG (sem imagem externa),
// animada por CSS: pisca, flutua, mexe o bico enquanto fala, olha para o
// cartão em foco, comemora os acertos e inclina a cabeça quando "pensa".

const Mascote = (function () {
  let area = null;
  let balao = null;
  let timerBalao = null;
  let timerEstado = null;

  function svg(extraClasse = '') {
    return `
      <svg class="lulu ${extraClasse}" viewBox="0 0 200 230" aria-hidden="true">
        <ellipse class="lulu-sombra" cx="100" cy="222" rx="55" ry="7"/>
        <g class="lulu-corpo">
          <path class="lulu-orelha" d="M46 58 L58 10 L86 44 Z"/>
          <path class="lulu-orelha" d="M154 58 L142 10 L114 44 Z"/>
          <g class="lulu-asa lulu-asa-esq"><ellipse cx="30" cy="140" rx="22" ry="46"/></g>
          <g class="lulu-asa lulu-asa-dir"><ellipse cx="170" cy="140" rx="22" ry="46"/></g>
          <ellipse class="lulu-pele" cx="100" cy="130" rx="78" ry="86"/>
          <ellipse class="lulu-barriga" cx="100" cy="160" rx="48" ry="50"/>
          <path class="lulu-pena" d="M84 150 q6 7 12 0 M104 150 q6 7 12 0 M94 168 q6 7 12 0 M84 186 q6 7 12 0 M104 186 q6 7 12 0"/>
          <circle class="lulu-bochecha" cx="48" cy="128" r="10"/>
          <circle class="lulu-bochecha" cx="152" cy="128" r="10"/>
          <g class="lulu-olho">
            <circle class="lulu-olho-fundo" cx="68" cy="98" r="30"/>
            <g class="lulu-pupila"><circle cx="70" cy="100" r="14"/><circle class="lulu-brilho" cx="75" cy="94" r="5"/></g>
          </g>
          <g class="lulu-olho">
            <circle class="lulu-olho-fundo" cx="132" cy="98" r="30"/>
            <g class="lulu-pupila"><circle cx="130" cy="100" r="14"/><circle class="lulu-brilho" cx="135" cy="94" r="5"/></g>
          </g>
          <path class="lulu-bico-baixo" d="M90 130 L110 130 L100 146 Z"/>
          <path class="lulu-bico" d="M86 120 L114 120 L100 136 Z"/>
          <ellipse class="lulu-pe" cx="80" cy="214" rx="13" ry="6"/>
          <ellipse class="lulu-pe" cx="120" cy="214" rx="13" ry="6"/>
          <path class="lulu-estrela" d="M100 18 l5 10 11 1.5 -8 7.5 2 11 -10 -5.5 -10 5.5 2 -11 -8 -7.5 11 -1.5 Z"/>
        </g>
      </svg>
    `;
  }

  function montar() {
    area = document.getElementById('mascote-area');
    if (!area) return;
    area.innerHTML = `${svg()}<div class="balao" role="status" aria-live="polite"></div>`;
    balao = area.querySelector('.balao');
    area.querySelector('.lulu').addEventListener('click', () => {
      comemorar(false);
      Narrador.falar(sorteio(FALAS.acertos));
    });

    Narrador.aoIniciar(() => area.classList.add('falando'));
    Narrador.aoTerminar(() => {
      area.classList.remove('falando');
      clearTimeout(timerBalao);
      timerBalao = setTimeout(() => balao.classList.remove('visivel'), 2500);
    });

    window.addEventListener('foco', e => olharPara(e.detail));
  }

  function mostrarBalao(texto) {
    if (!balao) return;
    clearTimeout(timerBalao);
    balao.textContent = texto;
    balao.classList.remove('visivel');
    void balao.offsetWidth;
    balao.classList.add('visivel');
  }

  // partes: texto único ou lista (ex.: ['Encontre a letra', 'B']) — cada parte
  // pode ter sua própria gravação, e o balão mostra a frase inteira.
  function dizer(partes, opcoes = {}) {
    const lista = Array.isArray(partes) ? partes : [partes];
    if (!opcoes.semBalao) mostrarBalao(opcoes.balao || lista.join(' '));
    return Narrador.falar(lista, opcoes);
  }

  function definirEstado(classe, duracao) {
    if (!area) return;
    clearTimeout(timerEstado);
    area.classList.remove('feliz', 'pensando');
    void area.offsetWidth;
    area.classList.add(classe);
    timerEstado = setTimeout(() => area.classList.remove(classe), duracao);
  }

  function comemorar(comConfete = true) {
    definirEstado('feliz', 1400);
    if (comConfete) Efeitos.confete();
  }

  function pensar() {
    definirEstado('pensando', 1400);
  }

  function olharPara(el) {
    if (!area || !el) return;
    const olhos = area.querySelector('.lulu-olho');
    if (!olhos) return;
    const o = olhos.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - (o.left + o.width / 2);
    const dy = r.top + r.height / 2 - (o.top + o.height / 2);
    const dist = Math.hypot(dx, dy) || 1;
    area.style.setProperty('--olhar-x', `${(dx / dist) * 7}px`);
    area.style.setProperty('--olhar-y', `${(dy / dist) * 6}px`);
  }

  function limparBalao() {
    if (!balao) return;
    clearTimeout(timerBalao);
    balao.classList.remove('visivel');
  }

  return { montar, svg, dizer, comemorar, pensar, olharPara, limparBalao };
})();
