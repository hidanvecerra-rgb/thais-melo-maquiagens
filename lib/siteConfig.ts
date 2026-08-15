// Fonte única de dados comerciais e de conteúdo do site.
// Alterar nome, telefone, Instagram, preços, FAQ etc. deve ser feito
// SÓ aqui — o resto do app importa daqui em vez de repetir valores.

export const BRAND = {
  name: "Thais Melo",
  tagline: "Maquiadora Ituiutaba",
  legalName: "Thais Melo Maquiagens",
  city: "Ituiutaba",
  state: "MG",
  cityState: "Ituiutaba – MG",
  phoneDisplay: "(34) 99673-1368",
  // Mesmo número já usado no fluxo de agendamento (lib/constants.ts) —
  // mantido aqui para centralizar, mas o valor não muda.
  whatsappNumber: "5534996731368",
  instagramHandle: "@thais.amelo",
  instagramUrl: "https://instagram.com/thais.amelo",
  siteUrl: "https://thais-melo-maquiagens-ucru.vercel.app",
  pixKeyDisplay: "(34) 99673-1368",
  pixKeyRaw: "34996731368",
  hoursLabel: "Terça a sábado, das 9h às 19h",
};

export const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "Sobre" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#faq", label: "FAQ" },
] as const;

// value = string gravada no banco em agendamentos.service — não mudar
// sem migrar os registros já existentes.
export interface ServiceConfig {
  value: "Maquiagem social" | "Aula de automaquiagem";
  label: string;
  tag: string;
  suitableFor: string[];
  description: string;
  includes: string[];
  priceFrom: number;
  durationLabel: string;
  ctaLabel: string;
}

export const SERVICES: ServiceConfig[] = [
  {
    value: "Maquiagem social",
    label: "Maquiagem Social",
    tag: "Social",
    suitableFor: ["Festas", "Formaturas", "Casamentos", "Ensaios", "Eventos"],
    description:
      "Uma produção personalizada para valorizar seus traços e complementar cada ocasião especial.",
    includes: [
      "Preparação da pele",
      "Maquiagem personalizada para a ocasião",
      "Acabamento profissional e duradouro",
    ],
    priceFrom: 100,
    durationLabel: "Atendimento individual",
    ctaLabel: "Agendar maquiagem",
  },
  {
    value: "Aula de automaquiagem",
    label: "Aula de Automaquiagem",
    tag: "Aula individual",
    suitableFor: ["Rotina do dia a dia", "Autonomia", "Uso pessoal"],
    description:
      "Aprenda técnicas práticas para valorizar seus próprios traços e conquistar mais autonomia na sua rotina de beleza.",
    includes: [
      "Preparação da pele e escolha de produtos",
      "Aplicação passo a passo",
      "Técnicas adaptadas ao seu rosto",
    ],
    priceFrom: 300,
    durationLabel: "Aproximadamente 3–4 horas",
    ctaLabel: "Agendar minha aula",
  },
];

export const SERVICE_PRICES: Record<ServiceConfig["value"], number> = {
  "Maquiagem social": 100,
  "Aula de automaquiagem": 300,
};

export const BENEFITS = [
  {
    title: "Maquiagem personalizada",
    text: "Cada produção é pensada considerando seus traços, estilo e ocasião.",
  },
  {
    title: "Atendimento individualizado",
    text: "Seu horário é reservado para que você tenha atenção e cuidado durante toda a experiência.",
  },
  {
    title: "Acabamento profissional",
    text: "Técnicas e produtos pensados para beleza, fotografia e durabilidade.",
  },
  {
    title: "Estúdio em Ituiutaba",
    text: "Ambiente preparado para proporcionar conforto e tranquilidade.",
  },
];

export const ABOUT_TEXT = [
  "Para mim, maquiagem não é sobre transformar alguém em outra pessoa. É sobre valorizar aquilo que já existe de único em cada mulher.",
  "Meu trabalho é criar produções personalizadas, respeitando os traços, a personalidade e o momento de cada cliente.",
];

