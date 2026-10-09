"use client";

import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active || !data.session) return;
      const { data: membership } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.session.user.id)
        .maybeSingle();
      if (active && membership) router.replace("/admin/dashboard");
    });

    return () => { active = false; };
  }, [router, supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!supabase) {
      setMessage("Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ativar o painel.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      setMessage("E-mail ou senha inválidos.");
      setSubmitting(false);
      return;
    }

    const { data: membership, error: accessError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (accessError || !membership) {
      await supabase.auth.signOut();
      setMessage("Este usuário ainda não tem permissão de administrador.");
      setSubmitting(false);
      return;
    }

    router.replace("/admin/dashboard");
  }

  return (
    <section className="admin-shell">
      <div className="container">
        <div className="admin-card">
          <div className="service-icon"><LockKeyhole size={23} /></div>
          <span className="eyebrow">Acesso restrito</span>
          <h1>Painel administrativo</h1>
          <p>Entre com o usuário administrativo cadastrado no Supabase Auth.</p>
          <form className="admin-form" onSubmit={submit}>
            <label>E-mail administrativo<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@empresa.com" /></label>
            <label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button className="button button-primary" type="submit" disabled={submitting}>
              {submitting ? <LoaderCircle className="spin" size={17} /> : <ShieldCheck size={17} />}
              {submitting ? "Validando acesso..." : "Entrar no painel"}
            </button>
          </form>
          {message ? <p className="form-error" role="alert">{message}</p> : null}
          <p className="admin-disclaimer">Somente usuários cadastrados na lista de administradores do banco podem gerenciar o site.</p>
        </div>
      </div>
    </section>
  );
}
