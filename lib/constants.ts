export type ServiceName = "Maquiagem social" | "Aula de automaquiagem";

export const SERVICES: {
  value: ServiceName;
  label: string;
  meta: string;
  tag: string;
  description: string;
  priceLabel: string;
  priceUnit: string;
}[] = [
  {
    value: "Maquiagem social",
    label: "Maquiagem social",
    meta: "Festas, formaturas e eventos",
    tag: "Social",
    description:
      "Produção completa para festas, formaturas, ensaios e eventos especiais, com pele impecável e acabamento duradouro.",
    priceLabel: "A partir de R$ 120",
    priceUnit: "/ atendimento",
  },
  {
    value: "Aula de automaquiagem",
    label: "Aula de automaquiagem",
    meta: "Aula individual, 2h",
    tag: "Aula individual",
    description:
      "Aula individual e prática para você aprender a se maquiar sozinha, com técnicas para o seu tipo de pele e rosto.",
    priceLabel: "A partir de R$ 150",
    priceUnit: "/ aula (2h)",
  },
];

export const SERVICE_PRICES: Record<ServiceName, number> = {
  "Maquiagem social": 120,
  "Aula de automaquiagem": 150,
};

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const WHATSAPP_NUMBER = "5534996731368";
export const PIX_KEY_DISPLAY = "(34) 99673-1368";
export const PIX_KEY_RAW = "34996731368";

export function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDateBR(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Retorna os 6 dias (segunda a sábado) da semana deslocada por "offset"
// semanas em relação à semana atual.
export function getWeekDates(offset: number): Date[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dow = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dow + 6) % 7) + offset * 7);
  const dates: Date[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}
