import type { Metadata } from "next";
import Link from "next/link";
import { ProductCatalog } from "../components/ProductCatalog";
import { getSiteContent } from "@/lib/site-content";
import { getPublicCategories, getPublicProducts, getProductCategoryNames } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Catálogo de materiais para serralheria e tornearia da Minas Fer."
};

export default async function ProductsPage() {
  const [content, global, products, categories] = await Promise.all([
    getSiteContent("catalog"),
    getSiteContent("global"),
    getPublicProducts(),
    getPublicCategories()
  ]);
  const categoryNames = Array.from(new Set([...categories.map((category) => category.name), ...getProductCategoryNames(products)])).sort((a, b) => a.localeCompare(b, "pt-BR"));
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Início</Link><span>/</span><span>Produtos</span></div>
          <h1>{content.heroTitle}</h1>
          <p>{content.heroDescription}</p>
        </div>
      </section>
      <section className="section section-surface">
        <div className="container">
          <ProductCatalog products={products} categories={categoryNames} whatsappNumber={global.whatsappNumber} />
        </div>
      </section>
    </>
  );
}
