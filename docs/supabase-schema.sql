-- ============================================================
-- Thais Melo Maquiagens — esquema do banco de dados (Supabase)
-- ============================================================
-- Como usar: no painel do Supabase, vá em "SQL Editor" > "New query",
-- cole todo este arquivo e clique em "Run". Isso cria a tabela de
-- agendamentos e as regras de acesso.

create table if not exists agendamentos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  service text not null,
  date date not null,
  time text not null,
  client_name text not null,
  client_phone text not null,
  style_notes text,
  deposit_amount numeric(10,2),
  deposit_paid boolean default false,
  status text default 'pendente' -- pendente | confirmado | cancelado
);

-- Evita dois agendamentos no mesmo dia e horário
create unique index if not exists agendamentos_data_hora_unica
  on agendamentos (date, time)
  where status != 'cancelado';

-- Segurança em nível de linha (RLS)
alter table agendamentos enable row level security;

-- Qualquer pessoa pode criar um agendamento (é o formulário público do site)
create policy "clientes podem agendar"
  on agendamentos for insert
  to anon
  with check (true);

-- Qualquer pessoa pode ver os horários já ocupados (para não sobrepor agendamentos)
-- Isso expõe apenas date/time publicamente através de uma view separada — ver abaixo.
create policy "leitura publica restrita"
  on agendamentos for select
  to anon
  using (false); -- bloqueado por padrão; a maquiadora usa uma chave separada (service_role) no painel admin

-- View pública que mostra SOMENTE data/horário ocupado, sem dados da cliente
-- Usada na tela de agendamento para marcar horários já preenchidos
create or replace view horarios_ocupados as
  select date, time
  from agendamentos
  where status != 'cancelado';

grant select on horarios_ocupados to anon;

-- ============================================================
-- Observação sobre o painel da maquiadora:
-- O painel usa a "service_role key" do Supabase (nunca exposta no
-- site público) para ler todos os dados dos agendamentos, incluindo
-- nome, telefone e estilo desejado. Essa chave fica apenas no back-end
-- (rota de API protegida por senha), nunca no código que roda no
-- navegador da cliente.
-- ============================================================
