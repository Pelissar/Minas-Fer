create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null default '',
  condition text not null default 'Novo' check (condition in ('Novo', 'Usado')),
  availability text not null default 'Em consulta' check (availability in ('Em consulta', 'Sob encomenda')),
  unit text not null default 'Unidade',
  image text not null,
  accent text not null default 'linear-gradient(135deg, #17252a, #34484d)',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists price text not null default '';

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'Equipamentos para obras',
  description text not null default '',
  specs jsonb not null default '[]'::jsonb check (jsonb_typeof(specs) = 'array'),
  condition text not null default 'Condição informada no atendimento',
  availability text not null default 'Consultar disponibilidade',
  image text not null,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image text not null,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$function$;

revoke all on function public.is_site_admin() from public, anon;
grant execute on function public.is_site_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.equipment enable row level security;
alter table public.categories enable row level security;
alter table public.site_content enable row level security;
alter table public.quote_requests enable row level security;

drop policy if exists "admins can read own membership" on public.admin_users;
create policy "admins can read own membership"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "public can read published products" on public.products;
create policy "public can read published products"
  on public.products for select to anon, authenticated
  using (is_published or (select public.is_site_admin()));
drop policy if exists "admins can manage products" on public.products;
create policy "admins can manage products"
  on public.products for all to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

drop policy if exists "public can read published equipment" on public.equipment;
create policy "public can read published equipment"
  on public.equipment for select to anon, authenticated
  using (is_published or (select public.is_site_admin()));
drop policy if exists "admins can manage equipment" on public.equipment;
create policy "admins can manage equipment"
  on public.equipment for all to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

drop policy if exists "public can read published categories" on public.categories;
create policy "public can read published categories"
  on public.categories for select to anon, authenticated
  using (is_published or (select public.is_site_admin()));
drop policy if exists "admins can manage categories" on public.categories;
create policy "admins can manage categories"
  on public.categories for all to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

drop policy if exists "public can read site content" on public.site_content;
create policy "public can read site content"
  on public.site_content for select to anon, authenticated
  using (true);
drop policy if exists "admins can manage site content" on public.site_content;
create policy "admins can manage site content"
  on public.site_content for all to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

drop policy if exists "admins can read quote requests" on public.quote_requests;
create policy "admins can read quote requests"
  on public.quote_requests for select to authenticated
  using ((select public.is_site_admin()));
drop policy if exists "admins can update quote requests" on public.quote_requests;
create policy "admins can update quote requests"
  on public.quote_requests for update to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));
drop policy if exists "admins can delete quote requests" on public.quote_requests;
create policy "admins can delete quote requests"
  on public.quote_requests for delete to authenticated
  using ((select public.is_site_admin()));

grant select on public.products, public.equipment, public.categories, public.site_content to anon, authenticated;
grant insert, update, delete on public.products, public.equipment, public.categories, public.site_content to authenticated;
grant select on public.admin_users to authenticated;
grant select, update, delete on public.quote_requests to authenticated;

create index if not exists products_public_order_idx on public.products (is_published, display_order);
create index if not exists equipment_public_order_idx on public.equipment (is_published, display_order);
create index if not exists categories_public_order_idx on public.categories (is_published, display_order);
create index if not exists quote_requests_status_created_at_idx on public.quote_requests (status, created_at desc);

