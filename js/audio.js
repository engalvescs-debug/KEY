// Áudio do jogo: um AudioContext compartilhado (Som), a narração (Narrador)
// e a música de fundo gerada em tempo real (Musica). Tudo falha em silêncio:
// som é apoio, nunca pode travar o jogo.

const Som = (function () {
  let ctx = null;

  function contexto() {
    if (ctx) return ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    return ctx;
  }

  // Navegadores só liberam áudio depois de um toque/tecla do usuário.
  function desbloquear() {
    const c = contexto();
    if (c && c.state === 'suspended') c.resume();
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      speechSynthesis.speak(u);
    }
  }

  function tom(freq, inicio, duracao, volume, tipo = 'sine') {
    const c = contexto();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, inicio);
    gain.gain.exponentialRampToValueAtTime(volume, inicio + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
    osc.connect(gain).connect(c.destination);
    osc.start(inicio);
    osc.stop(inicio + duracao + 0.05);
  }

  function sequencia(freqs, passo, duracao, volume, tipo) {
    const c = contexto();
    if (!c) return;
    const agora = c.currentTime + 0.01;
    freqs.forEach((f, i) => tom(f, agora + i * passo, duracao, volume, tipo));
  }

  let volumeEfeitos = 0.8;
  let efeitosSuaves = false;

  return {
    contexto,
    desbloquear,
    definirVolume(v) { volumeEfeitos = v; },
    definirSuave(s) { efeitosSuaves = s; },
    conquista() { sequencia([523.25, 659.25, 783.99, 1046.5], 0.09, 0.35, 0.18 * volumeEfeitos, 'triangle'); },
    quase() { sequencia([440, 392], 0.14, 0.3, 0.1 * volumeEfeitos, 'sine'); },
    pop() { sequencia([660, 990], 0.05, 0.12, 0.12 * volumeEfeitos, 'triangle'); },
    blip() { if (!efeitosSuaves) sequencia([880], 0, 0.06, 0.04 * volumeEfeitos, 'sine'); },
    pagina() { sequencia([392, 523.25], 0.07, 0.18, 0.1 * volumeEfeitos, 'triangle'); }
  };
})();

const Narrador = (function () {
  const gravadas = new Set(typeof FALAS_GRAVADAS !== 'undefined' ? FALAS_GRAVADAS : []);
  const ouvintes = { inicio: [], fim: [] };
  let voz = null;
  let volume = 0.8;
  let geracao = 0;
  let audioAtual = null;
  let falando = false;

  // Vozes "naturais"/neurais soam bem menos robóticas que as padrão.
  function pontuar(v) {
    const n = v.name.toLowerCase();
    let p = 0;
    if (v.lang === 'pt-BR' || v.lang === 'pt_BR') p += 50;
    else if (v.lang && v.lang.toLowerCase().startsWith('pt')) p += 20;
    if (/natural|neural|online|premium|enhanced|aprimorad/.test(n)) p += 40;
    if (/google/.test(n)) p += 25;
    if (/francisca|thalita|luciana|vitoria|vitória|leila|brenda|giovanna|yara|manuela/.test(n)) p += 15;
    if (/female|feminina|mulher/.test(n)) p += 5;
    return p;
  }

  function carregarVoz() {
    if (!('speechSynthesis' in window)) return;
    const candidatas = speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith('pt'));
    candidatas.sort((a, b) => pontuar(b) - pontuar(a));
    voz = candidatas[0] || null;
  }

  if ('speechSynthesis' in window) {
    carregarVoz();
    speechSynthesis.onvoiceschanged = carregarVoz;
  }

  function emitir(evento) {
    ouvintes[evento].forEach(fn => { try { fn(); } catch (e) { /* ouvinte com erro não para a fala */ } });
  }

  function tocarGravacao(slug, g) {
    return new Promise(resolve => {
      const audio = new Audio('audio/' + slug + '.mp3');
      audio.volume = volume;
      audioAtual = audio;
      audio.onended = resolve;
      audio.onerror = resolve;
      const tentativa = audio.play();
      if (tentativa && tentativa.catch) tentativa.catch(resolve);
      if (g !== geracao) resolve();
    });
  }

  function tocarVozSintetica(texto, opcoes, g) {
    return new Promise(resolve => {
      if (!('speechSynthesis' in window) || !texto || g !== geracao) return resolve();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = 'pt-BR';
      if (voz) u.voice = voz;
      u.rate = opcoes.devagar ? 0.8 : 0.98;
      u.pitch = 1.15;
      u.volume = volume;
      // Alguns navegadores de TV nunca disparam onend; o limite evita travar a fila.
      const limite = setTimeout(resolve, 1500 + texto.length * 110);
      u.onend = u.onerror = () => { clearTimeout(limite); resolve(); };
      speechSynthesis.speak(u);
    });
  }

  // Junta partes seguidas sem gravação numa só fala sintética, para soar corrido.
  function montarSegmentos(partes) {
    const segmentos = [];
    partes.forEach(parte => {
      const slug = slugFala(parte);
      if (gravadas.has(slug)) {
        segmentos.push({ tipo: 'gravacao', slug });
      } else {
        const ultimo = segmentos[segmentos.length - 1];
        const texto = pronunciaFala(parte);
        if (ultimo && ultimo.tipo === 'sintetica') ultimo.texto += ' ' + texto;
        else segmentos.push({ tipo: 'sintetica', texto });
      }
    });
    return segmentos;
  }

  async function falar(partes, opcoes = {}) {
    parar();
    const g = ++geracao;
    const lista = (Array.isArray(partes) ? partes : [partes]).filter(Boolean);
    if (!lista.length) return;
    falando = true;
    emitir('inicio');
    for (const seg of montarSegmentos(lista)) {
      if (g !== geracao) return;
      if (seg.tipo === 'gravacao') await tocarGravacao(seg.slug, g);
      else await tocarVozSintetica(seg.texto, opcoes, g);
    }
    if (g === geracao) {
      falando = false;
      emitir('fim');
    }
  }

  function parar() {
    geracao++;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (audioAtual) {
      audioAtual.pause();
      audioAtual = null;
    }
    if (falando) {
      falando = false;
      emitir('fim');
    }
  }

  return {
    falar,
    parar,
    definirVolume(v) { volume = Math.max(0, Math.min(1, v)); },
    aoIniciar(fn) { ouvintes.inicio.push(fn); },
    aoTerminar(fn) { ouvintes.fim.push(fn); }
  };
})();

