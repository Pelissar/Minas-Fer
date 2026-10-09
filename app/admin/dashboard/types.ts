import type { JsonValue } from "@/lib/site-content";

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: string;
  condition: "Novo" | "Usado";
  availability: "Em consulta" | "Sob encomenda";
  unit: string;
  image: string;
  accent: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
};

export type EquipmentRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  specs: string[];
  condition: string;
  availability: string;
  image: string;
  is_published: boolean;
  display_order: number;
};

export type CategoryRecord = {
  id: string;
  name: string;
  image: string;
  is_published: boolean;
  display_order: number;
};

export type QuoteRequestRecord = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  item: string;
  quantity: string | null;
  service_type: string | null;
  message: string | null;
  status: "new" | "in_progress" | "closed";
};

export type SiteContentRecord = {
  key: string;
  content: JsonValue;
  updated_at?: string;
};
