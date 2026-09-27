// Navegação espacial por controle remoto de TV (setas + OK/Enter + Voltar).
// Funciona com teclado normal (testes no PC) e com os key codes que
// controles remotos de Smart TV (Tizen/WebOS/Android TV) emitem no navegador.

const Navegacao = (function () {
  let indiceAtual = -1;

  const TECLA_VOLTAR = new Set(['Escape', 'Backspace', 'GoBack', 10009, 461]);
  const TECLA_OK = new Set(['Enter', ' ', 13]);

  function itensFocaveis() {
    return Array.from(document.querySelectorAll('.focavel')).filter(
      el => el.offsetParent !== null // visível na tela
    );
  }

  function centro(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function focar(indice, silencioso = false) {
    const itens = itensFocaveis();
    if (!itens.length) return;
    indiceAtual = Math.max(0, Math.min(indice, itens.length - 1));
    itens.forEach(el => el.classList.remove('focado'));
    const alvo = itens[indiceAtual];
    alvo.classList.add('focado');
    alvo.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (!silencioso) Som.blip();
    window.dispatchEvent(new CustomEvent('foco', { detail: alvo }));
  }

  // Toque/mouse também move o destaque, para o foco nunca "sumir".
  document.addEventListener('pointerdown', e => {
    const alvo = e.target.closest && e.target.closest('.focavel');
    if (!alvo) return;
    const i = itensFocaveis().indexOf(alvo);
    if (i >= 0) focar(i, true);
  });

  function focarPrimeiro() {
    indiceAtual = -1;
    focar(0, true);
  }

  function mover(direcao) {
    const itens = itensFocaveis();
    if (!itens.length) return;
    if (indiceAtual < 0 || indiceAtual >= itens.length) {
      focar(0);
      return;
    }
    const atual = centro(itens[indiceAtual]);
    let melhor = -1;
    let melhorDistancia = Infinity;

    itens.forEach((el, i) => {
      if (i === indiceAtual) return;
      const p = centro(el);
      const dx = p.x - atual.x;
      const dy = p.y - atual.y;

      const naDirecao =
        (direcao === 'right' && dx > 4) ||
        (direcao === 'left' && dx < -4) ||
        (direcao === 'down' && dy > 4) ||
        (direcao === 'up' && dy < -4);

      if (!naDirecao) return;

      // Penaliza desalinhamento no eixo perpendicular para preferir
      // itens "na mesma linha/coluna" antes de pular de posição.
      const perpendicular = direcao === 'left' || direcao === 'right' ? Math.abs(dy) : Math.abs(dx);
      const distancia = Math.sqrt(dx * dx + dy * dy) + perpendicular * 1.5;

      if (distancia < melhorDistancia) {
        melhorDistancia = distancia;
        melhor = i;
      }
    });

    if (melhor >= 0) focar(melhor);
  }

  function ativarFocado() {
    const itens = itensFocaveis();
    const el = itens[indiceAtual];
    if (el) el.click();
  }

  function tratarTecla(evento) {
    const codigo = evento.keyCode || evento.key;
    const tecla = evento.key;

    if (tecla === 'ArrowUp' || codigo === 38) { evento.preventDefault(); mover('up'); }
    else if (tecla === 'ArrowDown' || codigo === 40) { evento.preventDefault(); mover('down'); }
    else if (tecla === 'ArrowLeft' || codigo === 37) { evento.preventDefault(); mover('left'); }
    else if (tecla === 'ArrowRight' || codigo === 39) { evento.preventDefault(); mover('right'); }
    else if (TECLA_OK.has(tecla) || TECLA_OK.has(codigo)) { evento.preventDefault(); ativarFocado(); }
    else if (TECLA_VOLTAR.has(tecla) || TECLA_VOLTAR.has(codigo)) {
      evento.preventDefault();
      if (typeof App !== 'undefined') App.voltar();
    }
  }

  window.addEventListener('keydown', tratarTecla);

  return { focarPrimeiro, focar, mover, ativarFocado };
})();