insert into public.products (slug, name, category, description, condition, availability, unit, image, accent, is_featured, display_order)
values
  ('tubo-quadrado-20x20', 'Tubo quadrado 20x20', 'Tubos e canos', 'Tubo quadrado para estruturas, portões, grades e projetos de serralheria.', 'Novo', 'Em consulta', 'Barra', '/images/minasfer/square-tubes-pixabay.jpg', 'linear-gradient(135deg, #17252a, #34484d)', true, 1),
  ('vergalhao-1-2', 'Vergalhão 1/2"', 'Vergalhões', 'Vergalhão para armações, reforços e aplicações na construção civil.', 'Novo', 'Em consulta', 'Barra', '/images/minasfer/rebar.jpg', 'linear-gradient(135deg, #263a40, #74858a)', true, 2),
  ('chapa-galvanizada', 'Chapa galvanizada', 'Barras e chapas', 'Chapa galvanizada para fechamentos, fabricação e manutenção.', 'Novo', 'Em consulta', 'Peça', '/images/minasfer/steel-sheets.jpg', 'linear-gradient(135deg, #152126, #5b6f73)', true, 3),
  ('disco-de-corte-7', 'Disco de corte 7"', 'Abrasivos e discos', 'Disco abrasivo para corte de metais e trabalhos de acabamento.', 'Novo', 'Em consulta', 'Unidade', '/images/minasfer/cutting-disc.svg', 'linear-gradient(135deg, #1b2b30, #52656c)', true, 4),
  ('inversora-de-solda-160a', 'Inversora de solda 160A', 'Ferramentas', 'Inversora compacta para serviços de solda em oficina e obra.', 'Novo', 'Em consulta', 'Unidade', '/images/minasfer/welder.jpg', 'linear-gradient(135deg, #283a3f, #84949a)', true, 5),
  ('perfis-metalicos', 'Perfis metálicos', 'Perfis metálicos', 'Perfis para estruturas, portões, mezaninos e projetos de serralheria.', 'Novo', 'Em consulta', 'Barra', '/images/minasfer/metal-profiles.jpg', 'linear-gradient(135deg, #17252a, #34484d)', false, 6),
  ('tubos-e-canos', 'Tubos e canos', 'Tubos e canos', 'Tubos redondos e quadrados para aplicações industriais e residenciais.', 'Novo', 'Em consulta', 'Barra', '/images/minasfer/metal-tubes.jpg', 'linear-gradient(135deg, #152126, #5b6f73)', false, 7),
  ('ferragens-e-acessorios', 'Ferragens e acessórios', 'Ferragens e acessórios', 'Itens de acabamento, fixação e montagem para o seu projeto.', 'Novo', 'Em consulta', 'Unidade', '/images/minasfer/steel-hardware.jpg', 'linear-gradient(135deg, #283a3f, #84949a)', false, 8),
  ('equipamentos-de-protecao', 'Equipamentos de proteção', 'Equipamentos de proteção', 'Itens essenciais para segurança no trabalho e na oficina.', 'Novo', 'Em consulta', 'Unidade', '/images/minasfer/safety-equipment.jpg', 'linear-gradient(135deg, #1d302a, #4e7860)', false, 9)
on conflict (slug) do nothing;

insert into public.equipment (slug, name, category, description, specs, condition, availability, image, display_order)
values
  ('mini-escavadeira', 'Escavadeira', 'Equipamentos para obras', 'Escavadeira para apoio em escavações, limpeza e preparação de terrenos.', '["Orientação de uso", "Manutenção em dia", "Consultar período"]'::jsonb, 'Condição informada no atendimento', 'Consultar disponibilidade', '/images/minasfer/excavator.jpg', 1),
  ('betoneira', 'Betoneira', 'Equipamentos para obras', 'Betoneira para mistura de concreto em obras de diferentes portes.', '["Capacidade sob consulta", "Retirada ou entrega", "Consultar período"]'::jsonb, 'Condição informada no atendimento', 'Consultar disponibilidade', '/images/minasfer/concrete-mixer.jpg', 2),
  ('gerador-de-energia', 'Gerador de energia', 'Máquinas e equipamentos', 'Gerador para apoio em obras, eventos e operações temporárias.', '["Potência sob consulta", "Orientação técnica", "Consultar período"]'::jsonb, 'Condição informada no atendimento', 'Consultar disponibilidade', '/images/minasfer/generator.jpg', 3),
  ('compactador-de-solo', 'Compactador de solo', 'Equipamentos para obras', 'Equipamento para compactação em obras e preparação de pisos.', '["Orientação de uso", "Manutenção em dia", "Consultar período"]'::jsonb, 'Condição informada no atendimento', 'Consultar disponibilidade', '/images/minasfer/soil-compactor.jpg', 4)
on conflict (slug) do nothing;

