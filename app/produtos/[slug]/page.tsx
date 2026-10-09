import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { whatsappUrl } from "@/lib/data";
import { getSiteContent } from "@/lib/site-content";
import { getPublicProductBySlug } from "@/lib/site-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  return product ? { title: product.name, description: product.description } : { title: "Produto" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, global] = await Promise.all([getPublicProductBySlug(slug), getSiteContent("global")]);
  if (!product) notFound();
  return (
    <section className="section">
      <div className="container">
        <Link className="text-link" href="/produtos"><ArrowLeft size={16} /> Voltar para produtos</Link>
        <div className="detail-layout" style={{ marginTop: 28 }}>
          <Image className="detail-image" src={product.image} alt={product.name} width={1200} height={900} unoptimized />
          <div className="detail-copy">
            <span className="eyebrow">{product.category}</span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div className="detail-meta">
              <div><small>Condição</small><strong>{product.condition}</strong></div>
              <div><small>Unidade</small><strong>{product.unit}</strong></div>
              <div><small>Disponibilidade</small><strong>{product.availability}</strong></div>
              <div><small>Preço</small><strong>{product.price || "Consulte o preço"}</strong></div>
            </div>
            <p style={{ fontSize: 12 }}>As informações comerciais são confirmadas pela equipe conforme o seu projeto e a disponibilidade atual.</p>
            <a className="button button-primary" href={whatsappUrl("Olá! Gostaria de consultar " + product.name + ".", global.whatsappNumber)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Solicitar orçamento <ArrowRight size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
