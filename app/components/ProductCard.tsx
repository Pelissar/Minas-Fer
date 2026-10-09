import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/data";
import { whatsappUrl } from "@/lib/data";

export function ProductCard({ product, whatsappNumber }: { product: Product; whatsappNumber?: string }) {
  return (
    <article className="product-card">
      <Link href={"/produtos/" + product.slug} className="product-image-wrap">
        <Image src={product.image} alt={product.name} className="product-image" fill sizes="(max-width: 600px) 100vw, (max-width: 980px) 33vw, 20vw" unoptimized />
        <span className="image-label">{product.condition}</span>
      </Link>
      <div className="product-card-body">
        <span className="card-kicker">{product.category}</span>
        <h3><Link href={"/produtos/" + product.slug}>{product.name}</Link></h3>
        <p>{product.description}</p>
        <strong className="product-price">{product.price || "Consulte o preço"}</strong>
        <div className="product-meta">
          <span>{product.unit}</span>
          <span>{product.availability}</span>
        </div>
        <div className="product-card-actions">
          <Link className="text-link" href={"/produtos/" + product.slug}>Ver detalhes <ArrowUpRight size={15} /></Link>
          <a className="icon-button" href={whatsappUrl("Olá! Gostaria de consultar o produto: " + product.name, whatsappNumber)} target="_blank" rel="noreferrer" aria-label={"Consultar " + product.name}>
            <MessageCircle size={17} />
          </a>
        </div>
      </div>
    </article>
  );
}
