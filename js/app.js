// Controlador central: pilha de telas, progresso e helpers de UI
// compartilhados entre as telas (js/screens/*.js).

const App = (function () {
  const raiz = document.getElementById('app');
  const pilha = []; // histórico de { nome, params } para o botão Voltar
  let progresso = carregarProgresso();

  function aplicarPreferenciasVisuais() {
    document.body.classList.toggle('modo-calmo', progresso.preferencias.modoCalmo);
    document.body.classList.toggle('reduzir-animacoes', progresso.preferencias.reduzirAnimacoes);
    Narrador.definirVolume(progresso.preferencias.volume);
  }

  function navegarPara(nome, params = {}, empilhar = true) {
    if (empilhar) pilha.push({ nome, params });
    Narrador.parar();
    raiz.innerHTML = '';
    Telas[nome](raiz, params);
    aplicarPreferenciasVisuais();
    // Dá tempo do DOM montar antes de focar o primeiro item navegável.
    requestAnimationFrame(() => Navegacao.focarPrimeiro());
  }

  function voltar() {
    if (pilha.length <= 1) return; // já está na tela inicial
    pilha.pop();
    const anterior = pilha[pilha.length - 1];
    navegarPara(anterior.nome, anterior.params, false);
  }

  function narrarAoAbrir(texto) {
    if (progresso.preferencias.narracaoAutomatica) Narrador.falar(texto);
  }

  function estrelasHtml() {
    return `<div class="progresso-estrelas">⭐ ${progresso.estrelas}</div>`;
  }

  return {
    iniciar() {
      navegarPara('menu', {});
    },
    navegarPara,
    voltar,
    narrarAoAbrir,
    estrelasHtml,
    get progresso() { return progresso; },
    salvar() { salvarProgresso(progresso); },
    marcarConcluido(categoria, id) { progresso = marcarConcluido(progresso, categoria, id); },
    atualizarPreferencia(chave, valor) {
      progresso.preferencias[chave] = valor;
      salvarProgresso(progresso);
      aplicarPreferenciasVisuais();
    }
  };
})();

window.addEventListener('DOMContentLoaded', () => App.iniciar());
