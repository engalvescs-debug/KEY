// Página do celular: conecta na TV via PeerJS (WebRTC) e envia comandos
// por toque (D-pad) ou por voz (Web Speech API, reconhecimento local do celular).

const status = document.getElementById('status');
const telaConectar = document.getElementById('tela-conectar');
const telaControle = document.getElementById('tela-controle');

let peer = null;
let conn = null;

function iniciarPeer() {
  if (typeof Peer === 'undefined') {
    status.textContent = '⚠️ Este navegador não suporta esta conexão. Tente o Chrome.';
    return;
  }
  peer = new Peer({ debug: 0 });
  peer.on('error', () => {
    status.textContent = '⚠️ Erro de conexão. Verifique sua internet.';
  });
}

document.getElementById('btn-conectar').addEventListener('click', () => {
  const codigo = document.getElementById('input-codigo').value.trim();
  if (codigo.length !== 4) {
    status.textContent = 'Digite os 4 números que aparecem na TV.';
    return;
  }
  conectar(codigo);
});

function conectar(codigo) {
  status.textContent = 'Conectando...';
  if (!peer) iniciarPeer();

  const tentarConectar = () => {
    conn = peer.connect('tv-leitura-' + codigo, { reliable: true });
    conn.on('open', () => {
      telaConectar.style.display = 'none';
      telaControle.style.display = 'block';
    });
    conn.on('error', () => {
      status.textContent = '⚠️ Não foi possível conectar. Confira o código na TV.';
    });
  };

  if (peer.open) tentarConectar();
  else peer.on('open', tentarConectar);
}

function enviarComando(valor) {
  if (conn && conn.open) conn.send({ tipo: 'comando', valor });
}

document.querySelectorAll('[data-comando]').forEach(btn => {
  btn.addEventListener('click', () => enviarComando(btn.dataset.comando));
});

// Reconhecimento de voz (funciona no Chrome do celular; outros navegadores
// simplesmente não mostram o botão de microfone como disponível).
const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
const btnMic = document.getElementById('btn-mic');
const ultimoTexto = document.getElementById('ultimo-texto');
let recognizer = null;
let ouvindo = false;

if (Reconhecimento) {
  recognizer = new Reconhecimento();
  recognizer.lang = 'pt-BR';
  recognizer.continuous = false;
  recognizer.interimResults = false;

  recognizer.onresult = e => {
    const texto = e.results[0][0].transcript;
    ultimoTexto.textContent = `Você disse: "${texto}"`;
    if (conn && conn.open) conn.send({ tipo: 'texto', valor: texto });
  };
  recognizer.onend = () => {
    ouvindo = false;
    btnMic.classList.remove('ouvindo');
  };
  recognizer.onerror = () => {
    ouvindo = false;
    btnMic.classList.remove('ouvindo');
  };
} else {
  btnMic.textContent = '🎤 Voz não suportada neste navegador';
}

btnMic.addEventListener('click', () => {
  if (!recognizer) {
    alert('Reconhecimento de voz não é suportado neste navegador. Tente o Google Chrome.');
    return;
  }
  if (ouvindo) {
    recognizer.stop();
    return;
  }
  ouvindo = true;
  btnMic.classList.add('ouvindo');
  recognizer.start();
});

iniciarPeer();
