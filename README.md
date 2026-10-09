# Minas Fer & Minas Gerais

Site institucional em Next.js para materiais de serralheria e tornearia, locação de equipamentos e captação de orçamentos. O painel administrativo em `/admin` usa Supabase Auth, Postgres e Storage.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>.

## Configurar o Supabase

1. Crie um projeto Supabase e copie `.env.example` para `.env.local`.
2. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os valores de **Project URL** e **anon/public key** nas configurações de API do projeto.
3. No **SQL Editor**, execute os arquivos `supabase/migrations/001_initial.sql` e `supabase/migrations/002_admin_cms.sql`, nessa ordem. A segunda migration cria as tabelas do catálogo e do conteúdo, ativa as políticas RLS, cria o bucket público `site-media` e insere os dados iniciais usados como referência.
4. No painel Supabase, crie o usuário administrador em **Authentication → Users**. Depois, no SQL Editor, associe o usuário ao papel de administrador, substituindo o e-mail:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'admin@minhaempresa.com'
   on conflict (user_id) do nothing;
   ```

5. Entre em `/admin` com o e-mail e a senha desse usuário. A autenticação é feita pelo Supabase; as tabelas e o Storage aceitam alterações somente de usuários cadastrados em `admin_users`.
6. Para salvar solicitações de orçamento no banco, configure também `SUPABASE_URL` com o Project URL e `SUPABASE_SERVICE_ROLE_KEY` com a service role key. Essa chave é somente de servidor: não a use em variáveis `NEXT_PUBLIC_*` e não a envie ao Git.
7. Preencha `NEXT_PUBLIC_WHATSAPP_NUMBER` com o número oficial, apenas dígitos com DDI e DDD, se quiser configurar o encaminhamento inicial para WhatsApp.

O site público lê produtos, categorias, equipamentos e textos do Supabase e mantém conteúdo de referência quando as chaves públicas ainda não estão configuradas. Para ativar o painel, a migration e as duas variáveis públicas do Supabase são necessárias. Sem a service role key, o formulário continua preparando o atendimento pelo WhatsApp, mas não afirma que gravou a solicitação.

## Publicação na Netlify

Configure as mesmas variáveis de ambiente nas configurações do site Netlify e faça uma nova publicação. As variáveis públicas são necessárias para leitura do conteúdo e login do admin; `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são necessárias apenas para persistir orçamentos recebidos pelo formulário.

## O que o painel gerencia

- Produtos, categorias e equipamentos, incluindo preço exibido, imagens, publicação, ordem e destaque.
- Textos e imagens das páginas inicial, catálogo, sobre, serviços, locação, contato e privacidade.
- Nome da marca, logotipo, telefone, endereço, Instagram, mapa e WhatsApp.
- Solicitações de orçamento, com atualização de status e resposta pelo WhatsApp.

As imagens enviadas pelo painel ficam no bucket `site-media`; também é possível usar caminhos locais do projeto ou URLs HTTPS.
