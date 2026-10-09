"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/data";

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  item: string;
  quantity: string;
  serviceType: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  company: "",
  phone: "",
  email: "",
  item: "",
  quantity: "",
  serviceType: "Compra de material",
  message: ""
};

export function QuoteForm({ compact = false, whatsappNumber }: { compact?: boolean; whatsappNumber?: string }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [persisted, setPersisted] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("quote");
      const result = await response.json();
      setPersisted(Boolean(result.persisted));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    const message = [
      "Olá! Gostaria de solicitar um orçamento.",
      "Nome: " + form.name,
      form.company ? "Empresa: " + form.company : "",
      "Telefone/WhatsApp: " + form.phone,
      form.email ? "E-mail: " + form.email : "",
      "Produto/serviço: " + form.item,
      form.quantity ? "Quantidade: " + form.quantity : "",
      "Tipo: " + form.serviceType,
      form.message ? "Detalhes: " + form.message : ""
    ].filter(Boolean).join("\n");
    return (
      <div className="form-success">
        <CheckCircle2 size={36} />
        <h3>{persisted ? "Solicitação registrada" : "Solicitação preparada"}</h3>
        <p>{persisted ? "Recebemos seus dados. Confirme o envio da mensagem no WhatsApp para agilizar o atendimento." : "Confira os dados e confirme o envio da mensagem no WhatsApp para concluir o contato."}</p>
        <a className="button button-primary" href={whatsappUrl(message, whatsappNumber)} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> Continuar pelo WhatsApp
        </a>
        <button className="button button-ghost" type="button" onClick={() => { setForm(initialState); setPersisted(false); setStatus("idle"); }}>Enviar outra solicitação</button>
      </div>
    );
  }

  return (
    <form className={"quote-form" + (compact ? " quote-form-compact" : "")} onSubmit={submit}>
      <div className="form-grid">
        <label>Nome completo *<input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Como podemos chamar você?" /></label>
        <label>Empresa <input value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Opcional" /></label>
        <label>Telefone ou WhatsApp *<input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(18) 99999-9999" /></label>
        <label>E-mail <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="voce@empresa.com" /></label>
        <label>Produto ou serviço desejado *<input required value={form.item} onChange={(e) => update("item", e.target.value)} placeholder="Ex.: tubo quadrado, locação..." /></label>
        <label>Quantidade estimada<input value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="Ex.: 10 barras" /></label>
        <label>Tipo de atendimento<select value={form.serviceType} onChange={(e) => update("serviceType", e.target.value)}><option>Compra de material</option><option>Material usado</option><option>Locação de equipamento</option><option>Outro</option></select></label>
        <label className="field-wide">Descreva sua necessidade<textarea required={!compact} rows={compact ? 3 : 5} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Conte medidas, prazo e outras informações importantes." /></label>
      </div>
      <div className="form-footer">
        <span>Seus dados são usados somente para retornar o contato.</span>
        <button className="button button-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? <Loader2 size={18} className="spin" /> : <MessageCircle size={18} />}
          {status === "sending" ? "Enviando..." : "Solicitar orçamento"}
        </button>
      </div>
      {status === "error" ? <p className="form-error" role="alert">Não foi possível registrar agora. Tente novamente ou fale diretamente pelo WhatsApp.</p> : null}
    </form>
  );
}
