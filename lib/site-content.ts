import { getSupabasePublicServerClient } from "@/lib/supabase/server";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export const defaultSiteContent = {
  global: {
    name: "Minas Fer & Minas Gerais",
    shortName: "Minas Fer",
    tagline: "Materiais de serralheria e tornearia",
    logoImage: "/logo-minasfer.png",
    phone: "(18) 3722-8320",
    phoneHref: "tel:+551837228320",
    address: "Rua Minas Gerais, 1972, Vila Rica, Andradina - SP, CEP 16901-475",
    instagram: "https://www.instagram.com/minasferminas/",
    maps: "https://www.google.com/maps/search/?api=1&query=Rua+Minas+Gerais%2C+1972%2C+Andradina+-+SP",
    whatsappNumber: "",
    footerSummary: "Materiais para serralheria e tornearia, produtos novos e usados e equipamentos para locação.",
    footerCopyright: "Todos os direitos reservados."
  },
  home: {
    hero: {
      eyebrow: "Qualidade e confiança em cada projeto",
      title: "Tudo para sua",
      highlight: "serralheria e tornearia",
      description: "Materiais novos e usados, locação de equipamentos e soluções para o seu negócio.",
      note: "Atendimento para profissionais, empresas e projetos especiais.",
      image: "/images/minasfer/hero-steel-pipes.jpg"
    },
    trustItems: [
      { title: "Produtos novos e usados", description: "Qualidade e economia" },
      { title: "Locação de equipamentos", description: "Praticidade para o trabalho" },
      { title: "Atendimento especializado", description: "Equipe pronta para ajudar" },
      { title: "Orçamento simplificado", description: "Resposta pelo canal escolhido" }
    ],
    categories: {
      eyebrow: "Nossos produtos",
      title: "Materiais de serralheria e tornearia",
      description: "Trabalhamos com uma ampla variedade de materiais, desde os mais comuns até os mais específicos, sempre com qualidade e procedência."
    },
    featured: {
      eyebrow: "Catálogo em destaque",
      title: "Consulte os materiais disponíveis",
      description: "Encontre o que precisa e confirme medidas, condição e disponibilidade com a nossa equipe."
    },
    rental: {
      eyebrow: "Locação de equipamentos",
      title: "Equipamentos para o seu trabalho",
      description: "Aqui você encontra locação de equipamentos com orientação para escolher a solução adequada ao seu projeto."
    },
    about: {
      eyebrow: "Sobre nós",
      title: "Minas Fer & Minas Gerais",
      description: "Trabalhamos com materiais de serralheria e tornearia, produtos novos e usados e soluções para atender às necessidades de profissionais e empresas.",
      points: ["Atendimento próximo e personalizado", "Materiais para diferentes etapas do projeto", "Equipe pronta para orientar sua compra"],
      image: "/reference/about-store.png"
    },
    cta: {
      title: "Solicite um orçamento agora mesmo!",
      description: "Tire suas dúvidas, confira disponibilidade e encontre o material certo."
    }
  },
  catalog: {
    heroTitle: "Materiais para cada projeto",
    heroDescription: "Explore as categorias e converse com nossa equipe para confirmar medidas, condição e disponibilidade.",
    eyebrow: "Nosso catálogo",
    title: "Encontre o material certo",
    description: "Valores e disponibilidade são confirmados no atendimento."
  },
  about: {
    heroTitle: "Uma equipe perto do seu projeto",
    heroDescription: "Materiais de serralheria e tornearia, produtos novos e usados e soluções para profissionais e empresas.",
    introEyebrow: "Minas Fer & Minas Gerais",
    introTitle: "Experiência de compra com atendimento humano",
    introDescription: "Trabalhamos para que cada pessoa encontre uma solução adequada ao projeto, com informação clara sobre os materiais e as condições disponíveis.",
    image: "/reference/about-store.png",
    points: ["Produtos novos e usados sob consulta", "Atendimento para Andradina e região", "Locação de equipamentos cadastrados", "Comunicação direta pelo canal escolhido"],
    commitmentsEyebrow: "Nossos compromissos",
    commitmentsTitle: "Princípios que orientam o atendimento",
    commitments: [
      { title: "Informação clara", description: "Condições, preços e disponibilidade são confirmados antes de qualquer fechamento." },
      { title: "Proximidade", description: "Você conversa com uma equipe acessível para tirar dúvidas e decidir com segurança." },
      { title: "Atuação local", description: "Atendimento a partir de Andradina, com logística combinada para cada necessidade." }
    ]
  },
  services: {
    heroTitle: "Suporte para tirar o projeto do papel",
    heroDescription: "Do primeiro contato à escolha do material, você fala com pessoas que entendem a rotina de serralheria e tornearia.",
    eyebrow: "Como ajudamos",
    title: "Mais clareza para comprar e locar",
    description: "Cada atendimento começa entendendo o que você precisa. As condições comerciais e a disponibilidade são confirmadas pela equipe.",
    items: [
      { title: "Orientação para o projeto", description: "Conte as medidas e a aplicação. A equipe ajuda a organizar a consulta do material certo." },
      { title: "Separação sob consulta", description: "Confirmamos condição, unidade, disponibilidade e detalhes antes de fechar o pedido." },
      { title: "Retirada e entrega", description: "Combine a melhor forma de receber seus materiais conforme a região e o tamanho do pedido." },
      { title: "Atendimento próximo", description: "Um canal direto para profissionais, empresas e quem está começando um novo projeto." }
    ]
  },
  contact: {
    heroTitle: "Vamos conversar sobre o seu projeto",
    heroDescription: "Preencha o formulário e conte o que precisa. Você poderá continuar pelo WhatsApp depois do envio.",
    panelTitle: "Minas Fer & Minas Gerais",
    panelDescription: "Atendimento comercial para materiais, produtos usados e locação de equipamentos."
  },
  privacy: {
    title: "Política de privacidade",
    introduction: "Esta página explica como os dados enviados pelo formulário de orçamento são usados. Revise este conteúdo com a empresa antes da publicação.",
    sections: [
      { title: "Dados enviados", body: "O formulário solicita informações como nome, telefone, empresa, e-mail e detalhes do pedido para permitir o retorno da equipe." },
      { title: "Uso das informações", body: "Use os dados para atendimento e acompanhamento da solicitação. Revise esta política e os procedimentos internos antes de publicar." },
      { title: "Armazenamento e acesso", body: "Quando o Supabase estiver configurado, as solicitações serão armazenadas no projeto e poderão ser acessadas por administradores autorizados. Defina o prazo interno de retenção." }
    ]
  },
  rental: {
    heroTitle: "Equipamentos para a sua obra",
    heroDescription: "Consulte os equipamentos cadastrados e converse com a equipe para checar período, condição e logística.",
    eyebrow: "Locação sob consulta",
    title: "Escolha o apoio que seu projeto precisa",
    description: "A disponibilidade é atualizada no atendimento. Nenhum equipamento é considerado reservado antes da confirmação da equipe.",
    outroEyebrow: "Como funciona",
    outroTitle: "Consulta rápida e transparente",
    outroDescription: "Informe qual equipamento deseja, o período estimado e a cidade da obra. A equipe retorna com as opções e condições disponíveis."
  }
} as const;

export type SiteContentKey = keyof typeof defaultSiteContent;
export type SiteContent<K extends SiteContentKey> = (typeof defaultSiteContent)[K];

function mergeContent(defaultValue: unknown, storedValue: unknown): unknown {
  if (Array.isArray(defaultValue)) return Array.isArray(storedValue) ? storedValue : defaultValue;
  if (defaultValue && storedValue && typeof defaultValue === "object" && typeof storedValue === "object" && !Array.isArray(storedValue)) {
    const merged: Record<string, unknown> = { ...(defaultValue as Record<string, unknown>) };
    for (const [key, value] of Object.entries(storedValue as Record<string, unknown>)) {
      merged[key] = key in merged ? mergeContent(merged[key], value) : value;
    }
    return merged;
  }
  return storedValue === undefined || storedValue === null ? defaultValue : storedValue;
}

export async function getSiteContent<K extends SiteContentKey>(key: K): Promise<SiteContent<K>> {
  const fallback = defaultSiteContent[key];
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase.from("site_content").select("content").eq("key", key).maybeSingle();
  if (error || !data?.content) return fallback;
  return mergeContent(fallback, data.content) as SiteContent<K>;
}
