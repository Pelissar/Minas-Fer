export type ProductCondition = "Novo" | "Usado";

export type Product = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price?: string;
  condition: ProductCondition;
  availability: "Em consulta" | "Sob encomenda";
  unit: string;
  image: string;
  accent: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
};

export type Equipment = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  specs: string[];
  condition: string;
  availability: "Consultar disponibilidade";
  image: string;
  isPublished?: boolean;
  sortOrder?: number;
};

export type ProductCategory = {
  id?: string;
  name: string;
  image: string;
  sortOrder: number;
  isPublished: boolean;
};

export const site = {
  name: "Minas Fer & Minas Gerais",
  shortName: "Minas Fer",
  phone: "(18) 3722-8320",
  phoneHref: "tel:+551837228320",
  address: "Rua Minas Gerais, 1972, Vila Rica, Andradina - SP, CEP 16901-475",
  instagram: "https://www.instagram.com/minasferminas/",
  maps: "https://www.google.com/maps/search/?api=1&query=Rua+Minas+Gerais%2C+1972%2C+Andradina+-+SP",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
};

export const categories = [
  "Perfis metálicos",
  "Barras e chapas",
  "Tubos e canos",
  "Vergalhões",
  "Ferragens e acessórios",
  "Ferramentas",
  "Abrasivos e discos",
  "Equipamentos de proteção",
  "Máquinas e equipamentos"
];

export const categoryTiles = [
  ["Perfis metálicos", "/images/minasfer/metal-profiles.jpg"],
  ["Barras e chapas", "/images/minasfer/steel-sheets.jpg"],
  ["Tubos e canos", "/images/minasfer/metal-tubes.jpg"],
  ["Acessórios em geral", "/images/minasfer/steel-hardware.jpg"],
  ["Ferramentas", "/images/minasfer/power-tools.jpg"],
  ["Abrasivos e discos", "/images/minasfer/cutting-disc.svg"],
  ["EPI's", "/images/minasfer/safety-equipment.jpg"],
  ["E muito mais...", "/images/minasfer/welder.jpg"]
] as const;

export const products: Product[] = [
  {
    slug: "tubo-quadrado-20x20",
    name: "Tubo quadrado 20x20",
    category: "Tubos e canos",
    description: "Tubo quadrado para estruturas, portões, grades e projetos de serralheria.",
    condition: "Novo",
    availability: "Em consulta",
    unit: "Barra",
    image: "/images/minasfer/square-tubes-pixabay.jpg",
    accent: "linear-gradient(135deg, #17252a, #34484d)"
  },
  {
    slug: "vergalhao-1-2",
    name: "Vergalhão 1/2\"",
    category: "Vergalhões",
    description: "Vergalhão para armações, reforços e aplicações na construção civil.",
    condition: "Novo",
    availability: "Em consulta",
    unit: "Barra",
    image: "/images/minasfer/rebar.jpg",
    accent: "linear-gradient(135deg, #263a40, #74858a)"
  },
  {
    slug: "chapa-galvanizada",
    name: "Chapa galvanizada",
    category: "Barras e chapas",
    description: "Chapa galvanizada para fechamentos, fabricação e manutenção.",
    condition: "Novo",
    availability: "Em consulta",
    unit: "Peça",
    image: "/images/minasfer/steel-sheets.jpg",
    accent: "linear-gradient(135deg, #152126, #5b6f73)"
  },
  {
    slug: "disco-de-corte-7",
    name: "Disco de corte 7\"",
    category: "Abrasivos e discos",
    description: "Disco abrasivo para corte de metais e trabalhos de acabamento.",
    condition: "Novo",
    availability: "Em consulta",
    unit: "Unidade",
    image: "/images/minasfer/cutting-disc.svg",
    accent: "linear-gradient(135deg, #1b2b30, #52656c)"
  },
  {
    slug: "inversora-de-solda-160a",
    name: "Inversora de solda 160A",
    category: "Ferramentas",
    description: "Inversora compacta para serviços de solda em oficina e obra.",
    condition: "Novo",
    availability: "Em consulta",
    unit: "Unidade",
    image: "/images/minasfer/welder.jpg",
    accent: "linear-gradient(135deg, #283a3f, #84949a)"
  },
  {
    slug: "perfis-metalicos",
    name: "Perfis metálicos",
    category: "Perfis metálicos",
    description: "Perfis para estruturas, portões, mezaninos e projetos de serralheria.",
    condition: "Novo",
    availability: "Em consulta",
    unit: "Barra",
    image: "/images/minasfer/metal-profiles.jpg",
    accent: "linear-gradient(135deg, #17252a, #34484d)"
  },
  {
    slug: "tubos-e-canos",
    name: "Tubos e canos",
    category: "Tubos e canos",
    description: "Tubos redondos e quadrados para aplicações industriais e residenciais.",
    condition: "Novo",
    availability: "Em consulta",
    unit: "Barra",
    image: "/images/minasfer/metal-tubes.jpg",
    accent: "linear-gradient(135deg, #152126, #5b6f73)"
  },
  {
    slug: "ferragens-e-acessorios",
    name: "Ferragens e acessórios",
    category: "Ferragens e acessórios",
    description: "Itens de acabamento, fixação e montagem para o seu projeto.",
    condition: "Novo",
    availability: "Em consulta",
    unit: "Unidade",
    image: "/images/minasfer/steel-hardware.jpg",
    accent: "linear-gradient(135deg, #283a3f, #84949a)"
  },
  {
    slug: "equipamentos-de-protecao",
    name: "Equipamentos de proteção",
    category: "Equipamentos de proteção",
    description: "Itens essenciais para segurança no trabalho e na oficina.",
    condition: "Novo",
    availability: "Em consulta",
    unit: "Unidade",
    image: "/images/minasfer/safety-equipment.jpg",
    accent: "linear-gradient(135deg, #1d302a, #4e7860)"
  }
];

