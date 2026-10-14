/*
 * EDITE AQUI: fotos, textos, ordem dos slides e link da reserva.
 * Não é necessário mexer no HTML ou no funcionamento do carrossel.
 * Caminhos de imagem são relativos ao index.html (e não a este arquivo).
 */
window.CASA_CONFIG = {
  pricing: {
    fromPerPerson: 69, // Valor inicial por pessoa / diária, informado neste projeto.
    currency: 'BRL'
  },
  booking: {
    airbnbUrl: 'https://www.airbnb.com.br/rooms/715400608616263860',
    // Opcional: preencha com 55 + DDD + número para usar WhatsApp no botão principal.
    // Exemplo de formato: '5511XXXXXXXXX'. Deixe vazio para manter o Airbnb.
    whatsappNumber: '',
    whatsappMessage: 'Olá! Gostaria de consultar as datas da casa no Balneário Oásis, em Peruíbe.'
  },
  carousel: {
    autoplay: true,
    interval: 9000,             // Milissegundos. Mínimo aplicado: 5000.
    transition: 1100,           // Duração da transição por máscara.
    parallax: true,             // Profundidade suave ao mover o mouse.
    fallbackImage: 'assets/images/fachada.png'
  },
  slides: [
    {
      id: 'fachada', label: 'A FACHADA', layout: 'hero',
      image: 'assets/images/fachada.png',
      alt: 'Fachada real da casa em Peruíbe, com muro azul, portão branco e painéis solares no telhado.',
      position: '50% 45%', mobilePosition: '50% 50%',
      word: 'PERUÍBE', foreground: true,
      eyebrow: 'BALNEÁRIO OÁSIS · CASA INTEIRA',
      heading: ['SEU TEMPO.', 'SEU LUGAR.', 'SEU MAR.'],
      description: 'A sua próxima pausa tem endereço.',
      stats: [{value:'90',unit:'m',label:'DA PRAIA'},{value:'12',label:'HÓSPEDES'},{value:'04',label:'QUARTOS'}],
      detailTitle: 'O LITORAL, DO SEU JEITO.',
      detailText: 'Uma casa inteira para reunir quem faz parte dos seus melhores dias.',
      detailCaption: 'BALNEÁRIO OÁSIS / PERUÍBE'
    },
    {
      id: 'casa', label: 'A CASA', layout: 'space',
      image: 'assets/images/sala.png',
      alt: 'Sala da casa com sofás, janelas e ar-condicionado.',
      position: '50% 55%', mobilePosition: '45% 50%',
      word: 'REÚNA.', eyebrow: 'ESPAÇO PARA COMPARTILHAR',
      heading: ['TODO MUNDO.', 'NO MESMO', 'LUGAR.'],
      description: 'Até 12 hóspedes, com a casa inteira para vocês.',
      stats: [{value:'12',label:'HÓSPEDES'},{value:'08',label:'CAMAS'},{value:'03',label:'BANHEIROS'}],
      detailTitle: 'FIQUE À VONTADE.',
      detailText: 'Sala com ar-condicionado e Wi-Fi para aproveitar a estadia.',
      facts: ['Casa inteira', 'Wi-Fi', 'Ar-condicionado'],
      detailCaption: 'AMBIENTES / SALA'
    },
    {
      id: 'quartos', label: 'OS QUARTOS', layout: 'rest',
      image: 'assets/images/quarto.png',
      alt: 'Quarto real da casa com cama de casal, cama de solteiro e ar-condicionado.',
      position: '50% 50%', mobilePosition: '52% 50%',
      word: 'DESCANSE.', eyebrow: 'DEPOIS DA PRAIA, A SUA PAUSA',
      heading: ['ACORDE', 'SEM', 'PRESSA.'],
      description: 'Quatro quartos, incluindo duas suítes.',
      stats: [{value:'04',label:'QUARTOS'},{value:'02',label:'SUÍTES'},{value:'08',label:'CAMAS'}],
      detailTitle: 'BONS DIAS COMEÇAM AQUI.',
      detailText: 'Ar-condicionado nos quartos. Uma cama de casal e uma de solteiro em cada um.',
      facts: ['Quatro quartos', 'Duas suítes', 'Ar-condicionado'],
      detailCaption: 'AMBIENTES / QUARTOS'
    },
    {
      id: 'lazer', label: 'O LAZER', layout: 'play',
      image: 'assets/images/lazer.png',
      alt: 'Área coberta de lazer da casa, com mesa de bilhar e espaço para sentar.',
      position: '50% 54%', mobilePosition: '50% 50%',
      word: 'FIQUE.', eyebrow: 'TEMPO JUNTO É TEMPO BEM VIVIDO',
      heading: ['MAIS UMA', 'PARTIDA.', 'MAIS HISTÓRIAS.'],
      description: 'O melhor programa também pode ser ficar em casa.',
      stats: [{value:'01',label:'MESA DE BILHAR'},{value:'01',label:'PEBOLIM'}],
      detailTitle: 'ENTRE UMA PRAIA E OUTRA.',
      detailText: 'Bilhar, pebolim e jogos para aproveitar os dias juntos.',
      facts: ['Bilhar', 'Pebolim', 'Xadrez', 'Baralho e dominó'],
      detailCaption: 'AMBIENTES / LAZER'
    },
    {
      id: 'cozinha', label: 'A COZINHA', layout: 'kitchen',
      image: 'assets/images/cozinha.png',
      alt: 'Cozinha e mesa de refeições da casa no Balneário Oásis.',
      position: '50% 52%', mobilePosition: '48% 50%',
      word: 'À MESA.', eyebrow: 'A ROTINA PODE ESPERAR',
      heading: ['CAFÉ LONGO.', 'CONVERSA', 'SEM HORA.'],
      description: 'Uma cozinha para viver a estadia no seu ritmo.',
      stats: [{value:'12',label:'HÓSPEDES'},{value:'90',unit:'m',label:'DA PRAIA'}],
      detailTitle: 'PEQUENOS RITUAIS. BONS DIAS.',
      detailText: 'Cozinha e espaço para refeições. Prepare um café, sente à mesa e aproveite.',
      facts: ['Cozinha', 'Mesa para refeições', 'Café coado'],
      detailCaption: 'AMBIENTES / COZINHA'
    },
    {
      id: 'praia', label: 'O BALNEÁRIO', layout: 'coast',
      image: 'assets/images/quintal.png',
      alt: 'Quintal e área externa da casa, com cadeiras de praia. Esta foto mostra a casa, não a praia.',
      position: '50% 50%', mobilePosition: '66% 50%',
      word: 'OÁSIS.', eyebrow: 'BALNEÁRIO OÁSIS · PERUÍBE, SÃO PAULO',
      heading: ['O MAR.', 'LOGO', 'ALI.'],
      description: 'A 90 metros da praia. O caminho para desacelerar é curto.',
      stats: [{value:'90',unit:'m',label:'DA PRAIA'},{value:'12',label:'CADEIRAS DE PRAIA'}],
      detailTitle: 'SAIA. SINTA A BRISA.',
      detailText: 'Cadeiras, guarda-sol, tenda e carrinho de praia disponíveis na casa.',
      facts: ['90 m da praia', 'Balneário Oásis', 'Peruíbe · SP'],
      detailCaption: 'A SUA PRÓXIMA PAUSA / LITORAL PAULISTA'
    }
  ]
};
