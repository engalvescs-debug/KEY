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

  function volumeSfx(v) {
    return v * volumeEfeitos * (efeitosSuaves ? 0.5 : 1);
  }

  // Tom com glissando: freqs = [inicial, final].
  function deslize(freqs, inicio, duracao, volume, tipo = 'sine', filtro = null) {
    const c = contexto();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(freqs[0], inicio);
    osc.frequency.exponentialRampToValueAtTime(freqs[1], inicio + duracao);
    gain.gain.setValueAtTime(0.0001, inicio);
    gain.gain.exponentialRampToValueAtTime(volumeSfx(volume), inicio + Math.min(0.03, duracao / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
    let saida = osc;
    if (filtro) {
      const f = c.createBiquadFilter();
      f.type = filtro.tipo;
      f.frequency.value = filtro.freq;
      f.Q.value = filtro.q || 1;
      saida = osc.connect(f);
    }
    saida.connect(gain).connect(c.destination);
    osc.start(inicio);
    osc.stop(inicio + duracao + 0.05);
  }

  // Ruído filtrado; freqs é o caminho do filtro ao longo da duração.
  function ruido(inicio, duracao, volume, tipoFiltro, freqs, q = 1, suave = false) {
    const c = contexto();
    if (!c) return;
    const tamanho = Math.max(1, Math.floor(c.sampleRate * duracao));
    const buffer = c.createBuffer(1, tamanho, c.sampleRate);
    const dados = buffer.getChannelData(0);
    for (let i = 0; i < tamanho; i++) dados[i] = Math.random() * 2 - 1;
    const fonte = c.createBufferSource();
    fonte.buffer = buffer;
    const filtro = c.createBiquadFilter();
    filtro.type = tipoFiltro;
    filtro.Q.value = q;
    filtro.frequency.setValueAtTime(freqs[0], inicio);
    freqs.slice(1).forEach((f, i) => {
      filtro.frequency.linearRampToValueAtTime(f, inicio + (duracao * (i + 1)) / (freqs.length - 1));
    });
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, inicio);
    gain.gain.linearRampToValueAtTime(volumeSfx(volume), inicio + (suave ? duracao * 0.35 : 0.01));
    gain.gain.linearRampToValueAtTime(0.0001, inicio + duracao);
    fonte.connect(filtro).connect(gain).connect(c.destination);
    fonte.start(inicio);
  }

  const EFEITOS = {
    vento: t => ruido(t, 1.6, 0.5, 'bandpass', [300, 1500, 500, 1200, 350], 1.2, true),
    porta: t => [0, 0.24].forEach(d => { deslize([160, 90], t + d, 0.14, 0.6); ruido(t + d, 0.05, 0.25, 'lowpass', [900]); }),
    martelo: t => [0, 0.32, 0.64].forEach(d => { ruido(t + d, 0.05, 0.4, 'bandpass', [2200], 3); deslize([420, 200], t + d, 0.08, 0.25); }),
    passos: t => [0, 0.34, 0.68, 1.02].forEach((d, i) => { deslize([i % 2 ? 110 : 95, 60], t + d, 0.14, 0.5); ruido(t + d, 0.06, 0.12, 'lowpass', [500]); }),
    passaros: t => [0, 0.16, 0.5, 0.64, 0.8].forEach((d, i) => deslize([2200 + i * 150, 3400 - i * 100], t + d, 0.09, 0.12)),
    agua: t => { deslize([950, 280], t, 0.22, 0.3); ruido(t, 0.35, 0.12, 'highpass', [1800]); deslize([300, 750], t + 0.3, 0.12, 0.2); },
    magia: t => [1319, 1568, 1976, 2637, 3136, 2637].forEach((f, i) => deslize([f, f * 1.01], t + i * 0.07, 0.3, 0.1, 'triangle')),
    assobio: t => [0, 0.62].forEach(d => { deslize([1100, 1900], t + d, 0.24, 0.15); deslize([1900, 1300], t + d + 0.24, 0.22, 0.15); }),
    redemoinho: t => ruido(t, 1.8, 0.45, 'bandpass', [400, 1600, 500, 1800, 600, 1400], 3, true),
    quack: t => [0, 0.26].forEach(d => deslize([420, 300], t + d, 0.16, 0.25, 'sawtooth', { tipo: 'bandpass', freq: 1000, q: 2 })),
    uivo: t => { deslize([380, 620], t, 0.6, 0.16, 'triangle'); deslize([620, 450], t + 0.6, 0.9, 0.16, 'triangle'); },
    crocante: t => [0, 0.08, 0.18].forEach(d => ruido(t + d, 0.05, 0.4, 'highpass', [2600])),
    sino: t => { deslize([880, 878], t, 1.8, 0.2); deslize([1760, 1755], t, 1.1, 0.08); deslize([2640, 2630], t, 0.6, 0.04); },
    fogo: t => {
      ruido(t, 1.6, 0.15, 'lowpass', [350], 1, true);
      for (let i = 0; i < 22; i++) ruido(t + Math.random() * 1.5, 0.02, 0.1 + Math.random() * 0.25, 'highpass', [1200 + Math.random() * 3000]);
    },
    grilos: t => [0, 0.55, 1.1].forEach(g => { for (let i = 0; i < 6; i++) deslize([4200, 4150], t + g + i * 0.04, 0.03, 0.05); }),
    miau: t => { deslize([520, 880], t, 0.25, 0.18, 'triangle'); deslize([880, 460], t + 0.25, 0.4, 0.18, 'triangle'); },
    sapo: t => [0, 0.3].forEach(d => deslize([130, 85], t + d, 0.2, 0.35, 'square', { tipo: 'lowpass', freq: 700 })),
    risada: t => [560, 530, 500, 470].forEach((f, i) => deslize([f, f - 40], t + i * 0.14, 0.1, 0.14, 'square', { tipo: 'lowpass', freq: 1600 })),
    pulo: t => { deslize([200, 700], t, 0.18, 0.25); deslize([700, 420], t + 0.18, 0.18, 0.15); }
  };

  function efeito(nome) {
    const c = contexto();
    if (!c || !EFEITOS[nome]) return;
    EFEITOS[nome](c.currentTime + 0.02);
  }

  return {
    efeito,
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
  let silenciada = false;
  let forma = FORMA;
  let bpmTema = null;
  let temaAtual = null;

  function volumeAlvo() {
    if (silenciada) return 0.0001;
    const base = (calmo ? 0.07 : 0.11) * volumeBase;
    return abaixada ? base * 0.35 : base;
  }

  // Tema de uma história: a melodia é a da própria canção (cada verso
  // ocupa 2 compassos), para a criança já conhecer a música ao cantar.
  function definirTema(tema) {
    if (tema === temaAtual) return;
    temaAtual = tema;
    if (!tema) {
      forma = FORMA;
      bpmTema = null;
    } else {
      const melodia = [];
      tema.versos.slice(0, 4).forEach(v => {
        for (let i = 0; i < 8; i++) melodia.push(i < v.length ? v[i] : null);
      });
      while (melodia.length < 32) melodia.push(null);
      forma = [{ melodia, baixo: tema.baixo }];
      bpmTema = tema.bpm;
    }
    passo = 0;
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
    const parte = forma[Math.floor(passo / 32) % forma.length];
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
    const bpm = bpmTema ? bpmTema * (calmo ? 0.85 : 1) : (calmo ? 84 : 104);
    const duracaoPasso = 60 / bpm;
    while (proximoTempo < c.currentTime + 0.15) {
      agendar(c, proximoTempo, duracaoPasso);
      proximoTempo += duracaoPasso;
      passo = (passo + 1) % (32 * forma.length);
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
    definirTema,
    silenciar(v) { silenciada = v; ajustarVolume(); },
    definirCalmo(v) { calmo = v; ajustarVolume(); },
    definirVolume(v) { volumeBase = v; ajustarVolume(); }
  };
})();

// Karaokê: toca a melodia da canção nota a nota (uma nota por sílaba) e
// avisa qual sílaba está soando, para a tela acender a sílaba certa.
const Cancao = (function () {
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);
  let timers = [];
  let volume = 0.8;

  function nota(c, freq, t, dur, vol, tipo) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol * volume, t + 0.02);
    g.gain.setValueAtTime(vol * volume, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function parar() {
    timers.forEach(clearTimeout);
    timers = [];
    Musica.silenciar(false);
  }

  // silabasPorVerso: quantidade de sílabas de cada verso.
  function tocar({ silabasPorVerso, notas, bpm, baixo }, aoSilaba, aoFim) {
    parar();
    const c = Som.contexto();
    if (!c) return aoFim && aoFim();
    Musica.silenciar(true);
    const passo = 60 / bpm;
    let t = c.currentTime + 0.4;
    silabasPorVerso.forEach((qtd, v) => {
      const ns = notas[v] || notas[0];
      for (let i = 0; i < qtd; i++) {
        const ultima = i === qtd - 1;
        const dur = ultima ? passo * 1.9 : passo * 0.95;
        const n = ns[i % ns.length];
        nota(c, midi(n), t, dur, 0.22, 'triangle');
        nota(c, midi(n + 12), t, dur * 0.7, 0.05, 'sine');
        if (i % 4 === 0) nota(c, midi(baixo[(v * 2 + Math.floor(i / 4)) % baixo.length]), t, passo * 3.5, 0.18, 'sine');
        const atraso = (t - c.currentTime) * 1000;
        timers.push(setTimeout(() => aoSilaba(v, i), atraso));
        t += ultima ? passo * 2 : passo;
      }
      t += passo * 0.5;
    });
    timers.push(setTimeout(() => {
      Musica.silenciar(false);
      if (aoFim) aoFim();
    }, (t - c.currentTime) * 1000 + 200));
  }

  return { tocar, parar, definirVolume(v) { volume = v; } };
})();
