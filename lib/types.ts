export type AgendamentoStatus = "pendente" | "confirmado" | "cancelado";

export interface Agendamento {
  id: string;
  created_at: string;
  service: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
  style_notes: string | null;
  deposit_amount: number | null;
  deposit_paid: boolean;
  status: AgendamentoStatus;
}
