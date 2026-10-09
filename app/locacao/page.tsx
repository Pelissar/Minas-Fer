import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { EquipmentCard } from "../components/EquipmentCard";
import { SectionHeading } from "../components/SectionHeading";
import { getSiteContent } from "@/lib/site-content";
import { getPublicEquipment } from "@/lib/site-data";

export const metadata: Metadata = { title: "Locação", description: "Equipamentos para locação em Andradina e região." };

export default async function RentalPage() {
  const [content, global, equipment] = await Promise.all([getSiteContent("rental"), getSiteContent("global"), getPublicEquipment()]);
  return (
    <>
      <section className="page-hero"><div className="container"><div className="breadcrumb"><Link href="/">Início</Link><span>/</span><span>Locação</span></div><h1>{content.heroTitle}</h1><p>{content.heroDescription}</p></div></section>
      <section className="section section-surface"><div className="container"><SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description} /><div className="equipment-grid">{equipment.map((item) => <EquipmentCard key={item.id || item.slug} item={item} whatsappNumber={global.whatsappNumber} />)}</div></div></section>
      <section className="section"><div className="container about-layout"><div className="about-copy"><SectionHeading eyebrow={content.outroEyebrow} title={content.outroTitle} description={content.outroDescription} /></div><div className="about-image" style={{ "--about-image": `url("${equipment[0]?.image || "/images/minasfer/excavator.jpg"}")` } as CSSProperties} role="img" aria-label="Equipamento de construção disponível para locação" /></div></section>
    </>
  );
}
