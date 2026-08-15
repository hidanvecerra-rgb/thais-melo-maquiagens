# Thais Melo Maquiagens — site + agendamento

Site Next.js (App Router) conectado ao Supabase, recriado a partir do
protótipo `prototipo-referencia.html` e da especificação em
`especificacao-do-site.md`.

## Configuração

1. Rode o `supabase-schema.sql` no SQL Editor do seu projeto Supabase
   (se ainda não fez isso).
2. Copie `.env.local.example` para `.env.local` e preencha:
   - `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` — em
     Project Settings > API.
   - `SUPABASE_SERVICE_ROLE_KEY` — mesma página, chave secreta (só é
     usada nas rotas de API do servidor, nunca no navegador).
   - `ADMIN_PASSWORD` — a senha que a Thais vai usar para entrar em
     `/painel`.
   - `ADMIN_SESSION_SECRET` — qualquer texto aleatório longo (usado só
     para assinar o cookie de sessão do painel).
3. Instale as dependências e rode localmente:

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Estrutura

- `app/page.tsx` — site público (hero, serviços, agendamento, localização)
- `app/painel/page.tsx` — painel da maquiadora (protegido por senha)
- `app/api/admin/**` — rotas de servidor que usam a `service_role key`
- `lib/supabase/client.ts` — cliente do navegador (chave anônima)
- `lib/supabase/admin.ts` — cliente do servidor (chave secreta, nunca
  importado por componentes de cliente)

## Deploy (Vercel)

1. Suba este projeto para um repositório Git (GitHub, por exemplo).
2. Em [vercel.com](https://vercel.com), importe o repositório.
3. Configure as mesmas variáveis de ambiente do `.env.local` no painel
   da Vercel (Settings > Environment Variables).
4. Deploy. A Vercel vai gerar um link do tipo `thaismelo.vercel.app`.
