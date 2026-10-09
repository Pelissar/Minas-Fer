import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Ruler, Truck, UsersRound } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { QuoteForm } from "../components/QuoteForm";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Serviços", description: "Atendimento e soluções para projetos de serralheria e tornearia." };

const serviceIcons = [Ruler, ClipboardCheck, Truck, UsersRound];

export default async function ServicesPage() {
  const [content, global] = await Promise.all([getSiteContent("services"), getSiteContent("global")]);
  return (
    <>
      <section className="page-hero"><div className="container"><div className="breadcrumb"><Link href="/">Início</Link><span>/</span><span>Serviços</span></div><h1>{content.heroTitle}</h1><p>{content.heroDescription}</p></div></section>
      <section className="section"><div className="container"><SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description} /><div className="service-grid">{content.items.map((item, index) => { const Icon = serviceIcons[index % serviceIcons.length]; return <article className="service-card" key={`${item.title}-${index}`}><div className="service-icon"><Icon size={23} /></div><h3>{item.title}</h3><p>{item.description}</p></article>; })}</div></div></section>
      <section className="section section-surface"><div className="container contact-layout"><div><SectionHeading eyebrow="Fale com a equipe" title="Tem uma necessidade específica?" description="Envie os detalhes e nós retornaremos pelo canal informado para orientar os próximos passos." /></div><QuoteForm compact whatsappNumber={global.whatsappNumber} /></div></section>
    </>
  );
}
