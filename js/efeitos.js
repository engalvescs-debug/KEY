// Efeitos visuais: variações de cor, fundo animado, confete e estrela voando.
// Tudo respeita "Reduzir animações" (não roda) e "Modo Calmo" (mais suave).

const Efeitos = (function () {
  function hexParaRgb(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function misturar(hex, alvo, quanto) {
    const [r, g, b] = hexParaRgb(hex);
    const m = c => Math.round(c + (alvo - c) * quanto);
    return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
  }

  // Variáveis CSS de cor calculadas em JS (color-mix não existe nas TVs mais antigas).
  function estiloCor(hex) {
    return `--cor:${hex};--cor-clara:${misturar(hex, 255, 0.35)};--cor-escura:${misturar(hex, 0, 0.3)};`;
  }

  const CORES_ARCO_IRIS = ['#FF6B6B', '#FF9F45', '#FFD93D', '#6BCB77', '#4ECDC4', '#4D96FF', '#A66DD4', '#FF7EB6'];

  function arcoIris(texto) {
    let i = 0;
    return Array.from(texto).map(ch => {
      if (ch === ' ') return ' ';
      const cor = CORES_ARCO_IRIS[i % CORES_ARCO_IRIS.length];
      return `<span class="letra-arco" style="color:${cor};--i:${i++}">${ch}</span>`;
    }).join('');
  }

  function animacoesDesligadas() {
    return document.body.classList.contains('reduzir-animacoes');
  }

  function montarFundo() {
    const fundo = document.getElementById('fundo-animado');
    if (!fundo || fundo.childElementCount) return;
    const itens = ['A', 'B', 'C', 'O', 'E', 'U', 'I', 'M', '⭐', '🎈', '✨', '🫧', '⭐', 'L', 'P', '🎈'];
    itens.forEach((conteudo, i) => {
      const el = document.createElement('span');
      el.className = 'flutuante';
      el.textContent = conteudo;
      el.style.left = `${(i * 97) % 100}vw`;
      el.style.color = CORES_ARCO_IRIS[i % CORES_ARCO_IRIS.length];
      el.style.fontSize = `${3 + (i % 4) * 1.4}vw`;
      el.style.animationDuration = `${24 + (i % 5) * 7}s`;
      el.style.animationDelay = `-${(i * 5.3) % 30}s`;
      fundo.appendChild(el);
    });
    ['☁️', '☁️', '☁️'].forEach((c, i) => {
      const el = document.createElement('span');
      el.className = 'nuvem';
      el.textContent = c;
      el.style.top = `${4 + i * 11}vh`;
      el.style.animationDuration = `${70 + i * 25}s`;
      el.style.animationDelay = `-${i * 30}s`;
      fundo.appendChild(el);
    });
  }

  function confete(quantidade = 40) {
    if (animacoesDesligadas()) return;
    const calmo = document.body.classList.contains('modo-calmo');
    const qtd = calmo ? Math.round(quantidade / 3) : quantidade;
    const camada = document.createElement('div');
    camada.className = 'camada-confete';
    for (let i = 0; i < qtd; i++) {
      const p = document.createElement('span');
      p.className = 'confete';
      const forma = i % 3;
      if (forma === 2) p.textContent = i % 2 ? '⭐' : '✨';
      else p.style.background = CORES_ARCO_IRIS[i % CORES_ARCO_IRIS.length];
      if (forma === 1) p.style.borderRadius = '50%';
      const angulo = Math.random() * Math.PI * 2;
      const forca = 20 + Math.random() * 30;
      p.style.setProperty('--dx', `${Math.cos(angulo) * forca}vw`);
      p.style.setProperty('--dy', `${Math.sin(angulo) * forca * 0.7 + 25}vh`);
      p.style.setProperty('--giro', `${Math.random() * 720 - 360}deg`);
      p.style.animationDuration = `${calmo ? 2.2 : 1.3 + Math.random() * 0.8}s`;
      camada.appendChild(p);
    }
    document.body.appendChild(camada);
    setTimeout(() => camada.remove(), 2600);
  }

  // Uma estrelinha sai do cartão acertado e voa até o contador de estrelas.
  function estrelaVoa(origem, aoChegar = () => {}) {
    const destino = document.querySelector('.progresso-estrelas');
    if (!origem || !destino || animacoesDesligadas() || !Element.prototype.animate) return aoChegar();
    const a = origem.getBoundingClientRect();
    const b = destino.getBoundingClientRect();
    const estrela = document.createElement('span');
    estrela.className = 'estrela-voando';
    estrela.textContent = '⭐';
    estrela.style.left = `${a.left + a.width / 2}px`;
    estrela.style.top = `${a.top + a.height / 2}px`;
    document.body.appendChild(estrela);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    estrela.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.4}px), calc(-50% + ${dy * 0.4 - 80}px)) scale(1.8)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.6)`, opacity: 0.4 }
    ], { duration: 900, easing: 'ease-in-out' }).onfinish = () => {
      estrela.remove();
      aoChegar();
      destino.classList.remove('pulo');
      void destino.offsetWidth;
      destino.classList.add('pulo');
    };
  }

  function tremer(el) {
    if (!el || animacoesDesligadas()) return;
    el.classList.remove('balancar');
    void el.offsetWidth;
    el.classList.add('balancar');
  }

  return { estiloCor, arcoIris, montarFundo, confete, estrelaVoa, tremer };
})();
