"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ImagePlus, LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryRecord, EquipmentRecord, ProductRecord } from "./types";

type Tab = "products" | "categories" | "equipment";
type Props = {
  activeTab: Tab;
  client: SupabaseClient;
  products: ProductRecord[];
  categories: CategoryRecord[];
  equipment: EquipmentRecord[];
  onChanged: () => Promise<void>;
  onNotice: (message: string) => void;
};

type ProductDraft = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: string;
  condition: "Novo" | "Usado";
  availability: "Em consulta" | "Sob encomenda";
  unit: string;
  image: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
};

type EquipmentDraft = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  specs: string;
  condition: string;
  availability: string;
  image: string;
  is_published: boolean;
  display_order: number;
};

type CategoryDraft = { id?: string; name: string; image: string; is_published: boolean; display_order: number };

const emptyProduct = (order: number): ProductDraft => ({
  slug: "", name: "", category: "", description: "", price: "", condition: "Novo", availability: "Em consulta",
  unit: "Unidade", image: "", is_featured: false, is_published: true, display_order: order
});
const emptyEquipment = (order: number): EquipmentDraft => ({
  slug: "", name: "", category: "Equipamentos para obras", description: "", specs: "",
  condition: "Condição informada no atendimento", availability: "Consultar disponibilidade",
  image: "", is_published: true, display_order: order
});
const emptyCategory = (order: number): CategoryDraft => ({ name: "", image: "", is_published: true, display_order: order });

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function safeImageUrl(value: string) {
  return value.startsWith("/") && !value.startsWith("//") || /^https:\/\//i.test(value);
}

async function uploadImage(client: SupabaseClient, file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error("Selecione um arquivo de imagem.");
  if (file.size > 10 * 1024 * 1024) throw new Error("A imagem precisa ter no máximo 10 MB.");
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from("site-media").upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: false });
  if (error) throw error;
  return client.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

