"use client";

import { useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { QuoteRequestRecord } from "./types";

export function QuoteRequestsManager({ client, quotes, onChanged, onNotice }: {
  client: SupabaseClient;
  quotes: QuoteRequestRecord[];
  onChanged: () => Promise<void>;
  onNotice: (message: string) => void;
}) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<QuoteRequestRecord | null>(null);
  const visible = quotes.filter((quote) => filter === "all" || quote.status === filter);

  async function updateStatus(id: string, status: QuoteRequestRecord["status"]) {
    const { error } = await client.from("quote_requests").update({ status }).eq("id", id);
    if (error) { onNotice(error.message); return; }
    onNotice("Status do orçamento atualizado.");
    await onChanged();
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir este orçamento? Esta ação não pode ser desfeita.")) return;
    const { error } = await client.from("quote_requests").delete().eq("id", id);
    if (error) { onNotice(error.message); return; }
    setSelected(null);
    onNotice("Orçamento excluído.");
    await onChanged();
  }

  return (
    <div className="admin-manager">
      <div className="admin-manager-heading"><div><h2>Solicitações de orçamento</h2><p>Pedidos enviados pelo formulário do site, protegidos pela permissão de administrador.</p></div><label className="admin-filter">Filtrar<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Todas</option><option value="new">Novas</option><option value="in_progress">Em andamento</option><option value="closed">Concluídas</option></select></label></div>
      {visible.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Solicitante</th><th>Pedido</th><th>Recebido em</th><th>Status</th><th>Ações</th></tr></thead><tbody>
        {visible.map((quote) => <tr key={quote.id}>
          <td><strong>{quote.name}</strong><span>{quote.company || quote.phone}</span></td>
          <td><strong>{quote.item}</strong><span>{quote.quantity || quote.service_type || "Detalhes sob consulta"}</span></td>
          <td>{new Date(quote.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
          <td><select aria-label={`Status de ${quote.name}`} value={quote.status} onChange={(event) => void updateStatus(quote.id, event.target.value as QuoteRequestRecord["status"])}><option value="new">Nova</option><option value="in_progress">Em andamento</option><option value="closed">Concluída</option></select></td>
          <td><div className="admin-record-actions"><button title="Ver detalhes" onClick={() => setSelected(quote)}><ExternalLink size={16} /></button><button title="Excluir solicitação" onClick={() => void remove(quote.id)}><Trash2 size={16} /></button></div></td>
        </tr>)}
      </tbody></table></div> : <div className="admin-empty"><h3>Nenhum orçamento nesta lista</h3><p>As solicitações aparecerão aqui quando o formulário estiver conectado ao Supabase.</p></div>}
      {selected ? <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal admin-quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-details-title">
        <div className="admin-modal-heading"><h2 id="quote-details-title">Detalhes do orçamento</h2><button type="button" className="admin-icon-button" aria-label="Fechar" onClick={() => setSelected(null)}>×</button></div>
        <dl className="admin-quote-details">
          <div><dt>Nome</dt><dd>{selected.name}</dd></div>
          <div><dt>Empresa</dt><dd>{selected.company || "Não informada"}</dd></div>
          <div><dt>Telefone</dt><dd><a href={`tel:${selected.phone}`}>{selected.phone}</a></dd></div>
          <div><dt>E-mail</dt><dd>{selected.email || "Não informado"}</dd></div>
          <div><dt>Produto ou serviço</dt><dd>{selected.item}</dd></div>
          <div><dt>Quantidade</dt><dd>{selected.quantity || "Não informada"}</dd></div>
          <div><dt>Tipo de atendimento</dt><dd>{selected.service_type || "Não informado"}</dd></div>
          <div className="admin-quote-message"><dt>Detalhes</dt><dd>{selected.message || "Nenhuma observação enviada."}</dd></div>
        </dl>
        <div className="admin-modal-actions"><a className="button button-primary" href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">Responder pelo WhatsApp</a><button className="button button-ghost" onClick={() => setSelected(null)}>Fechar</button></div>
      </section></div> : null}
    </div>
  );
}