// Música de fundo tipo "caixinha de música", composta em notas e tocada
// pelo WebAudio (sem arquivo de áudio). Melodia fixa e previsível —
// repetição ajuda crianças autistas a se sentirem seguras.
const Musica = (function () {
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);
  const _ = null;

  const PARTE_A = {
    melodia: [64, 67, 72, 67, 74, 71, 67, 71, 72, 69, 64, 69, 69, 65, 72, 69,
      67, 64, 67, 72, 71, 74, 79, 74, 69, 72, 71, 74, 72, 67, 64, _],
    baixo: [48, 43, 45, 41, 48, 43, 41, 48]
  };
  const PARTE_B = {
    melodia: [69, 72, 77, 72, 67, 72, 76, 72, 71, 74, 79, 74, 72, 76, 81, 76,
      69, 65, 69, 72, 67, 64, 67, 72, 74, 71, 67, 71, 74, _, 67, _],
    baixo: [41, 48, 43, 45, 41, 48, 43, 43]
  };
  const FORMA = [PARTE_A, PARTE_A, PARTE_B, PARTE_A];

  let master = null;
  let timer = null;
  let proximoTempo = 0;
  let passo = 0;
  let ligada = false;
  let calmo = false;
  let volumeBase = 0.8;
  let abaixada = false;

  function volumeAlvo() {
    const base = (calmo ? 0.07 : 0.11) * volumeBase;
    return abaixada ? base * 0.35 : base;
  }

  function nota(c, freq, t, dur, vol, tipo) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function chocalho(c, t) {
    const tamanho = Math.floor(c.sampleRate * 0.04);
    const buffer = c.createBuffer(1, tamanho, c.sampleRate);
    const dados = buffer.getChannelData(0);
    for (let i = 0; i < tamanho; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / tamanho);
    const fonte = c.createBufferSource();
    fonte.buffer = buffer;
    const filtro = c.createBiquadFilter();
    filtro.type = 'highpass';
    filtro.frequency.value = 7000;
    const g = c.createGain();
    g.gain.value = 0.12;
    fonte.connect(filtro).connect(g).connect(master);
    fonte.start(t);
  }

  function agendar(c, t, duracaoPasso) {
    const parte = FORMA[Math.floor(passo / 32) % FORMA.length];
    const i = passo % 32;
    const n = parte.melodia[i];
    if (n !== null) {
      nota(c, midi(n), t, duracaoPasso * 1.6, 0.5, 'triangle');
      nota(c, midi(n + 12), t, duracaoPasso * 0.9, 0.12, 'sine');
    }
    if (i % 2 === 0) {
      const raiz = parte.baixo[Math.floor(i / 4)];
      nota(c, midi(raiz), t, duracaoPasso * 1.8, i % 4 === 0 ? 0.45 : 0.3, 'sine');
    }
    if (!calmo && i % 2 === 1) chocalho(c, t);
  }

  function ciclo() {
    const c = Som.contexto();
    if (!c) return;
    const duracaoPasso = 60 / (calmo ? 84 : 104);
    while (proximoTempo < c.currentTime + 0.15) {
      agendar(c, proximoTempo, duracaoPasso);
      proximoTempo += duracaoPasso;
      passo = (passo + 1) % (32 * FORMA.length);
    }
  }

  function ajustarVolume() {
    const c = Som.contexto();
    if (!c || !master) return;
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.setTargetAtTime(ligada ? volumeAlvo() : 0.0001, c.currentTime, 0.25);
  }

  function iniciar() {
    const c = Som.contexto();
    if (!c || ligada) return;
    if (!master) {
      master = c.createGain();
      master.gain.value = 0.0001;
      master.connect(c.destination);
    }
    ligada = true;
    proximoTempo = c.currentTime + 0.1;
    timer = setInterval(ciclo, 40);
    ajustarVolume();
  }

  function parar() {
    ligada = false;
    ajustarVolume();
    clearInterval(timer);
    timer = null;
  }

  Narrador.aoIniciar(() => { abaixada = true; ajustarVolume(); });
  Narrador.aoTerminar(() => { abaixada = false; ajustarVolume(); });

  return {
    iniciar,
    parar,
    get ligada() { return ligada; },
    definirCalmo(v) { calmo = v; ajustarVolume(); },
    definirVolume(v) { volumeBase = v; ajustarVolume(); }
  };
})();
