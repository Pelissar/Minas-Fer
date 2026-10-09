"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Package, ClipboardCheck, FileText, LayoutDashboard, Loader2, LogOut, Settings2, ShieldAlert, Tag, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { defaultSiteContent, type JsonValue } from "@/lib/site-content";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CategoryRecord, EquipmentRecord, ProductRecord, QuoteRequestRecord } from "./types";
import { CatalogManager } from "./CatalogManager";
import { ContentManager } from "./ContentManager";
import { QuoteRequestsManager } from "./QuoteRequestsManager";

type AdminTab = "overview" | "products" | "categories" | "equipment" | "content" | "quotes";
type AccessState = "checking" | "ready" | "setup-error" | "load-error";

const tabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "products", label: "Produtos", icon: Package },
  { id: "categories", label: "Categorias", icon: Tag },
  { id: "equipment", label: "Locação", icon: Wrench },
  { id: "content", label: "Conteúdo do site", icon: FileText },
  { id: "quotes", label: "Orçamentos", icon: ClipboardCheck }
];

function initialContent() {
  return JSON.parse(JSON.stringify(defaultSiteContent)) as Record<string, JsonValue>;
}

export function AdminDashboard() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [access, setAccess] = useState<AccessState>(supabase ? "checking" : "setup-error");
  const [accessMessage, setAccessMessage] = useState(supabase ? "" : "Configure as chaves públicas do Supabase no ambiente para ativar a autenticação do painel.");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [adminEmail, setAdminEmail] = useState("");
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [equipment, setEquipment] = useState<EquipmentRecord[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequestRecord[]>([]);
  const [content, setContent] = useState<Record<string, JsonValue>>(initialContent);
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    if (!supabase) return;
    const [productResult, categoryResult, equipmentResult, quoteResult, contentResult] = await Promise.all([
      supabase.from("products").select("*").order("display_order", { ascending: true }).returns<ProductRecord[]>(),
      supabase.from("categories").select("*").order("display_order", { ascending: true }).returns<CategoryRecord[]>(),
      supabase.from("equipment").select("*").order("display_order", { ascending: true }).returns<EquipmentRecord[]>(),
      supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(100).returns<QuoteRequestRecord[]>(),
      supabase.from("site_content").select("key,content")
    ]);

    const firstError = [productResult.error, categoryResult.error, equipmentResult.error, quoteResult.error, contentResult.error].find(Boolean);
    if (firstError) {
      setAccessMessage(firstError.message);
      setAccess("load-error");
      return;
    }

    setProducts(productResult.data || []);
    setCategories(categoryResult.data || []);
    setEquipment(equipmentResult.data || []);
    setQuotes(quoteResult.data || []);
    const nextContent = initialContent();
    for (const row of contentResult.data || []) {
      nextContent[row.key] = row.content as JsonValue;
    }
    setContent(nextContent);
    setAccess("ready");
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let active = true;

    async function checkAccess() {
      const { data, error } = await client.auth.getSession();
      if (!active) return;
      if (error) {
        setAccess("setup-error");
        setAccessMessage(error.message);
        return;
      }
      if (!data.session) {
        router.replace("/admin");
        return;
      }

      const { data: membership, error: membershipError } = await client
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.session.user.id)
        .maybeSingle();
      if (!active) return;
      if (membershipError) {
        setAccess("setup-error");
        setAccessMessage(membershipError.message);
        return;
      }
      if (!membership) {
        await client.auth.signOut();
        router.replace("/admin?acesso=negado");
        return;
      }

      setAdminEmail(data.session.user.email || "Administrador");
      await loadData();
    }

    void checkAccess();
    const { data: authListener } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/admin");
    });
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadData, router, supabase]);

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin");
  }

  if (supabase && access === "checking") {
    return <section className="admin-shell"><div className="container admin-loading"><Loader2 className="spin" /> Verificando sessão administrativa...</div></section>;
  }

  if (access === "setup-error" || access === "load-error") {
    return (
      <section className="admin-shell">
        <div className="container">
          <div className="admin-setup-error"><ShieldAlert size={28} /><h1>Não foi possível carregar o painel</h1><p>{accessMessage}</p><p>Confirme as variáveis do Supabase e aplique a migration <code>002_admin_cms.sql</code> antes de entrar.</p><button className="button button-outline" onClick={() => router.push("/admin")}>Voltar ao login</button></div>
        </div>
      </section>
    );
  }

  const pendingQuotes = quotes.filter((quote) => quote.status === "new").length;

  return (
    <section className="admin-shell admin-dashboard-shell">
      <div className="container admin-dashboard-container">
        <header className="admin-dashboard-header">
          <div><span className="eyebrow">Área administrativa</span><h1>Gerencie seu site</h1><p>Conectado como {adminEmail}</p></div>
          <button className="button button-outline" onClick={() => void signOut()}><LogOut size={16} /> Sair</button>
        </header>

        {notice ? <div className="admin-notice" role="status">{notice}<button type="button" aria-label="Fechar aviso" onClick={() => setNotice("")}>×</button></div> : null}

        <nav className="admin-tabs" aria-label="Seções do painel">
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} className={activeTab === id ? "is-active" : ""} onClick={() => setActiveTab(id)}><Icon size={17} />{label}{id === "quotes" && pendingQuotes > 0 ? <span className="admin-tab-count">{pendingQuotes}</span> : null}</button>)}
        </nav>

        {activeTab === "overview" ? (
          <div className="admin-manager">
            <div className="dashboard-stats">
              <div className="dashboard-stat"><strong>{products.length}</strong><span>Produtos cadastrados</span></div>
              <div className="dashboard-stat"><strong>{categories.length}</strong><span>Categorias cadastradas</span></div>
              <div className="dashboard-stat"><strong>{equipment.length}</strong><span>Equipamentos de locação</span></div>
              <div className="dashboard-stat"><strong>{pendingQuotes}</strong><span>Orçamentos novos</span></div>
            </div>
            <div className="dashboard-panels">
              <article className="dashboard-panel"><h2>O que você pode gerenciar</h2><ul className="dashboard-checklist"><li><Package size={17} /> Produtos, preços, imagens e destaque na página inicial</li><li><Tag size={17} /> Categorias e imagens exibidas no catálogo</li><li><Wrench size={17} /> Equipamentos, disponibilidade e especificações de locação</li><li><FileText size={17} /> Textos, informações de contato e conteúdo das páginas</li><li><ClipboardCheck size={17} /> Solicitações recebidas pelo formulário do site</li></ul></article>
              <article className="dashboard-panel"><h2>Comece por aqui</h2><p>Cadastre um produto ou equipamento, atualize os textos e acompanhe os orçamentos sem editar código.</p><div className="admin-quick-actions"><button className="button button-primary" onClick={() => setActiveTab("products")}><Package size={16} /> Gerenciar produtos</button><button className="button button-outline" onClick={() => setActiveTab("content")}><Settings2 size={16} /> Editar conteúdo</button></div></article>
            </div>
          </div>
        ) : null}

        {activeTab === "products" || activeTab === "categories" || activeTab === "equipment" ? (
          <CatalogManager
            activeTab={activeTab}
            client={supabase!}
            products={products}
            categories={categories}
            equipment={equipment}
            onChanged={loadData}
            onNotice={setNotice}
          />
        ) : null}
        {activeTab === "content" ? <ContentManager client={supabase!} content={content} onSaved={loadData} onNotice={setNotice} /> : null}
        {activeTab === "quotes" ? <QuoteRequestsManager client={supabase!} quotes={quotes} onChanged={loadData} onNotice={setNotice} /> : null}
      </div>
    </section>
  );
}
