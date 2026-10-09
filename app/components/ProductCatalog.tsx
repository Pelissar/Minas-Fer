"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import { ProductCard } from "./ProductCard";

export function ProductCatalog({ products, categories, whatsappNumber }: { products: Product[]; categories: string[]; whatsappNumber?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [condition, setCondition] = useState("Todos");
  const visible = useMemo(() => products.filter((product) => {
    const text = (product.name + " " + product.description).toLowerCase();
    const matchQuery = !query || text.includes(query.toLowerCase());
    const matchCategory = category === "Todos" || product.category === category;
    const matchCondition = condition === "Todos" || product.condition === condition;
    return matchQuery && matchCategory && matchCondition;
  }), [products, query, category, condition]);

  return (
    <>
      <div className="catalog-toolbar">
        <label className="search-field"><Search size={18} /><span className="sr-only">Buscar produtos</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque por produto ou categoria" /></label>
        <label className="filter-field"><SlidersHorizontal size={16} /><span className="sr-only">Categoria</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Todos</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="filter-field"><span className="sr-only">Condição</span><select value={condition} onChange={(e) => setCondition(e.target.value)}><option>Todos</option><option>Novo</option><option>Usado</option></select></label>
      </div>
      <p className="catalog-count">{visible.length} {visible.length === 1 ? "item encontrado" : "itens encontrados"} <span>Valores e disponibilidade são confirmados no atendimento.</span></p>
      {visible.length ? <div className="product-grid">{visible.map((product) => <ProductCard key={product.id || product.slug} product={product} whatsappNumber={whatsappNumber} />)}</div> : <div className="empty-state"><h3>Nenhum item encontrado</h3><p>Tente ajustar os filtros ou falar com nossa equipe.</p></div>}
    </>
  );
}
