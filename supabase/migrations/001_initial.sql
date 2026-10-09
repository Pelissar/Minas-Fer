create extension if not exists pgcrypto;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  phone text not null,
  email text,
  item text not null,
  quantity text,
  service_type text,
  message text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed'))
);

alter table public.quote_requests enable row level security;

revoke all on table public.quote_requests from anon, authenticated;

drop policy if exists "public cannot read quote requests" on public.quote_requests;
drop policy if exists "public cannot insert quote requests" on public.quote_requests;

create policy "public cannot read quote requests"
  on public.quote_requests for select
  using (false);

create policy "public cannot insert quote requests"
  on public.quote_requests for insert
  with check (false);

comment on table public.quote_requests is 'Solicitações recebidas pelo formulário do site. A API usa a service role no servidor.';
