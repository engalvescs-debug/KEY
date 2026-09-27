// Ponte de controle remoto/voz via celular, usando WebRTC (biblioteca PeerJS,
// que usa um servidor público gratuito só para o "aperto de mão" inicial —
// depois disso o tráfego é direto entre celular e TV, sem servidor nosso).
//
// Fluxo: a TV mostra um código de 4 dígitos. No celular, a pessoa abre a
// página /mic/, digita o código e pode usar um D-pad ou o microfone do
// celular para comandar o jogo na TV.

const VozRemota = (function () {
  let peer = null;
  let conexaoAtual = null;
  let aoAtualizarStatus = () => {};

  function gerarCodigo() {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  function estadoAtual() {
    const codigo = peer && peer.id ? peer.id.replace('tv-leitura-', '') : null;
    return { codigo, conectado: !!conexaoAtual };
  }

  function iniciar(callbackStatus) {
    aoAtualizarStatus = callbackStatus || (() => {});

    if (peer && !peer.destroyed) {
      aoAtualizarStatus(estadoAtual());
      return;
    }

    if (typeof Peer === 'undefined') {
      aoAtualizarStatus({ erro: 'Este navegador não suporta conexão com o celular.' });
      return;
    }

    const codigo = gerarCodigo();
    peer = new Peer('tv-leitura-' + codigo, { debug: 0 });

    peer.on('open', () => aoAtualizarStatus(estadoAtual()));

    peer.on('connection', conn => {
      conexaoAtual = conn;
      aoAtualizarStatus(estadoAtual());
      conn.on('data', tratarComando);
      conn.on('close', () => {
        conexaoAtual = null;
        aoAtualizarStatus(estadoAtual());
      });
    });

    peer.on('error', () => {
      aoAtualizarStatus({ erro: 'Não foi possível conectar. Verifique a internet da TV.' });
    });
  }

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
  }

  function executarAcaoDirecional(valor) {
    switch (valor) {
      case 'cima': Navegacao.mover('up'); break;
      case 'baixo': Navegacao.mover('down'); break;
      case 'esquerda': Navegacao.mover('left'); break;
      case 'direita': Navegacao.mover('right'); break;
      case 'ok': Navegacao.ativarFocado(); break;
      case 'voltar': App.voltar(); break;
    }
  }

  function interpretarTexto(texto) {
    const t = normalizar(texto);
    if (t.includes('nivel') || t.includes('jogo')) return App.navegarPara('niveis');
    if (t.includes('vogal')) return App.navegarPara('aprender', { categoria: 'vogais' });
    if (t.includes('alfabeto') || t.includes('letra')) return App.navegarPara('aprender', { categoria: 'alfabeto' });
    if (t.includes('silaba')) return App.navegarPara('silabas');
    if (t.includes('palavra')) return App.navegarPara('montarPalavras');
    if (t.includes('historia')) return App.navegarPara('historias');
    if (t.includes('config')) return App.navegarPara('configuracoes');
    if (t.includes('menu') || t.includes('inicio')) return App.navegarPara('menu');
    if (t.includes('voltar') || t.includes('sair')) return App.voltar();
    if (t.includes('cima') || t.includes('subir')) return Navegacao.mover('up');
    if (t.includes('baixo') || t.includes('descer')) return Navegacao.mover('down');
    if (t.includes('esquerda')) return Navegacao.mover('left');
    if (t.includes('direita')) return Navegacao.mover('right');
    if (t.includes('proxima') || t.includes('avancar') || t.includes('selecionar') || t.includes('escolher') || t === 'ok') {
      return Navegacao.ativarFocado();
    }
  }

  function tratarComando(dado) {
    if (!dado) return;
    if (dado.tipo === 'comando') executarAcaoDirecional(dado.valor);
    else if (dado.tipo === 'texto') interpretarTexto(dado.valor);
  }

  return { iniciar, estadoAtual };
})();