// Depoimentos reais ainda não foram fornecidos — os itens abaixo são
// placeholders claramente identificados (isPlaceholder), não avaliações
// reais. Substituir por depoimentos verdadeiros assim que a Thais
// enviar (nome, texto e, se quiser, o serviço/evento).
export interface Testimonial {
  quote: string;
  name: string;
  context?: string;
  isPlaceholder: true;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Espaço reservado para o depoimento de uma cliente real.",
    name: "Depoimento em breve",
    isPlaceholder: true,
  },
  {
    quote: "Espaço reservado para o depoimento de uma cliente real.",
    name: "Depoimento em breve",
    isPlaceholder: true,
  },
  {
    quote: "Espaço reservado para o depoimento de uma cliente real.",
    name: "Depoimento em breve",
    isPlaceholder: true,
  },
];

// Respostas marcadas com needsConfirmation:true são um texto provisório
// razoável, mas NÃO são política oficial confirmada pela Thais — ajustar
// assim que ela definir a regra exata.
export interface FaqItem {
  question: string;
  answer: string;
  needsConfirmation?: true;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quanto tempo dura uma maquiagem?",
    answer:
      "O tempo varia conforme o serviço e o resultado desejado. Combine o horário com folga na sua agenda para o dia do evento.",
    needsConfirmation: true,
  },
  {
    question: "Os cílios estão inclusos?",
    answer:
      "Pergunte na hora de agendar — isso pode variar conforme o serviço escolhido.",
    needsConfirmation: true,
  },
  {
    question: "Com quanto tempo de antecedência devo agendar?",
    answer:
      "O quanto antes, especialmente em datas concorridas como formaturas e fins de semana.",
    needsConfirmation: true,
  },
  {
    question: "Preciso chegar sem maquiagem?",
    answer:
      "Idealmente sim, com a pele limpa — isso ajuda no resultado final. Confirme com a Thais se tiver dúvida.",
    needsConfirmation: true,
  },
  {
    question: "Qual é o valor do sinal?",
    answer:
      "É sempre 50% do valor do serviço, pago via Pix para garantir o horário. O restante é pago no dia do atendimento.",
  },
  {
    question: "Posso remarcar meu horário?",
    answer:
      "Fale com a Thais pelo WhatsApp o quanto antes para verificar a disponibilidade de remarcação.",
    needsConfirmation: true,
  },
  {
    question: "Como funciona o cancelamento?",
    answer:
      "Entre em contato pelo WhatsApp assim que souber que não poderá comparecer.",
    needsConfirmation: true,
  },
  {
    question: "Onde fica o estúdio?",
    answer:
      "Em Ituiutaba – MG, em estúdio próprio. O endereço completo é enviado na confirmação do agendamento.",
  },
  {
    question: "Você atende noivas?",
    answer:
      "Fale diretamente com a Thais pelo WhatsApp para conversar sobre o seu casamento.",
    needsConfirmation: true,
  },
  {
    question: "Posso levar acompanhante?",
    answer:
      "Combine com a Thais pelo WhatsApp antes do dia, para garantir conforto no atendimento.",
    needsConfirmation: true,
  },
];

// Placeholders de imagens — nenhuma foto real foi fornecida ainda.
// Substituir os arquivos nesses caminhos (crie as pastas) sem precisar
// mexer no componente: basta trocar o arquivo e remover o "placeholder".
export const IMAGE_PLACEHOLDERS = {
  heroPortrait: "/images/hero/hero-main.jpg",
  aboutPortrait: "/images/about/thais-retrato.jpg",
  studio: "/images/location/estudio.jpg",
  portfolio: Array.from({ length: 8 }, (_, i) => ({
    src: `/images/portfolio/trabalho-${String(i + 1).padStart(2, "0")}.jpg`,
    alt: `Trabalho de maquiagem ${i + 1} — descrever ao substituir`,
  })),
  instagram: Array.from({ length: 6 }, (_, i) => ({
    src: `/images/instagram/post-${String(i + 1).padStart(2, "0")}.jpg`,
    alt: `Post do Instagram ${i + 1} — descrever ao substituir`,
  })),
};
