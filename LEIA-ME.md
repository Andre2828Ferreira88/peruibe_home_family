# Casa Oásis · Peruíbe

Site em **HTML, CSS e JavaScript**, com uma única `section` e seis imagens em um carrossel. Os arquivos funcionam sem instalação, sem CDN e sem processo de build.

## Abrir

1. Extraia o ZIP inteiro, mantendo as pastas juntas.
2. Abra `index.html` no Chrome, Edge, Firefox ou Safari atual.
3. Use as setas, as barras inferiores ou o menu para mudar de ambiente. No celular, deslize a foto para os lados.

Para editar no VS Code, abra a pasta `casa-peruibe`. A extensão Live Server é opcional.

## Trocar uma imagem — o que você mais vai usar

1. Coloque a nova foto na pasta `assets/images/`.
2. Abra `js/config.js`.
3. No slide desejado, troque o caminho em `image` e atualize a descrição em `alt`.

Exemplo:

```js
image: 'assets/images/minha-foto.jpg',
alt: 'Sala da casa, com sofás e mesa de jantar.',
position: '50% 55%',        // Enquadramento no computador.
mobilePosition: '45% 50%',  // Enquadramento no celular.
```

Use nomes simples, sem espaços ou acentos. A imagem precisa estar no ZIP/pasta: colocar apenas o nome não importa a foto automaticamente. Para JPG ou WebP, altere também a extensão no caminho.

## Onde está cada coisa

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura, marca, menu e uma única seção |
| `css/style.css` | Design, cores, tipografia e adaptação para telas menores |
| `js/config.js` | Fotos, textos, ordem, duração e reserva |
| `js/script.js` | Carrossel, animações, toque, teclado e profundidade |
| `assets/images/` | Fotografias reais incluídas |
| `assets/icons/favicon.svg` | Ícone da aba |

## Fotografias já incluídas

| Slide | Foto |
| --- | --- |
| Fachada | `assets/images/fachada.png` — a foto enviada nesta conversa |
| Sala | `assets/images/sala.png` |
| Quartos | `assets/images/quarto.png` |
| Lazer | `assets/images/lazer.png` |
| Cozinha | `assets/images/cozinha.png` |
| Localização | `assets/images/quintal.png` — mostra a área externa da casa |

Há também `area-externa-extra.png`, pronta para um slide adicional. As fotografias dos ambientes são as que você já enviou neste projeto. Não foi criada uma praia ou um ambiente fictício.

## Acrescentar um slide

Copie um objeto inteiro do array `slides` em `js/config.js`, cole após o último e separe os objetos por vírgulas. Escolha um `id` único. O contador e os seletores são atualizados automaticamente.

```js
{
  id: 'area-externa',
  label: 'ÁREA EXTERNA',
  layout: 'space',
  image: 'assets/images/area-externa-extra.png',
  alt: 'Área externa da casa com cadeiras de praia.',
  position: '50% 50%',
  mobilePosition: '65% 50%',
  word: 'RESPIRA.',
  eyebrow: 'TEMPO PARA VOCÊ',
  heading: ['UM DIA.', 'SEM', 'CORRERIA.'],
  description: 'Aproveite o quintal no seu ritmo.',
  stats: [{ value: '90', unit: 'm', label: 'DA PRAIA' }],
  detailTitle: 'FIQUE À VONTADE.',
  detailText: 'Um espaço para sentar e aproveitar a estadia.',
  detailCaption: 'AMBIENTES / ÁREA EXTERNA'
}
```

Composições disponíveis: `hero`, `space`, `rest`, `play`, `kitchen` e `coast`. Use `heading` com até três linhas curtas. Um título comprido pode precisar de ajuste no CSS. As informações do painel direito ficam mais resumidas no celular.

## PERUÍBE atrás da casa

A abertura usa a foto original em duas camadas. Um recorte **vetorial**, definido em `js/script.js`, revela a casa e os postes por cima de “PERUÍBE”. As camadas permanecem alinhadas ao redimensionar a tela. Não é uma palavra simplesmente colocada na frente da foto.

Esse recorte foi desenhado para **a fachada original de 960 × 1280 pixels**. Para as demais imagens, apenas troque o caminho. Se futuramente trocar a própria foto de abertura por outra composição, desative `foreground` ou refaça os caminhos `housePath` e `polesPath`. Não altere a proporção da foto original mantendo o recorte antigo.

## Reserva

O botão principal abre o anúncio real do Airbnb para consultar datas, valores e disponibilidade. Nenhuma reserva ou cobrança é simulada no site.

A oferta **“Diárias a partir de R$ 69 por pessoa”** aparece ao lado do botão e usa o valor informado por você. Para alterar, edite `pricing.fromPerPerson` em `js/config.js`. O preço final depende das datas e das condições de reserva consultadas no anúncio.

Para habilitar o WhatsApp no botão principal, preencha `booking.whatsappNumber` em `js/config.js` com o número real, incluindo `55` e DDD, somente dígitos. Altere também `whatsappMessage`. Com o campo vazio, o botão continua abrindo o Airbnb. O link “RESERVAR” do cabeçalho permanece direcionado ao anúncio.

## Animações e navegação

- Transição por máscara com Web Animations API e entrada dos textos em sequência.
- Profundidade suave no mouse, mantendo o recorte alinhado à foto.
- Troca automática a cada 9 segundos, com botão para pausar.
- Pausa temporária enquanto o visitante passa o mouse, usa o teclado, abre o menu ou deixa a aba.
- Toque e deslize no celular; setas esquerda/direita, Home e End no teclado.
- Respeito à preferência do sistema por reduzir movimentos: efeitos desativados e troca automática inicialmente pausada.
- Se o navegador não oferecer Web Animations API, a navegação troca os slides diretamente.

Em `carousel`, você pode mudar `interval`, `transition`, `autoplay` e `parallax`. Evite diminuir muito o intervalo: as pessoas precisam de tempo para ler e olhar cada foto.

## Publicar

O projeto é estático. No Netlify, envie a pasta que contém `index.html` junto com `css/`, `js/` e `assets/`. Para uma conexão com Git, deixe o comando de build vazio e use como diretório de publicação a pasta onde está o `index.html`.

## Origem das informações

Dados consultados no [anúncio da casa no Airbnb](https://www.airbnb.com.br/rooms/715400608616263860) em 13/10/2026: até 12 hóspedes, 4 quartos, 8 camas, 3 banheiros, duas suítes, ar-condicionado, Wi-Fi, cozinha, lazer e distância de 90 metros da praia. Valores e disponibilidade devem ser conferidos no anúncio. As imagens permanecem como fotografias do imóvel.

O layout segue a composição da referência enviada: moldura sobre fundo desfocado, nome em grande escala, foto em camadas, informações laterais, navegação discreta e botão retangular. A foto real da casa e as proporções de cada tela determinam o enquadramento.
