# Guia — Colocando o site da Thais Melo Maquiagens no ar de verdade

Este guia explica como transformar o protótipo em um site real, publicado,
com banco de dados de verdade (Supabase) que funciona igual em qualquer
celular ou computador — cliente agenda, e a Thais vê na hora, de qualquer
lugar.

Você não precisa saber programar para seguir os passos de 1 a 4. O passo 5
é o único que envolve código, e é exatamente para isso que serve o
Claude Code.

---

## Passo 1 — Criar a conta no Supabase (gratuito)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
   (pode entrar com o Google).
2. Clique em **New project**.
3. Dê um nome, por exemplo `thais-melo-maquiagens`.
4. Escolha uma senha forte para o banco de dados e **guarde ela** — vai
   precisar depois.
5. Escolha a região mais próxima do Brasil (geralmente `South America
   (São Paulo)`).
6. Aguarde cerca de 2 minutos até o projeto ficar pronto.

## Passo 2 — Criar a tabela de agendamentos

1. Dentro do seu projeto no Supabase, no menu lateral, clique em
   **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo `supabase-schema.sql` (incluído neste pacote), copie
   todo o conteúdo e cole no editor.
4. Clique em **Run**. Isso cria a tabela `agendamentos` com todas as
   proteções de segurança já configuradas.

## Passo 3 — Pegar as chaves de acesso

1. No menu lateral, vá em **Project Settings** (ícone de engrenagem) >
   **API**.
2. Você vai precisar de três informações — copie e guarde em um lugar
   seguro:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (chave pública, pode ficar no site)
   - **service_role key** (chave secreta — NUNCA compartilhe ou coloque
     no código visível do navegador; só é usada no painel administrativo
     protegido por senha)

## Passo 4 — Escolher onde hospedar o site

Recomendo a **Vercel** (gratuita para esse volume de uso):

1. Acesse [vercel.com](https://vercel.com) e crie uma conta (pode ser com
   GitHub).
2. Quando o projeto de código estiver pronto (próximo passo), a Vercel
   vai te dar um link tipo `thaismelo.vercel.app`. Depois, se quiser,
   dá pra conectar um domínio próprio como `thaismelo.com.br`
   (comprado separadamente, por ~R$40/ano em registro.br).

## Passo 5 — Construir e publicar o projeto com o Claude Code

Este é o passo técnico. Abra o **Claude Code** (aplicativo de desktop ou
terminal) na pasta deste projeto e peça algo como:

> "Quero transformar este protótipo em um site Next.js conectado ao
> Supabase. Aqui estão minhas chaves: [cole Project URL e anon key].
> Ajuda a configurar o projeto, testar localmente e publicar na Vercel."

O Claude Code vai conseguir:
- Criar o projeto Next.js com a estrutura de páginas
- Conectar ao Supabase usando as chaves que você fornecer
- Recriar o design (burgundy/butter, fluxo de agendamento em etapas,
  aviso do sinal de 50% com Pix, painel semanal da maquiadora)
- Testar tudo localmente antes de publicar
- Fazer o deploy na Vercel, te dando o link final

**Importante sobre segurança:** ao conversar com o Claude Code, nunca
cole a **service_role key** em um arquivo que vai para o navegador do
cliente (arquivos dentro de `app/` ou `components/` que rodam no
front-end). Ela deve ficar apenas em variáveis de ambiente do servidor
(arquivo `.env.local`, que não é enviado ao público). Se tiver dúvida
nessa hora, pergunte ao Claude Code diretamente — ele te orienta.

---

## O que já está pronto neste pacote

- `supabase-schema.sql` — estrutura do banco de dados, pronta para rodar
- `especificacao-do-site.md` — todas as telas, textos, cores e regras de
  negócio do site atual, para o Claude Code (ou qualquer desenvolvedor)
  usar como referência exata do que construir
- Este guia

## Depois de publicado

Quando o site estiver no ar, a rotina passa a ser:
1. Cliente acessa o link (ex: `thaismelo.vercel.app`), agenda o horário
2. O agendamento é salvo direto no Supabase — a Thais vê instantaneamente
   no painel dela, de qualquer dispositivo
3. A cliente confirma via WhatsApp com o botão que já existe no fluxo

Se no futuro quiser automatizar o envio da mensagem de WhatsApp (sem a
cliente precisar tocar em enviar) ou adicionar cobrança automática via
Pix, isso é um passo seguinte que exige integrações pagas (API do
WhatsApp Business, gateway de pagamento) — posso te explicar as opções
quando chegar a hora.