insert into public.categories (name, image, display_order)
values
  ('Perfis metálicos', '/images/minasfer/metal-profiles.jpg', 1),
  ('Barras e chapas', '/images/minasfer/steel-sheets.jpg', 2),
  ('Tubos e canos', '/images/minasfer/metal-tubes.jpg', 3),
  ('Acessórios em geral', '/images/minasfer/steel-hardware.jpg', 4),
  ('Ferramentas', '/images/minasfer/power-tools.jpg', 5),
  ('Abrasivos e discos', '/images/minasfer/cutting-disc.svg', 6),
  ('EPI''s', '/images/minasfer/safety-equipment.jpg', 7),
  ('E muito mais...', '/images/minasfer/welder.jpg', 8)
on conflict (name) do nothing;

insert into public.site_content (key, content)
values
  ('global', $content${
    "name":"Minas Fer & Minas Gerais",
    "shortName":"Minas Fer",
    "tagline":"Materiais de serralheria e tornearia",
    "logoImage":"/logo-minasfer.png",
    "phone":"(18) 3722-8320",
    "phoneHref":"tel:+551837228320",
    "address":"Rua Minas Gerais, 1972, Vila Rica, Andradina - SP, CEP 16901-475",
    "instagram":"https://www.instagram.com/minasferminas/",
    "maps":"https://www.google.com/maps/search/?api=1&query=Rua+Minas+Gerais%2C+1972%2C+Andradina+-+SP",
    "whatsappNumber":"",
    "footerSummary":"Materiais para serralheria e tornearia, produtos novos e usados e equipamentos para locação.",
    "footerCopyright":"Todos os direitos reservados."
  }$content$::jsonb),
  ('home', $content${
    "hero":{"eyebrow":"Qualidade e confiança em cada projeto","title":"Tudo para sua","highlight":"serralheria e tornearia","description":"Materiais novos e usados, locação de equipamentos e soluções para o seu negócio.","note":"Atendimento para profissionais, empresas e projetos especiais.","image":"/images/minasfer/hero-steel-pipes.jpg"},
    "trustItems":[{"title":"Produtos novos e usados","description":"Qualidade e economia"},{"title":"Locação de equipamentos","description":"Praticidade para o trabalho"},{"title":"Atendimento especializado","description":"Equipe pronta para ajudar"},{"title":"Orçamento simplificado","description":"Resposta pelo canal escolhido"}],
    "categories":{"eyebrow":"Nossos produtos","title":"Materiais de serralheria e tornearia","description":"Trabalhamos com uma ampla variedade de materiais, desde os mais comuns até os mais específicos, sempre com qualidade e procedência."},
    "featured":{"eyebrow":"Catálogo em destaque","title":"Consulte os materiais disponíveis","description":"Encontre o que precisa e confirme medidas, condição e disponibilidade com a nossa equipe."},
    "rental":{"eyebrow":"Locação de equipamentos","title":"Equipamentos para o seu trabalho","description":"Aqui você encontra locação de equipamentos com orientação para escolher a solução adequada ao seu projeto."},
    "about":{"eyebrow":"Sobre nós","title":"Minas Fer & Minas Gerais","description":"Trabalhamos com materiais de serralheria e tornearia, produtos novos e usados e soluções para atender às necessidades de profissionais e empresas.","points":["Atendimento próximo e personalizado","Materiais para diferentes etapas do projeto","Equipe pronta para orientar sua compra"],"image":"/reference/about-store.png"},
    "cta":{"title":"Solicite um orçamento agora mesmo!","description":"Tire suas dúvidas, confira disponibilidade e encontre o material certo."}
  }$content$::jsonb),
  ('catalog', $content${"heroTitle":"Materiais para cada projeto","heroDescription":"Explore as categorias e converse com nossa equipe para confirmar medidas, condição e disponibilidade.","eyebrow":"Nosso catálogo","title":"Encontre o material certo","description":"Valores e disponibilidade são confirmados no atendimento."}$content$::jsonb),
  ('about', $content${"heroTitle":"Uma equipe perto do seu projeto","heroDescription":"Materiais de serralheria e tornearia, produtos novos e usados e soluções para profissionais e empresas.","introEyebrow":"Minas Fer & Minas Gerais","introTitle":"Experiência de compra com atendimento humano","introDescription":"Trabalhamos para que cada pessoa encontre uma solução adequada ao projeto, com informação clara sobre os materiais e as condições disponíveis.","image":"/reference/about-store.png","points":["Produtos novos e usados sob consulta","Atendimento para Andradina e região","Locação de equipamentos cadastrados","Comunicação direta pelo canal escolhido"],"commitmentsEyebrow":"Nossos compromissos","commitmentsTitle":"Princípios que orientam o atendimento","commitments":[{"title":"Informação clara","description":"Condições, preços e disponibilidade são confirmados antes de qualquer fechamento."},{"title":"Proximidade","description":"Você conversa com uma equipe acessível para tirar dúvidas e decidir com segurança."},{"title":"Atuação local","description":"Atendimento a partir de Andradina, com logística combinada para cada necessidade."}]}$content$::jsonb),
  ('services', $content${"heroTitle":"Suporte para tirar o projeto do papel","heroDescription":"Do primeiro contato à escolha do material, você fala com pessoas que entendem a rotina de serralheria e tornearia.","eyebrow":"Como ajudamos","title":"Mais clareza para comprar e locar","description":"Cada atendimento começa entendendo o que você precisa. As condições comerciais e a disponibilidade são confirmadas pela equipe.","items":[{"title":"Orientação para o projeto","description":"Conte as medidas e a aplicação. A equipe ajuda a organizar a consulta do material certo."},{"title":"Separação sob consulta","description":"Confirmamos condição, unidade, disponibilidade e detalhes antes de fechar o pedido."},{"title":"Retirada e entrega","description":"Combine a melhor forma de receber seus materiais conforme a região e o tamanho do pedido."},{"title":"Atendimento próximo","description":"Um canal direto para profissionais, empresas e quem está começando um novo projeto."}]}$content$::jsonb),
  ('contact', $content${"heroTitle":"Vamos conversar sobre o seu projeto","heroDescription":"Preencha o formulário e conte o que precisa. Você poderá continuar pelo WhatsApp depois do envio.","panelTitle":"Minas Fer & Minas Gerais","panelDescription":"Atendimento comercial para materiais, produtos usados e locação de equipamentos."}$content$::jsonb),
  ('privacy', $content${"title":"Política de privacidade","introduction":"Esta página explica como os dados enviados pelo formulário de orçamento são usados. Revise este conteúdo com a empresa antes da publicação.","sections":[{"title":"Dados enviados","body":"O formulário solicita informações como nome, telefone, empresa, e-mail e detalhes do pedido para permitir o retorno da equipe."},{"title":"Uso das informações","body":"Use os dados para atendimento e acompanhamento da solicitação. Revise esta política e os procedimentos internos antes de publicar."},{"title":"Armazenamento e acesso","body":"Quando o Supabase estiver configurado, as solicitações serão armazenadas no projeto e poderão ser acessadas por administradores autorizados. Defina o prazo interno de retenção."}]}$content$::jsonb),
  ('rental', $content${"heroTitle":"Equipamentos para a sua obra","heroDescription":"Consulte os equipamentos cadastrados e converse com a equipe para checar período, condição e logística.","eyebrow":"Locação sob consulta","title":"Escolha o apoio que seu projeto precisa","description":"A disponibilidade é atualizada no atendimento. Nenhum equipamento é considerado reservado antes da confirmação da equipe.","outroEyebrow":"Como funciona","outroTitle":"Consulta rápida e transparente","outroDescription":"Informe qual equipamento deseja, o período estimado e a cidade da obra. A equipe retorna com as opções e condições disponíveis."}$content$::jsonb)
on conflict (key) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can view site media" on storage.objects;
create policy "public can view site media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-media');
drop policy if exists "admins can upload site media" on storage.objects;
create policy "admins can upload site media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and (select public.is_site_admin()));
drop policy if exists "admins can update site media" on storage.objects;
create policy "admins can update site media"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and (select public.is_site_admin()))
  with check (bucket_id = 'site-media' and (select public.is_site_admin()));
drop policy if exists "admins can delete site media" on storage.objects;
create policy "admins can delete site media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and (select public.is_site_admin()));
