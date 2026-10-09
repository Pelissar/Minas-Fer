"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { JsonValue } from "@/lib/site-content";

const sections = [
  ["global", "Marca e contato"],
  ["home", "Página inicial"],
  ["catalog", "Catálogo"],
  ["about", "Sobre nós"],
  ["services", "Serviços"],
  ["rental", "Locação"],
  ["contact", "Contato"],
  ["privacy", "Privacidade"]
] as const;

export function ContentManager({ client, content, onSaved, onNotice }: {
  client: SupabaseClient;
  content: Record<string, JsonValue>;
  onSaved: () => Promise<void>;
  onNotice: (message: string) => void;
}) {
  const [section, setSection] = useState<string>("global");
  const [drafts, setDrafts] = useState<Record<string, JsonValue>>({});
  const [saving, setSaving] = useState(false);
  const draft = drafts[section] ?? content[section] ?? {};

  async function save() {
    setSaving(true);
    const { error } = await client.from("site_content").upsert({ key: section, content: draft, updated_at: new Date().toISOString() }, { onConflict: "key" });
    setSaving(false);
    if (error) { onNotice(error.message); return; }
    onNotice("Conteúdo salvo. A página pública já usará as alterações.");
    await onSaved();
  }

  return (
    <div className="admin-manager">
      <div className="admin-manager-heading"><div><h2>Conteúdo do site</h2><p>Edite textos, informações de contato e blocos institucionais sem alterar o código.</p></div><button className="button button-primary" onClick={() => void save()} disabled={saving}><Save size={17} />{saving ? "Salvando..." : "Salvar alterações"}</button></div>
      <div className="admin-content-editor">
        <nav className="admin-content-nav" aria-label="Páginas do site">
          {sections.map(([key, label]) => <button key={key} className={section === key ? "is-active" : ""} onClick={() => setSection(key)}>{label}</button>)}
        </nav>
        <div className="admin-content-fields">
          {draft && typeof draft === "object" && !Array.isArray(draft)
            ? Object.entries(draft).map(([key, value]) => <ContentField key={key} label={labelize(key)} value={value} path={[key]} onChange={(path, nextValue) => setDrafts((current) => ({ ...current, [section]: updatePath(current[section] ?? content[section] ?? {}, path, nextValue) }))} />)
            : <p className="admin-empty">Não há campos de conteúdo nesta seção.</p>}
        </div>
      </div>
    </div>
  );
}

function ContentField({ label, value, path, onChange }: {
  label: string;
  value: JsonValue;
  path: (string | number)[];
  onChange: (path: (string | number)[], value: JsonValue) => void;
}) {
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string")) {
      return <label className="admin-content-field">{label}<textarea rows={Math.min(Math.max(value.length + 1, 3), 8)} value={value.join("\n")} onChange={(event) => onChange(path, event.target.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))} /><small>Um item por linha.</small></label>;
    }
    if (value.every((item) => Array.isArray(item) && item.every((entry) => typeof entry === "string"))) {
      return <label className="admin-content-field">{label}<textarea rows={Math.min(Math.max(value.length + 1, 3), 8)} value={value.map((item) => (item as string[]).join(" | ")).join("\n")} onChange={(event) => onChange(path, event.target.value.split(/\r?\n/).filter(Boolean).map((line) => line.split("|").map((part) => part.trim())))} /><small>Use uma linha por item, separando os campos com |.</small></label>;
    }

    const template = value.find((item) => item && typeof item === "object" && !Array.isArray(item));
    return (
      <fieldset className="admin-content-array"><legend>{label}</legend>
        {value.map((item, index) => <div className="admin-content-array-row" key={index}>
          {item && typeof item === "object" && !Array.isArray(item)
            ? Object.entries(item).map(([key, child]) => <ContentField key={key} label={labelize(key)} value={child} path={[...path, index, key]} onChange={onChange} />)
            : <ContentField label={`${label} ${index + 1}`} value={item} path={[...path, index]} onChange={onChange} />}
          <button type="button" className="admin-text-danger" onClick={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))}>Remover item</button>
        </div>)}
        {template && typeof template === "object" && !Array.isArray(template) ? <button type="button" className="button button-outline" onClick={() => onChange(path, [...value, emptyLike(template)])}>Adicionar item</button> : null}
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    return <fieldset className="admin-content-object"><legend>{label}</legend>{Object.entries(value).map(([key, child]) => <ContentField key={key} label={labelize(key)} value={child} path={[...path, key]} onChange={onChange} />)}</fieldset>;
  }

  if (typeof value === "boolean") {
    return <label className="admin-content-checkbox"><input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} />{label}</label>;
  }

  if (typeof value === "number") {
    return <label className="admin-content-field">{label}<input type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} /></label>;
  }

  const text = value === null ? "" : String(value);
  const multiline = text.length > 90 || /description|summary|address|title|note|tagline/i.test(path[path.length - 1]?.toString() || "");
  return <label className="admin-content-field">{label}{multiline ? <textarea rows={3} value={text} onChange={(event) => onChange(path, event.target.value)} /> : <input value={text} onChange={(event) => onChange(path, event.target.value)} />}</label>;
}

function labelize(key: string) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase());
}

function emptyLike(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, emptyLike(child)]));
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  return "";
}

function updatePath(current: JsonValue, path: (string | number)[], nextValue: JsonValue): JsonValue {
  if (path.length === 0) return nextValue;
  const [segment, ...rest] = path;
  if (Array.isArray(current) && typeof segment === "number") {
    return current.map((item, index) => index === segment ? updatePath(item, rest, nextValue) : item);
  }
  if (current && typeof current === "object" && !Array.isArray(current) && typeof segment === "string") {
    return { ...current, [segment]: updatePath(current[segment] ?? null, rest, nextValue) };
  }
  return current;
}
