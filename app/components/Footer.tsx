import Link from "next/link";
import { Instagram, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import type { SiteContent } from "@/lib/site-content";

export function Footer({ settings }: { settings: SiteContent<"global"> }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo light image={settings.logoImage} name={settings.name} shortName={settings.shortName} tagline={settings.tagline} />
          <p className="footer-summary">{settings.footerSummary}</p>
        </div>
        <div>
          <h3>Atalhos</h3>
          <div className="footer-links">
            <Link href="/produtos">Produtos</Link>
            <Link href="/servicos">Serviços</Link>
            <Link href="/locacao">Locação</Link>
            <Link href="/sobre">Sobre nós</Link>
            <Link href="/privacidade">Privacidade</Link>
          </div>
        </div>
        <div>
          <h3>Fale com a equipe</h3>
          <a className="footer-contact" href={settings.phoneHref}><Phone size={16} /> {settings.phone}</a>
          <a className="footer-contact" href={settings.maps} target="_blank" rel="noreferrer"><MapPin size={16} /> {settings.address}</a>
          <a className="footer-contact" href={settings.instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} {settings.name}. {settings.footerCopyright}</span>
        <span>Atendimento em {settings.address}</span>
      </div>
    </footer>
  );
}
