import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Sobre nós", description: "Conheça a Minas Fer & Minas Gerais, em Andradina - SP." };

const commitmentIcons = [ShieldCheck, UsersRound, MapPin];

export default async function AboutPage() {
  const content = await getSiteContent("about");
  return (
    <>
      <section className="page-hero"><div className="container"><div className="breadcrumb"><Link href="/">Início</Link><span>/</span><span>Sobre nós</span></div><h1>{content.heroTitle}</h1><p>{content.heroDescription}</p></div></section>
      <section className="section"><div className="container about-layout"><div className="about-copy"><SectionHeading eyebrow={content.introEyebrow} title={content.introTitle} description={content.introDescription} /><ul className="about-points">{content.points.map((point) => <li key={point}><CheckCircle2 size={19} /> {point}</li>)}</ul></div><div className="about-image" style={{ "--about-image": `url("${content.image}")` } as CSSProperties} role="img" aria-label="Fachada da loja Minas Fer" /></div></section>
      <section className="section section-surface"><div className="container"><SectionHeading eyebrow={content.commitmentsEyebrow} title={content.commitmentsTitle} align="center" /><div className="service-grid">{content.commitments.map((item, index) => { const Icon = commitmentIcons[index % commitmentIcons.length]; return <article className="service-card" key={`${item.title}-${index}`}><div className="service-icon"><Icon size={23} /></div><h3>{item.title}</h3><p>{item.description}</p></article>; })}</div></div></section>
    </>
  );
}
