import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, HardHat, PackageCheck, Truck, Wrench } from "lucide-react";
import { Reveal } from "./components/Reveal";
import { SectionHeading } from "./components/SectionHeading";
import { ProductCard } from "./components/ProductCard";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { getSiteContent } from "@/lib/site-content";
import { getPublicCategories, getPublicEquipment, getPublicProducts } from "@/lib/site-data";

const trustIcons = [PackageCheck, Wrench, HardHat, Truck];

export default async function HomePage() {
  const [home, global, categories, featuredProducts, equipment] = await Promise.all([
    getSiteContent("home"),
    getSiteContent("global"),
    getPublicCategories(),
    getPublicProducts({ featuredOnly: true }),
    getPublicEquipment()
  ]);
  const rentalItems = equipment.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-media" style={{ "--hero-image": `url("${home.hero.image}")` } as CSSProperties} />
        <Reveal className="container hero-content">
          <span className="eyebrow">{home.hero.eyebrow}</span>
          <h1>{home.hero.title} <span>{home.hero.highlight}</span></h1>
          <p className="hero-lead">{home.hero.description}</p>
          <div className="hero-actions">
            <WhatsAppButton message="Olá! Vim pelo site da Minas Fer e gostaria de falar com a equipe." whatsappNumber={global.whatsappNumber} />
            <Link className="button button-light" href="/produtos">Conheça nossos produtos <ArrowRight size={17} /></Link>
          </div>
          <div className="hero-note">{home.hero.note}</div>
        </Reveal>
      </section>

      <section className="trust-strip" aria-label="Diferenciais">
        <div className="container trust-grid">
          {home.trustItems.map((item, index) => {
            const Icon = trustIcons[index % trustIcons.length];
            return <Reveal className="trust-item" delay={index * 80} key={`${item.title}-${index}`}><span className="trust-icon"><Icon size={22} /></span><span><strong>{item.title}</strong><span>{item.description}</span></span></Reveal>;
          })}
        </div>
      </section>

      <section className="section">
        <div className="container category-layout">
          <Reveal className="category-copy">
            <SectionHeading eyebrow={home.categories.eyebrow} title={home.categories.title} description={home.categories.description} />
            <Link className="button button-primary" href="/produtos">Ver todos os produtos <ArrowRight size={17} /></Link>
          </Reveal>
          <Reveal className="category-grid" delay={120}>
            {categories.map((category) => <Link key={category.id || category.name} href="/produtos" className="category-card" style={{ "--category-image": `url("${category.image}")` } as CSSProperties}><span>{category.name}</span></Link>)}
          </Reveal>
        </div>
      </section>

      <section className="section section-dark feature-products">
        <div className="container">
          <Reveal className="feature-heading-row">
            <SectionHeading eyebrow={home.featured.eyebrow} title={home.featured.title} description={home.featured.description} />
            <Link className="text-link" href="/produtos">Ver catálogo completo <ArrowRight size={15} /></Link>
          </Reveal>
          <Reveal className="featured-grid" delay={120}>{featuredProducts.map((product) => <ProductCard key={product.id || product.slug} product={product} whatsappNumber={global.whatsappNumber} />)}</Reveal>
        </div>
      </section>

      <section className="rental-band">
        <Reveal className="rental-image" aria-label="Equipamentos de locação">
          {rentalItems.map((item, index) => <div className={`rental-photo rental-photo-${index + 1}`} key={item.id || item.slug}><Image src={item.image} alt={item.name} fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized /></div>)}
        </Reveal>
        <Reveal className="rental-copy" delay={100}>
          <span className="eyebrow">{home.rental.eyebrow}</span>
          <h2>{home.rental.title}</h2>
          <p>{home.rental.description}</p>
          <Link className="button button-primary" href="/locacao">Ver equipamentos disponíveis <ArrowRight size={17} /></Link>
          <div className="rental-list">{equipment.slice(0, 4).map((item) => <span key={item.id || item.slug}>{item.name}</span>)}</div>
        </Reveal>
      </section>

      <section className="section">
        <Reveal className="container about-layout">
          <div className="about-copy">
            <SectionHeading eyebrow={home.about.eyebrow} title={home.about.title} description={home.about.description} />
            <ul className="about-points">{home.about.points.map((point) => <li key={point}><CheckCircle2 size={19} /> {point}</li>)}</ul>
            <Link className="button button-primary" href="/sobre" style={{ marginTop: 25 }}>Saiba mais sobre nós <ArrowRight size={17} /></Link>
          </div>
          <div className="about-image" style={{ "--about-image": `url("${home.about.image}")` } as CSSProperties} role="img" aria-label="Fachada da loja Minas Fer" />
        </Reveal>
      </section>

      <section className="cta-band">
        <Reveal className="container cta-inner">
          <div><h2>{home.cta.title}</h2><p>{home.cta.description}</p></div>
          <WhatsAppButton label="Fale com a equipe" message="Olá! Gostaria de solicitar um orçamento para meu projeto." whatsappNumber={global.whatsappNumber} />
        </Reveal>
      </section>
    </>
  );
}
