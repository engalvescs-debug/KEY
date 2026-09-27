// Controlador central: pilha de telas, progresso e preferências. As telas
// (js/screens/*.js) renderizam em #conteudo; a Lulu vive em #mascote-area.

const App = (function () {
  const raiz = document.getElementById('conteudo');
  const pilha = [];
  let progresso = carregarProgresso();
  // Muda a cada troca de tela; timers de uma tela antiga conferem isso antes de agir.
  let geracao = 0;

  function aplicarPreferencias() {
    const p = progresso.preferencias;
    document.body.classList.toggle('modo-calmo', p.modoCalmo);
    document.body.classList.toggle('reduzir-animacoes', p.reduzirAnimacoes);
    Narrador.definirVolume(p.volume);
    Som.definirVolume(p.volume);
    Som.definirSuave(p.modoCalmo);
    Musica.definirVolume(p.volume);
    Cancao.definirVolume(p.volume);
    Musica.definirCalmo(p.modoCalmo);
  }

  function navegarPara(nome, params = {}, opcoes = {}) {
    if (opcoes.substituir) pilha.length = 0;
    // Recomeça o histórico a partir do menu (ex.: "Ver Níveis" ao fim de um nível).
    if (opcoes.aPartirDoMenu) pilha.splice(0, pilha.length, { nome: 'menu', params: {} });
    if (opcoes.empilhar !== false) pilha.push({ nome, params });
    geracao += 1;
    Narrador.parar();
    Cancao.parar();
    if (nome !== 'historiaLeitura') Musica.definirTema(null);
    Mascote.limparBalao();
    Mascote.dancar(false);
    document.body.dataset.tela = nome;
    raiz.innerHTML = '';
    Telas[nome](raiz, params);
    requestAnimationFrame(() => Navegacao.focarPrimeiro());
  }

  function voltar() {
    if (pilha.length <= 1) return;
    pilha.pop();
    const anterior = pilha[pilha.length - 1];
    navegarPara(anterior.nome, anterior.params, { empilhar: false });
  }

  function narrarAoAbrir(partes) {
    if (progresso.preferencias.narracaoAutomatica) Mascote.dizer(partes);
  }

  function estrelasHtml() {
    return `<div class="progresso-estrelas"><span class="estrela-icone">⭐</span> ${progresso.estrelas}</div>`;
  }

  function comecar() {
    Som.desbloquear();
    if (progresso.preferencias.musica) Musica.iniciar();
    navegarPara('menu', {}, { substituir: true });
  }

  return {
    iniciar() {
      aplicarPreferencias();
      Efeitos.montarFundo();
      Mascote.montar();
      navegarPara('inicio', {}, { substituir: true });
    },
    comecar,
    navegarPara,
    voltar,
    narrarAoAbrir,
    estrelasHtml,
    get progresso() { return progresso; },
    get geracao() { return geracao; },
    // origem: elemento de onde a estrelinha sai voando até o contador.
    marcarConcluido(categoria, id, origem) {
      const antes = progresso.estrelas;
      progresso = marcarConcluido(progresso, categoria, id);
      if (progresso.estrelas === antes) return;
      const atualizarContador = () => {
        const el = document.querySelector('.progresso-estrelas');
        if (el) el.innerHTML = `<span class="estrela-icone">⭐</span> ${progresso.estrelas}`;
      };
      Efeitos.estrelaVoa(origem, atualizarContador);
    },
    atualizarPreferencia(chave, valor) {
      progresso.preferencias[chave] = valor;
      salvarProgresso(progresso);
      aplicarPreferencias();
      if (chave === 'musica') valor ? Musica.iniciar() : Musica.parar();
    }
  };
})();

window.addEventListener('DOMContentLoaded', () => App.iniciar());
