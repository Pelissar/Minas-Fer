import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Política de privacidade" };

export default async function PrivacyPage() {
  const content = await getSiteContent("privacy");
  return (
    <section className="section"><div className="container prose"><div className="breadcrumb" style={{ color: "var(--muted)" }}><Link href="/">Início</Link><span>/</span><span>Privacidade</span></div><h1>{content.title}</h1><p>{content.introduction}</p>{content.sections.map((item, index) => <section key={`${item.title}-${index}`}><h2>{item.title}</h2><p>{item.body}</p></section>)}</div></section>
  );
}