export function CatalogManager({ activeTab, client, products, categories, equipment, onChanged, onNotice }: Props) {
  const [productDraft, setProductDraft] = useState<ProductDraft | null>(null);
  const [equipmentDraft, setEquipmentDraft] = useState<EquipmentDraft | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!productDraft) return;
    if (!safeImageUrl(productDraft.image)) {
      onNotice("Use um caminho local como /images/... ou uma URL HTTPS para a imagem.");
      return;
    }
    setSaving(true);
    const payload = {
      slug: slugify(productDraft.slug), name: productDraft.name.trim(), category: productDraft.category.trim(),
      description: productDraft.description.trim(), price: productDraft.price.trim(), condition: productDraft.condition, availability: productDraft.availability,
      unit: productDraft.unit.trim(), image: productDraft.image.trim(),
      accent: "linear-gradient(135deg, #17252a, #34484d)", is_featured: productDraft.is_featured,
      is_published: productDraft.is_published, display_order: Number(productDraft.display_order) || 0
    };
    const result = productDraft.id
      ? await client.from("products").update(payload).eq("id", productDraft.id)
      : await client.from("products").insert(payload);
    setSaving(false);
    if (result.error) { onNotice(result.error.message); return; }
    setProductDraft(null);
    onNotice("Produto salvo.");
    await onChanged();
  }

  async function saveEquipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!equipmentDraft) return;
    if (!safeImageUrl(equipmentDraft.image)) {
      onNotice("Use um caminho local como /images/... ou uma URL HTTPS para a imagem.");
      return;
    }
    setSaving(true);
    const payload = {
      slug: slugify(equipmentDraft.slug), name: equipmentDraft.name.trim(), category: equipmentDraft.category.trim(),
      description: equipmentDraft.description.trim(), specs: equipmentDraft.specs.split("\n").map((item) => item.trim()).filter(Boolean),
      condition: equipmentDraft.condition.trim(), availability: equipmentDraft.availability.trim(), image: equipmentDraft.image.trim(),
      is_published: equipmentDraft.is_published, display_order: Number(equipmentDraft.display_order) || 0
    };
    const result = equipmentDraft.id
      ? await client.from("equipment").update(payload).eq("id", equipmentDraft.id)
      : await client.from("equipment").insert(payload);
    setSaving(false);
    if (result.error) { onNotice(result.error.message); return; }
    setEquipmentDraft(null);
    onNotice("Equipamento salvo.");
    await onChanged();
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!categoryDraft) return;
    if (!safeImageUrl(categoryDraft.image)) {
      onNotice("Use um caminho local como /images/... ou uma URL HTTPS para a imagem.");
      return;
    }
    setSaving(true);
    const payload = {
      name: categoryDraft.name.trim(), image: categoryDraft.image.trim(),
      is_published: categoryDraft.is_published, display_order: Number(categoryDraft.display_order) || 0
    };
    const result = categoryDraft.id
      ? await client.from("categories").update(payload).eq("id", categoryDraft.id)
      : await client.from("categories").insert(payload);
    setSaving(false);
    if (result.error) { onNotice(result.error.message); return; }
    setCategoryDraft(null);
    onNotice("Categoria salva.");
    await onChanged();
  }

  async function remove(table: "products" | "equipment" | "categories", id: string, label: string) {
    if (!window.confirm(`Excluir ${label}? Esta ação não pode ser desfeita.`)) return;
    const { error } = await client.from(table).delete().eq("id", id);
    if (error) { onNotice(error.message); return; }
    onNotice(`${label} excluído.`);
    await onChanged();
  }

  async function handleUpload(file: File | undefined, folder: string, applyUrl: (url: string) => void) {
    if (!file) return;
    setUploading(true);
    try {
      applyUrl(await uploadImage(client, file, folder));
      onNotice("Imagem enviada para o Supabase Storage.");
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }

  if (activeTab === "products") {
    return (
      <div className="admin-manager">
        <div className="admin-manager-heading"><div><h2>Produtos</h2><p>Cadastre, edite, destaque ou oculte itens do catálogo.</p></div><button className="button button-primary" onClick={() => setProductDraft(emptyProduct(products.length + 1))}><Plus size={17} /> Novo produto</button></div>
        <div className="admin-record-list">
          {products.length ? products.map((product) => <article className="admin-record" key={product.id}>
            <Image src={product.image} alt="" width={136} height={116} unoptimized />
            <div className="admin-record-main"><strong>{product.name}</strong><span>{product.category} · {product.unit}</span><small>{product.is_published ? "Publicado" : "Oculto"}{product.is_featured ? " · Destaque da inicial" : ""}</small></div>
            <div className="admin-record-actions"><button title="Editar" onClick={() => setProductDraft({ ...product })}><Pencil size={16} /></button><button title="Excluir" onClick={() => void remove("products", product.id, product.name)}><Trash2 size={16} /></button></div>
          </article>) : <p className="admin-empty">Nenhum produto cadastrado.</p>}
        </div>
        {productDraft ? <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
          <div className="admin-modal-heading"><h2 id="product-form-title">{productDraft.id ? "Editar produto" : "Novo produto"}</h2><button type="button" className="admin-icon-button" aria-label="Fechar" onClick={() => setProductDraft(null)}><X size={19} /></button></div>
          <form className="admin-record-form" onSubmit={(event) => void saveProduct(event)}>
            <label>Nome<input required value={productDraft.name} onChange={(event) => setProductDraft({ ...productDraft, name: event.target.value, slug: productDraft.id ? productDraft.slug : slugify(event.target.value) })} /></label>
            <label>Slug da página<input required value={productDraft.slug} onChange={(event) => setProductDraft({ ...productDraft, slug: event.target.value })} /></label>
            <label>Categoria<input required list="admin-product-categories" value={productDraft.category} onChange={(event) => setProductDraft({ ...productDraft, category: event.target.value })} /><datalist id="admin-product-categories">{Array.from(new Set([...categories.map((category) => category.name), ...products.map((product) => product.category)])).map((name) => <option key={name} value={name} />)}</datalist></label>
            <label>Descrição<textarea rows={3} value={productDraft.description} onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })} /></label>
            <label>Preço exibido (opcional)<input value={productDraft.price} onChange={(event) => setProductDraft({ ...productDraft, price: event.target.value })} placeholder="Ex.: A partir de R$ 18,90 ou Consulte o preço" /></label>
            <div className="admin-form-row"><label>Condição<select value={productDraft.condition} onChange={(event) => setProductDraft({ ...productDraft, condition: event.target.value as ProductDraft["condition"] })}><option>Novo</option><option>Usado</option></select></label><label>Disponibilidade<select value={productDraft.availability} onChange={(event) => setProductDraft({ ...productDraft, availability: event.target.value as ProductDraft["availability"] })}><option>Em consulta</option><option>Sob encomenda</option></select></label></div>
            <div className="admin-form-row"><label>Unidade<input required value={productDraft.unit} onChange={(event) => setProductDraft({ ...productDraft, unit: event.target.value })} /></label><label>Ordem no catálogo<input type="number" value={productDraft.display_order} onChange={(event) => setProductDraft({ ...productDraft, display_order: Number(event.target.value) })} /></label></div>
            <ImageField value={productDraft.image} uploading={uploading} onChange={(value) => setProductDraft({ ...productDraft, image: value })} onFile={(file) => void handleUpload(file, "products", (image) => setProductDraft((current) => current ? { ...current, image } : current))} />
            <div className="admin-check-row"><label><input type="checkbox" checked={productDraft.is_featured} onChange={(event) => setProductDraft({ ...productDraft, is_featured: event.target.checked })} /> Mostrar entre os destaques da página inicial</label><label><input type="checkbox" checked={productDraft.is_published} onChange={(event) => setProductDraft({ ...productDraft, is_published: event.target.checked })} /> Publicado no site</label></div>
            <div className="admin-modal-actions"><button className="button button-primary" disabled={saving || uploading} type="submit">{saving ? <LoaderCircle size={17} className="spin" /> : <Save size={17} />} Salvar produto</button><button className="button button-ghost" type="button" onClick={() => setProductDraft(null)}>Cancelar</button></div>
          </form>
        </section></div> : null}
      </div>
    );
  }

  if (activeTab === "categories") {
    return (
      <div className="admin-manager">
        <div className="admin-manager-heading"><div><h2>Categorias</h2><p>Gerencie os cartões exibidos na seção de produtos da página inicial.</p></div><button className="button button-primary" onClick={() => setCategoryDraft(emptyCategory(categories.length + 1))}><Plus size={17} /> Nova categoria</button></div>
        <div className="admin-record-list">
          {categories.length ? categories.map((category) => <article className="admin-record" key={category.id}>
            <Image src={category.image} alt="" width={136} height={116} unoptimized />
            <div className="admin-record-main"><strong>{category.name}</strong><span>Posição {category.display_order}</span><small>{category.is_published ? "Visível no site" : "Oculta"}</small></div>
            <div className="admin-record-actions"><button title="Editar" onClick={() => setCategoryDraft({ ...category })}><Pencil size={16} /></button><button title="Excluir" onClick={() => void remove("categories", category.id, category.name)}><Trash2 size={16} /></button></div>
          </article>) : <p className="admin-empty">Nenhuma categoria cadastrada.</p>}
        </div>
        {categoryDraft ? <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="category-form-title">
          <div className="admin-modal-heading"><h2 id="category-form-title">{categoryDraft.id ? "Editar categoria" : "Nova categoria"}</h2><button type="button" className="admin-icon-button" aria-label="Fechar" onClick={() => setCategoryDraft(null)}><X size={19} /></button></div>
          <form className="admin-record-form" onSubmit={(event) => void saveCategory(event)}>
            <label>Nome da categoria<input required value={categoryDraft.name} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: event.target.value })} /></label>
            <label>Ordem de exibição<input type="number" value={categoryDraft.display_order} onChange={(event) => setCategoryDraft({ ...categoryDraft, display_order: Number(event.target.value) })} /></label>
            <ImageField value={categoryDraft.image} uploading={uploading} onChange={(value) => setCategoryDraft({ ...categoryDraft, image: value })} onFile={(file) => void handleUpload(file, "categories", (image) => setCategoryDraft((current) => current ? { ...current, image } : current))} />
            <div className="admin-check-row"><label><input type="checkbox" checked={categoryDraft.is_published} onChange={(event) => setCategoryDraft({ ...categoryDraft, is_published: event.target.checked })} /> Visível no site</label></div>
            <div className="admin-modal-actions"><button className="button button-primary" disabled={saving || uploading} type="submit">{saving ? <LoaderCircle size={17} className="spin" /> : <Save size={17} />} Salvar categoria</button><button className="button button-ghost" type="button" onClick={() => setCategoryDraft(null)}>Cancelar</button></div>
          </form>
        </section></div> : null}
      </div>
    );
  }

  return (
    <div className="admin-manager">
      <div className="admin-manager-heading"><div><h2>Equipamentos de locação</h2><p>Atualize a frota, as imagens, as condições e a disponibilidade.</p></div><button className="button button-primary" onClick={() => setEquipmentDraft(emptyEquipment(equipment.length + 1))}><Plus size={17} /> Novo equipamento</button></div>
      <div className="admin-record-list">
        {equipment.length ? equipment.map((item) => <article className="admin-record" key={item.id}>
          <Image src={item.image} alt="" width={136} height={116} unoptimized />
          <div className="admin-record-main"><strong>{item.name}</strong><span>{item.category}</span><small>{item.is_published ? "Publicado" : "Oculto"} · {item.availability}</small></div>
          <div className="admin-record-actions"><button title="Editar" onClick={() => setEquipmentDraft({ ...item, specs: item.specs.join("\n") })}><Pencil size={16} /></button><button title="Excluir" onClick={() => void remove("equipment", item.id, item.name)}><Trash2 size={16} /></button></div>
        </article>) : <p className="admin-empty">Nenhum equipamento cadastrado.</p>}
      </div>
      {equipmentDraft ? <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="equipment-form-title">
        <div className="admin-modal-heading"><h2 id="equipment-form-title">{equipmentDraft.id ? "Editar equipamento" : "Novo equipamento"}</h2><button type="button" className="admin-icon-button" aria-label="Fechar" onClick={() => setEquipmentDraft(null)}><X size={19} /></button></div>
        <form className="admin-record-form" onSubmit={(event) => void saveEquipment(event)}>
          <label>Nome<input required value={equipmentDraft.name} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, name: event.target.value, slug: equipmentDraft.id ? equipmentDraft.slug : slugify(event.target.value) })} /></label>
          <label>Slug<input required value={equipmentDraft.slug} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, slug: event.target.value })} /></label>
          <label>Categoria<input required value={equipmentDraft.category} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, category: event.target.value })} /></label>
          <label>Descrição<textarea rows={3} value={equipmentDraft.description} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, description: event.target.value })} /></label>
          <label>Especificações (uma por linha)<textarea rows={4} value={equipmentDraft.specs} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, specs: event.target.value })} /></label>
          <div className="admin-form-row"><label>Condição<input value={equipmentDraft.condition} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, condition: event.target.value })} /></label><label>Disponibilidade<input value={equipmentDraft.availability} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, availability: event.target.value })} /></label></div>
          <label>Ordem de exibição<input type="number" value={equipmentDraft.display_order} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, display_order: Number(event.target.value) })} /></label>
          <ImageField value={equipmentDraft.image} uploading={uploading} onChange={(value) => setEquipmentDraft({ ...equipmentDraft, image: value })} onFile={(file) => void handleUpload(file, "equipment", (image) => setEquipmentDraft((current) => current ? { ...current, image } : current))} />
          <div className="admin-check-row"><label><input type="checkbox" checked={equipmentDraft.is_published} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, is_published: event.target.checked })} /> Publicado no site</label></div>
          <div className="admin-modal-actions"><button className="button button-primary" disabled={saving || uploading} type="submit">{saving ? <LoaderCircle size={17} className="spin" /> : <Save size={17} />} Salvar equipamento</button><button className="button button-ghost" type="button" onClick={() => setEquipmentDraft(null)}>Cancelar</button></div>
        </form>
      </section></div> : null}
    </div>
  );
}

function ImageField({ value, uploading, onChange, onFile }: { value: string; uploading: boolean; onChange: (value: string) => void; onFile: (file: File | undefined) => void }) {
  function pick(event: ChangeEvent<HTMLInputElement>) { onFile(event.target.files?.[0]); event.target.value = ""; }
  return (
    <div className="admin-image-field">
      <label>Caminho ou URL da imagem<input required value={value} onChange={(event) => onChange(event.target.value)} placeholder="/images/minasfer/produto.jpg" /></label>
      <label className="admin-upload-button"><input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={pick} disabled={uploading} /><span>{uploading ? <LoaderCircle size={16} className="spin" /> : <ImagePlus size={16} />}{uploading ? "Enviando imagem..." : "Enviar imagem ao Supabase"}</span></label>
      {value && safeImageUrl(value) ? <Image className="admin-image-preview" src={value} alt="Prévia da imagem" width={440} height={280} unoptimized /> : null}
    </div>
  );
}
