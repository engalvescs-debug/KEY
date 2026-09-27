// Persistência simples de progresso e preferências (localStorage).
// Tudo é opcional/best-effort: se o navegador da TV bloquear localStorage,
// o jogo continua funcionando, só não lembra o progresso entre sessões.

const STORAGE_KEY = 'aprender-ler:progresso';

function estadoPadrao() {
  return {
    estrelas: 0,
    concluidos: {
      vogais: [],
      alfabeto: [],
      silabas: [],
      palavras: [],
      historias: []
    },
    preferencias: {
      modoCalmo: false,
      reduzirAnimacoes: false,
      narracaoAutomatica: true,
      musica: true,
      volume: 0.8
    }
  };
}

function carregarProgresso() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return estadoPadrao();
    const dados = JSON.parse(raw);
    // Mescla com o padrão para tolerar versões antigas do formato salvo.
    const padrao = estadoPadrao();
    return {
      ...padrao,
      ...dados,
      concluidos: { ...padrao.concluidos, ...(dados.concluidos || {}) },
      preferencias: { ...padrao.preferencias, ...(dados.preferencias || {}) }
    };
  } catch (e) {
    return estadoPadrao();
  }
}

function salvarProgresso(estado) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch (e) {
    // Armazenamento indisponível: segue o jogo sem persistir.
  }
}

function marcarConcluido(estado, categoria, itemId) {
  const lista = estado.concluidos[categoria] || (estado.concluidos[categoria] = []);
  if (!lista.includes(itemId)) {
    lista.push(itemId);
    estado.estrelas += 1;
  }
  salvarProgresso(estado);
  return estado;
}
