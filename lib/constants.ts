// Helpers técnicos (datas, formatação, links). Dados comerciais e de
// conteúdo (nome, telefone, serviços, preços, FAQ...) vivem em
// lib/siteConfig.ts — não duplicar aqui.
import { BRAND, SERVICES, SERVICE_PRICES, type ServiceConfig } from "./siteConfig";

export type ServiceName = ServiceConfig["value"];

export { SERVICES, SERVICE_PRICES };

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

export const WHATSAPP_NUMBER = BRAND.whatsappNumber;
export const PIX_KEY_DISPLAY = BRAND.pixKeyDisplay;
export const PIX_KEY_RAW = BRAND.pixKeyRaw;

export function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDateBR(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const MONTHS_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

// "22 de agosto" — usado no resumo do agendamento.
export function formatDateLong(iso: string): string {
  if (!iso) return "";
  const [, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTHS_PT[m - 1]}`;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Combina date (YYYY-MM-DD) + time (HH:MM) em um Date local.
export function combineDateTime(date: string, time: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m - 1, d, h, min);
}

// Normaliza um telefone brasileiro digitado livremente (com DDD) para o
// formato exigido pelo wa.me (com código do país 55).
export function normalizeBrazilPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  return `55${digits}`;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${normalizeBrazilPhone(phone)}?text=${encodeURIComponent(message)}`;
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
