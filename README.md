# 📚 Aprender a Ler — jogo educativo para Smart TV

Web app educativo e interativo para crianças aprenderem vogais, alfabeto,
sílabas e a montar palavras, com Modo História. Pensado para rodar direto
no navegador de Smart TVs (Samsung Tizen, LG WebOS, Android TV, etc.) — sem
precisar publicar em nenhuma loja de aplicativos.

## Como testar agora

Não precisa instalar nada. É só servir os arquivos estáticos e abrir num
navegador:

```bash
# na pasta do projeto
python3 -m http.server 8080
# ou: npx http-server -p 8080
```

Depois abra `http://localhost:8080` no navegador (ou na Smart TV, trocando
`localhost` pelo IP do computador na mesma rede Wi-Fi).

## Como abrir na TV Samsung (ou outra Smart TV)

1. Hospede os arquivos em algum lugar acessível pela internet ou pela rede
   local — por exemplo o GitHub Pages (grátis) ou Netlify.
2. Na TV, abra o navegador (Samsung Internet, no menu Apps) e digite o
   endereço do site.
3. Use as setas do controle remoto para navegar entre os cartões e **OK**
   para selecionar — a navegação já foi feita pensando no controle da TV,
   não precisa de mouse ou touch.

Se no futuro quiser um app "de verdade" instalável na Samsung (Tizen), dá
para empacotar esse mesmo site com o **Tizen Studio** (gratuito, da
Samsung) quase sem mudar o código — é o próximo passo natural depois que o
conteúdo estiver validado no navegador.

## Estrutura do projeto

```
index.html              tela principal (TV)
css/style.css           visual, tamanhos grandes e "Modo Calmo"
js/data/content.js      todo o conteúdo pedagógico (vogais, letras, sílabas, palavras, histórias)
js/app.js               controlador de telas / navegação entre elas
js/navigation.js        navegação espacial por controle remoto (setas + OK + voltar)
js/audio.js             narração por voz (Text-to-Speech) e sons de recompensa
js/storage.js           progresso salvo no navegador (estrelas, níveis concluídos)
js/voz.js               ponte de comando por celular (WebRTC/PeerJS)
js/screens/*.js         cada tela do jogo (menu, níveis, história, configurações...)
mic/                    página que roda no CELULAR (controle remoto + microfone)
```

## O que já está pronto (nesta primeira versão)

- **Jogo dos Níveis**, em ordem sugerida (sem travar o avanço, para não
  frustrar a criança): Vogais → Alfabeto → Sílabas → Montar Palavras.
  Cada nível tem uma etapa de "conhecer" (explorar no próprio ritmo) e uma
  de "praticar" (reconhecimento, com narração e efeitos sonoros suaves).
- **Modo História**: histórias curtas com palavras destacadas que a
  criança pode tocar para ouvir de novo, e uma pergunta de compreensão ao
  final.
- **Progresso salvo automaticamente** (estrelas e níveis concluídos) no
  navegador da própria TV.
- **Pensado para crianças autistas**:
  - Sem cronômetro, sem "errou" de forma negativa — sempre uma mensagem
    gentil convidando a tentar de novo, sem limite de tentativas.
  - Sons de recompensa suaves (sem estridência), nunca sons de erro.
  - **Modo Calmo** (paleta mais suave) e opção de **reduzir animações**,
    nas Configurações.
  - Suporte visual sempre redundante: letra + cor + emoji + palavra juntos
    (nunca só texto ou só imagem).
  - Navegação 100% previsível pelo controle remoto (mesmo padrão em toda
    tela: setas para mover, OK para escolher, Voltar sempre disponível).
- **Controle pelo celular** (Configurações → "Controle pelo Celular"): a TV
  mostra um código de 4 dígitos, a pessoa abre `/mic/` no celular, digita o
  código e pode usar tanto um D-pad na tela quanto o **microfone do
  celular** (ex.: dizer "vogais", "história", "voltar") para comandar o
  jogo na TV — sem precisar instalar nada, só abrir o link no navegador do
  celular.

## Próximos passos possíveis (ainda não implementados)

- **Multiplayer** (2 crianças na mesma TV, por turnos, ou 2 celulares
  conectados) — arquitetura atual já isola bem a lógica de progresso por
  jogador, então é uma extensão natural.
- **Integração com Alexa** (controlar por comandos de voz direto no
  controle da TV que já tem Alexa): isso exige criar uma **Skill da Alexa**
  própria, com conta de desenvolvedor Amazon e um backend na nuvem para
  receber os comandos — é um projeto à parte, mais burocrático (aprovação
  da Amazon), então ficou fora desta primeira versão. A ponte por celular
  já resolve o "controle por voz" enquanto isso.
- **Mais conteúdo**: mais histórias, ilustrações desenhadas (hoje usamos
  emoji, que funciona bem e sem depender de internet, mas dá pra evoluir
  para ilustrações originais), e sons gravados por dublador ao invés da
  voz sintética do navegador.
- **Empacotar como app Tizen** instalável, para não depender de abrir o
  navegador manualmente na TV toda vez.

## Notas técnicas

- Sem build step, sem dependências para instalar — só HTML/CSS/JS puro,
  roda em qualquer servidor estático.
- A narração usa a *Web Speech API* do navegador (nenhum áudio gravado é
  necessário), e falha em silêncio se a TV não suportar.
- O controle por celular usa a biblioteca **PeerJS** (WebRTC) carregada
  por CDN, que só usa um servidor público gratuito para o pareamento
  inicial — depois disso o tráfego é direto entre os dois aparelhos.
