import type { Metadata } from "next";
import Link from "next/link";
import { Instagram, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "../components/QuoteForm";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Contato e orçamento", description: "Solicite um orçamento para materiais e equipamentos." };

export default async function ContactPage() {
  const [content, global] = await Promise.all([getSiteContent("contact"), getSiteContent("global")]);
  return (
    <>
      <section className="page-hero"><div className="container"><div className="breadcrumb"><Link href="/">Início</Link><span>/</span><span>Contato</span></div><h1>{content.heroTitle}</h1><p>{content.heroDescription}</p></div></section>
      <section className="section"><div className="container contact-layout"><aside className="contact-panel"><h2>{content.panelTitle}</h2><p>{content.panelDescription}</p><div className="contact-info"><a href={global.phoneHref}><Phone size={19} /><span><strong>Telefone comercial</strong><br />{global.phone}</span></a><a href={global.maps} target="_blank" rel="noreferrer"><MapPin size={19} /><span><strong>Endereço</strong><br />{global.address}</span></a><a href={global.instagram} target="_blank" rel="noreferrer"><Instagram size={19} /><span><strong>Instagram</strong><br />{global.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "")}</span></a></div><a className="button button-primary" href={global.maps} target="_blank" rel="noreferrer">Abrir localização</a></aside><QuoteForm whatsappNumber={global.whatsappNumber} /></div></section>
    </>
  );
}
