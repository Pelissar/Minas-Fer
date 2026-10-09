"use client";

import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { whatsappUrl } from "@/lib/data";
import type { SiteContent } from "@/lib/site-content";

const links = [
  ["Início", "/"],
  ["Produtos", "/produtos"],
  ["Serviços", "/servicos"],
  ["Locação", "/locacao"],
  ["Sobre nós", "/sobre"],
  ["Contato", "/contato"]
];

export function Header({ settings }: { settings: SiteContent<"global"> }) {
  const [open, setOpen] = useState(false);
  const quoteUrl = whatsappUrl("Olá! Gostaria de solicitar um orçamento.", settings.whatsappNumber);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo light image={settings.logoImage} name={settings.name} shortName={settings.shortName} tagline={settings.tagline} />
        <button className="menu-toggle" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className={"main-nav" + (open ? " is-open" : "")} aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <a className="header-cta" href={quoteUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            <MessageCircle size={17} />
            Solicite um orçamento
          </a>
        </nav>
      </div>
    </header>
  );
}
