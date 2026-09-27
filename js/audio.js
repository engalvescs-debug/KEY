// Narração por voz (Text-to-Speech) usando a Web Speech API, disponível
// nos navegadores baseados em Chromium das Smart TVs (Tizen, WebOS, Android TV).
// Sempre falha em silêncio se a API não existir, nunca quebra o jogo.

const Narrador = (function () {
  let vozPt = null;
  let volumeAtual = 0.8;

  function carregarVoz() {
    if (!('speechSynthesis' in window)) return;
    const vozes = speechSynthesis.getVoices();
    vozPt =
      vozes.find(v => v.lang === 'pt-BR') ||
      vozes.find(v => v.lang && v.lang.startsWith('pt')) ||
      null;
  }

  if ('speechSynthesis' in window) {
    carregarVoz();
    speechSynthesis.onvoiceschanged = carregarVoz;
  }

  function definirVolume(v) {
    volumeAtual = Math.max(0, Math.min(1, v));
  }

  function falar(texto, opcoes = {}) {
    if (!('speechSynthesis' in window) || !texto) return;
    try {
      speechSynthesis.cancel(); // evita sobreposição de falas
      const utter = new SpeechSynthesisUtterance(texto);
      utter.lang = 'pt-BR';
      if (vozPt) utter.voice = vozPt;
      utter.rate = opcoes.devagar ? 0.75 : 0.9;
      utter.pitch = 1.05;
      utter.volume = volumeAtual;
      speechSynthesis.speak(utter);
    } catch (e) {
      // Ignora silenciosamente: narração é um recurso de apoio, não crítico.
    }
  }

  function parar() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  // Som de recompensa suave (sem estridência), gerado via WebAudio,
  // pensado para não assustar crianças sensíveis a som (autismo).
  function tocarConquista() {
    tocarTom([523.25, 659.25, 783.99], 0.12);
  }

  function tocarAvanco() {
    tocarTom([440], 0.08);
  }

  function tocarTom(frequencias, duracao) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      frequencias.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const inicio = ctx.currentTime + i * duracao;
        gain.gain.setValueAtTime(0, inicio);
        gain.gain.linearRampToValueAtTime(volumeAtual * 0.3, inicio + 0.02);
        gain.gain.linearRampToValueAtTime(0, inicio + duracao);
        osc.connect(gain).connect(ctx.destination);
        osc.start(inicio);
        osc.stop(inicio + duracao + 0.02);
      });
    } catch (e) {
      // Ambiente sem WebAudio: segue sem som de recompensa.
    }
  }

  return { falar, parar, definirVolume, tocarConquista, tocarAvanco };
})();
