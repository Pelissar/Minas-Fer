import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://minasfer.com.br";
  return ["/", "/produtos", "/servicos", "/locacao", "/sobre", "/contato", "/privacidade"].map((path) => ({ url: base + path, lastModified: new Date() }));
}
