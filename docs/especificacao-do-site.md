# Especificação — Site Thais Melo Maquiagens

Referência completa do site para reconstrução com Next.js + Supabase.
O protótipo original (HTML/CSS/JS estático) está incluído como
`prototipo-referencia.html` — use-o como fonte visual exata (cores,
fontes, textos, espaçamentos). Este documento descreve a lógica de
negócio e a estrutura de dados que o protótipo simula localmente e que
agora deve vir do Supabase.

## Identidade visual

- **Fontes**: Playfair Display (títulos, serifada) + Inter (corpo, sans)
- **Cores**:
  - Fundo principal: `#FCEFDA` (butter claro)
  - Destaque quente: `#F6D9A6` (butter médio)
  - Acento principal / botões: `#7A2F45` (burgundy)
  - Texto forte / cabeçalhos: `#3E1420` (burgundy escuro)
  - Detalhe frio raro: `#9CCBD6` (cerulean, usado só em hover de horário)
- **Tom**: elegante, editorial, caloroso — não deve parecer um painel de
  software genérico

## Páginas / seções públicas

1. **Hero** — nome da marca, frase de efeito, botão "Agendar horário"
2. **Serviços** — dois cartões: Maquiagem social (R$ 120) e Aula de
   automaquiagem (R$ 150)
3. **Agendamento** (fluxo em 6 etapas, ver abaixo)
4. **Localização** — endereço genérico (detalhe completo só é enviado
   na confirmação), telefone, horário de atendimento (terça a sábado,
   9h–19h)

## Fluxo de agendamento (etapas)

1. **Serviço** — cliente escolhe entre os dois serviços
2. **Data e hora** — seletor de data (não permite datas passadas) +
   grade de horários disponíveis (09:00, 10:00, 11:00, 13:00, 14:00,
   15:00, 16:00, 17:00). Horários já ocupados naquela data aparecem
   desabilitados/riscados
3. **Seus dados** — nome completo, WhatsApp, e um campo de texto livre
   descrevendo o estilo de maquiagem desejado
4. **Revisão** — resumo de tudo antes de confirmar
5. **Sinal (50%)** — mostra o valor total do serviço e o valor do sinal
   (metade), chave Pix (celular: `34996731368`) com botão de copiar, e
   aviso de que o sinal é necessário para garantir o horário
6. **Confirmação** — mensagem de sucesso + botão que abre o WhatsApp
   (`wa.me/5534996731368`) com uma mensagem pré-formatada contendo
   serviço, data, hora, nome, estilo desejado e valor do sinal, para a
   cliente enviar junto com o comprovante do Pix

### Validações obrigatórias
- Nome: não pode estar vazio
- WhatsApp: mínimo de 10 dígitos numéricos
- Estilo desejado: não pode estar vazio
- Data + hora: não pode reservar um horário já ocupado (o banco de
  dados tem uma constraint única em `date + time` para garantir isso
  mesmo se duas pessoas tentarem ao mesmo tempo)

## Painel da maquiadora (rota protegida, ex: `/painel`)

Protegido por senha simples (recomendo evoluir para autenticação real
do Supabase — email/senha — assim que possível, em vez de uma senha
fixa no código).

### Aba "Agenda semanal"
- Grade com 6 dias (segunda a sábado) nas colunas, horários nas linhas
- Navegação entre semanas (anterior/próxima)
- Célula vaga: em branco. Célula ocupada: preenchida em burgundy, com o
  primeiro nome da cliente visível
- Clicar em qualquer célula do dia abre o **detalhe daquele dia** abaixo
  da grade: lista de todos os horários daquele dia, mostrando para cada
  um se está vago ou quem agendou + o estilo de maquiagem pedido

### Aba "Lista completa"
- Lista de todos os agendamentos, ordenada por data/hora
- Mostra nome, WhatsApp, serviço, valor do sinal esperado, estilo
  desejado
- Botão para remover/cancelar um agendamento

## Estrutura de dados (tabela `agendamentos` no Supabase)

Ver `supabase-schema.sql` para a definição exata. Campos principais:
`service`, `date`, `time`, `client_name`, `client_phone`, `style_notes`,
`deposit_amount`, `deposit_paid`, `status`.

## Regras de negócio a preservar

- O valor do sinal é sempre 50% do preço do serviço selecionado
- Preços atuais: Maquiagem social = R$ 120, Aula de automaquiagem = R$ 150
  (idealmente, tornar esses preços editáveis pela própria Thais no
  painel no futuro, em vez de fixos no código)
- Nenhum pagamento é processado automaticamente — é um fluxo de
  confiança: cliente paga via Pix por fora, envia comprovante pelo
  WhatsApp, e a Thais confirma manualmente
- O painel administrativo nunca deve expor a chave `service_role` do
  Supabase no navegador — todas as consultas que exigem essa chave
  (leitura completa dos agendamentos com dados da cliente) devem passar
  por uma rota de API no servidor (`app/api/...` no Next.js), nunca
  diretamente do componente React no cliente