export const equipment: Equipment[] = [
  {
    slug: "mini-escavadeira",
    name: "Escavadeira",
    category: "Equipamentos para obras",
    description: "Mini escavadeira para apoio em escavações, limpeza e preparação de terrenos.",
    specs: ["Orientação de uso", "Manutenção em dia", "Consultar período"],
    condition: "Condição informada no atendimento",
    availability: "Consultar disponibilidade",
    image: "/images/minasfer/excavator.jpg"
  },
  {
    slug: "betoneira",
    name: "Betoneira",
    category: "Equipamentos para obras",
    description: "Betoneira para mistura de concreto em obras de diferentes portes.",
    specs: ["Capacidade sob consulta", "Retirada ou entrega", "Consultar período"],
    condition: "Condição informada no atendimento",
    availability: "Consultar disponibilidade",
    image: "/images/minasfer/concrete-mixer.jpg"
  },
  {
    slug: "gerador-de-energia",
    name: "Gerador de energia",
    category: "Máquinas e equipamentos",
    description: "Gerador para apoio em obras, eventos e operações temporárias.",
    specs: ["Potência sob consulta", "Orientação técnica", "Consultar período"],
    condition: "Condição informada no atendimento",
    availability: "Consultar disponibilidade",
    image: "/images/minasfer/generator.jpg"
  },
  {
    slug: "compactador-de-solo",
    name: "Compactador de solo",
    category: "Equipamentos para obras",
    description: "Equipamento para compactação em obras e preparação de pisos.",
    specs: ["Orientação de uso", "Manutenção em dia", "Consultar período"],
    condition: "Condição informada no atendimento",
    availability: "Consultar disponibilidade",
    image: "/images/minasfer/soil-compactor.jpg"
  }
];

export function whatsappUrl(message: string, configuredNumber?: string) {
  const encoded = encodeURIComponent(message);
  const number = configuredNumber === undefined ? site.whatsappNumber : configuredNumber.replace(/\D/g, "");
  if (number) {
    return "https://wa.me/" + number + "?text=" + encoded;
  }
  return "https://wa.me/?text=" + encoded;
}
