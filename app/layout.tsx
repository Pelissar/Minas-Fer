import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollProgress } from "./components/ScrollProgress";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Minas Fer & Minas Gerais | Materiais de serralheria e tornearia",
    template: "%s | Minas Fer & Minas Gerais"
  },
  description: "Materiais novos e usados para serralheria e tornearia, equipamentos para locação e atendimento em Andradina e região.",
  openGraph: {
    title: "Minas Fer & Minas Gerais",
    description: "Tudo para sua serralheria e tornearia.",
    type: "website",
    locale: "pt_BR"
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const globalSettings = await getSiteContent("global");
  return (
    <html lang="pt-BR">
      <body>
        <ScrollProgress />
        <Header settings={globalSettings} />
        <main>{children}</main>
        <Footer settings={globalSettings} />
      </body>
    </html>
  );
}
