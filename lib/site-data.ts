import { equipment as fallbackEquipment, products as fallbackProducts, type Equipment, type Product, type ProductCategory } from "@/lib/data";
import { categoryTiles } from "@/lib/data";
import { getSupabasePublicServerClient } from "@/lib/supabase/server";

type ProductRecord = Product & { is_featured: boolean; is_published: boolean; display_order: number };
type EquipmentRecord = Equipment & { is_published: boolean; display_order: number };
type CategoryRecord = { id: string; name: string; image: string; is_published: boolean; display_order: number };

export async function getPublicProducts(options: { featuredOnly?: boolean } = {}): Promise<Product[]> {
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return options.featuredOnly ? fallbackProducts.slice(0, 5) : fallbackProducts;

  let query = supabase.from("products").select("*").eq("is_published", true).order("display_order", { ascending: true });
  if (options.featuredOnly) query = query.eq("is_featured", true);
  const { data, error } = await query.returns<ProductRecord[]>();
  if (error) return options.featuredOnly ? fallbackProducts.slice(0, 5) : fallbackProducts;
  return (data || []).map(({ is_featured, is_published, display_order, ...product }) => ({
    ...product,
    isFeatured: is_featured,
    isPublished: is_published,
    sortOrder: display_order
  }));
}

export async function getPublicProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return fallbackProducts.find((product) => product.slug === slug) || null;

  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error) return fallbackProducts.find((product) => product.slug === slug) || null;
  if (!data) return null;
  const row = data as ProductRecord;
  const { is_featured, is_published, display_order, ...product } = row;
  return { ...product, isFeatured: is_featured, isPublished: is_published, sortOrder: display_order };
}

export async function getPublicEquipment(): Promise<Equipment[]> {
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return fallbackEquipment;
  const { data, error } = await supabase.from("equipment").select("*").eq("is_published", true).order("display_order", { ascending: true }).returns<EquipmentRecord[]>();
  if (error) return fallbackEquipment;
  return (data || []).map(({ is_published, display_order, ...item }) => ({
    ...item,
    specs: Array.isArray(item.specs) ? item.specs : [],
    isPublished: is_published,
    sortOrder: display_order
  }));
}

export async function getPublicCategories(): Promise<ProductCategory[]> {
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return categoryTiles.map(([name, image], index) => ({ name, image, sortOrder: index, isPublished: true }));
  const { data, error } = await supabase.from("categories").select("*").eq("is_published", true).order("display_order", { ascending: true }).returns<CategoryRecord[]>();
  if (error) return categoryTiles.map(([name, image], index) => ({ name, image, sortOrder: index, isPublished: true }));
  return (data || []).map(({ id, name, image, display_order }) => ({ id, name, image, sortOrder: display_order, isPublished: true }));
}

export function getProductCategoryNames(items: Product[]) {
  return Array.from(new Set(items.map((item) => item.category))).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
