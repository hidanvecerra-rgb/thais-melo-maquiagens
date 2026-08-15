"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  TIME_SLOTS,
  WHATSAPP_NUMBER,
  PIX_KEY_DISPLAY,
  PIX_KEY_RAW,
  formatBRL,
  formatDateBR,
  formatDateLong,
  toISODate,
  type ServiceName,
} from "@/lib/constants";
import { SERVICES, SERVICE_PRICES } from "@/lib/siteConfig";
import { useBookingContext } from "@/components/BookingProvider";

const TOTAL_STEPS = 5;
const STEP_TITLES: Record<number, string> = {
  1: "Serviço",
  2: "Data e horário",
  3: "Seus dados",
  4: "Revisão",
  5: "Sinal",
};

type Errors = Partial<
  Record<"service" | "date" | "time" | "name" | "phone" | "style", string>
>;

export default function Booking() {
  const { selectedService } = useBookingContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [service, setService] = useState<ServiceName | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [takenTimes, setTakenTimes] = useState<string[]>([]);
  const [loadingTaken, setLoadingTaken] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [style, setStyle] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pixCopied, setPixCopied] = useState(false);
  const [waLink, setWaLink] = useState("");

  const today = useMemo(() => toISODate(new Date()), []);
  const depositAmount = service ? SERVICE_PRICES[service] / 2 : 0;

  // Sincroniza com o serviço escolhido na vitrine (Services), sem
  // sobrescrever se a cliente já estiver alterando a etapa 1 manualmente.
  useEffect(() => {
    if (selectedService && currentStep === 1) {
      setService(selectedService);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService]);

  useEffect(() => {
    if (!date) {
      setTakenTimes([]);
      return;
    }
    let cancelled = false;
    setLoadingTaken(true);
    supabaseBrowser
      .from("horarios_ocupados")
      .select("time")
      .eq("date", date)
      .then(({ data, error }) => {
        if (cancelled) return;
        setLoadingTaken(false);
        if (error) {
          console.error("Erro ao buscar horários ocupados", error);
          return;
        }
        setTakenTimes((data ?? []).map((row) => row.time as string));
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  function goToStep(n: number) {
    setCurrentStep(n);
  }

  function handleNextFromStep1() {
    if (!service) {
      setErrors((e) => ({ ...e, service: "Escolha um serviço para continuar." }));
      return;
    }
    setErrors((e) => ({ ...e, service: undefined }));
    goToStep(2);
  }

  function handleNextFromStep2() {
    const next: Errors = {};
    if (!date) next.date = "Escolha uma data.";
    if (!time) next.time = "Escolha um horário disponível.";
    setErrors((e) => ({ ...e, ...next, date: next.date, time: next.time }));
    if (next.date || next.time) return;
    goToStep(3);
  }

  function handleNextFromStep3() {
    const next: Errors = {};
    const trimmedName = name.trim();
    const trimmedStyle = style.trim();
    const digits = phone.replace(/\D/g, "");
    if (!trimmedName) next.name = "Digite seu nome.";
    if (digits.length < 10) next.phone = "Digite um número válido com DDD.";
    if (!trimmedStyle) next.style = "Conte um pouco sobre o estilo desejado.";
    setErrors((e) => ({
      ...e,
      name: next.name,
      phone: next.phone,
      style: next.style,
    }));
    if (next.name || next.phone || next.style) return;
    goToStep(4);
  }

  function selectTime(slot: string) {
    if (takenTimes.includes(slot)) return;
    setTime(slot);
    setErrors((e) => ({ ...e, time: undefined }));
  }

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY_RAW);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2500);
    } catch {
      setPixCopied(true);
    }
  }

  async function confirmBooking() {
    if (!service || !date || !time) return;
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabaseBrowser.from("agendamentos").insert({
      service,
      date,
      time,
      client_name: name.trim(),
      client_phone: phone.trim(),
      style_notes: style.trim(),
      deposit_amount: depositAmount,
      deposit_paid: false,
      status: "pendente",
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setSubmitError(
          "Esse horário acabou de ser reservado por outra pessoa. Volte e escolha outro horário."
        );
        setTakenTimes((t) => [...t, time]);
        setTime("");
      } else {
        console.error("Erro ao salvar agendamento", error);
        setSubmitError(
          "Não conseguimos concluir seu agendamento agora. Tente novamente ou fale conosco pelo WhatsApp."
        );
      }
      return;
    }

    const message =
      `Olá, Thais! Tudo bem?\n` +
      `Acabei de fazer um agendamento pelo site.\n\n` +
      `Nome: ${name.trim()}\n` +
      `Serviço: ${service}\n` +
      `Data: ${formatDateBR(date)}\n` +
      `Horário: ${time}\n\n` +
      `Sinal de 50% (${formatBRL(depositAmount)}) pago via Pix — segue o comprovante em anexo.\n` +
      `Gostaria de confirmar meu horário!`;
    setWaLink(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
    goToStep(6);
  }

  function resetForm() {
    setService("");
    setDate("");
    setTime("");
    setName("");
    setPhone("");
    setStyle("");
    setErrors({});
    setSubmitError(null);
    setWaLink("");
    goToStep(1);
  }

  const progressPct = Math.min(currentStep, TOTAL_STEPS) / TOTAL_STEPS * 100;

  return (
    <section className="booking" id="agendar">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Reserve seu horário</span>
          <h2>Escolha seu horário</h2>
          <p>É rápido — você recebe a confirmação em instantes.</p>
        </div>

        <div className="booking-card">
          {currentStep <= TOTAL_STEPS && (
            <div className="booking-progress">
              <div className="booking-progress-label">
                Etapa {currentStep} de {TOTAL_STEPS} · {STEP_TITLES[currentStep]}
              </div>
              <div
                className="booking-progress-bar"
                role="progressbar"
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
              >
                <div
                  className="booking-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="form-step">
              <label>Qual serviço você deseja?</label>
              <div className="service-options">
                {SERVICES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={
                      "service-opt" + (service === s.value ? " selected" : "")
                    }
                    aria-pressed={service === s.value}
                    onClick={() => {
                      setService(s.value);
                      setErrors((e) => ({ ...e, service: undefined }));
                    }}
                  >
                    <div className="name">{s.label}</div>
                    <div className="meta">{formatBRL(s.priceFrom)} · {s.durationLabel}</div>
                  </button>
                ))}
              </div>
              {errors.service && (
                <div className="field-error show" role="alert">
                  {errors.service}
                </div>
              )}
              <div className="step-nav" style={{ justifyContent: "flex-end" }}>
                <button className="btn-next" onClick={handleNextFromStep1}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <label htmlFor="date">Escolha a data</label>
              <input
                type="date"
                id="date"
                min={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                  setErrors((err) => ({ ...err, date: undefined }));
                }}
              />
              {errors.date && (
                <div className="field-error show" role="alert">
                  {errors.date}
                </div>
              )}

              <label>Escolha o horário</label>
              <div className="time-grid">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={
                      "time-slot" +
                      (time === slot ? " selected" : "") +
                      (takenTimes.includes(slot) ? " taken" : "")
                    }
                    disabled={takenTimes.includes(slot)}
                    aria-pressed={time === slot}
                    aria-label={
                      takenTimes.includes(slot)
                        ? `${slot} — indisponível`
                        : time === slot
                          ? `${slot} — selecionado`
                          : `${slot} — disponível`
                    }
                    onClick={() => selectTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {loadingTaken && (
                <p className="field-hint">Verificando horários disponíveis…</p>
              )}
              {errors.time && (
                <div className="field-error show" role="alert">
                  {errors.time}
                </div>
              )}

              <div className="step-nav">
                <button className="btn-back" onClick={() => goToStep(1)}>
                  Voltar
                </button>
                <button className="btn-next" onClick={handleNextFromStep2}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <label htmlFor="name">Seu nome</label>
              <input
                type="text"
                id="name"
                placeholder="Nome completo"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((err) => ({ ...err, name: undefined }));
                }}
              />
              {errors.name && (
                <div className="field-error show" role="alert">
                  {errors.name}
                </div>
              )}

              <label htmlFor="phone">Seu WhatsApp</label>
              <input
                type="tel"
                id="phone"
                placeholder="(34) 99999-9999"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((err) => ({ ...err, phone: undefined }));
                }}
              />
              {errors.phone && (
                <div className="field-error show" role="alert">
                  {errors.phone}
                </div>
              )}

              <label htmlFor="style">
                Conte como você imagina sua maquiagem
              </label>
              <textarea
                id="style"
                placeholder="Ex: maquiagem para casamento à tarde, quero algo natural com um toque de brilho nos olhos, pele com efeito glow..."
                value={style}
                onChange={(e) => {
                  setStyle(e.target.value);
                  setErrors((err) => ({ ...err, style: undefined }));
                }}
              />
              {errors.style && (
                <div className="field-error show" role="alert">
                  {errors.style}
                </div>
              )}

              <p className="consent-note">
                Ao continuar, você concorda com o uso dos dados informados
                para gerenciamento e confirmação do seu agendamento.
              </p>

              <div className="step-nav">
                <button className="btn-back" onClick={() => goToStep(2)}>
                  Voltar
                </button>
                <button className="btn-next" onClick={handleNextFromStep3}>
                  Revisar pedido
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-step">
              <div>
                <div className="summary-row">
                  <span className="label">Serviço</span>
                  <span className="val">{service}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Data</span>
                  <span className="val">{formatDateLong(date)}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Horário</span>
                  <span className="val">{time}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Nome</span>
                  <span className="val">{name}</span>
                </div>
                <div className="summary-row">
                  <span className="label">WhatsApp</span>
                  <span className="val">{phone}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Valor</span>
                  <span className="val">
                    {formatBRL(service ? SERVICE_PRICES[service] : 0)}
                  </span>
                </div>
              </div>
              <div className="step-nav">
                <button className="btn-back" onClick={() => goToStep(3)}>
                  Voltar e editar
                </button>
                <button className="btn-next" onClick={() => goToStep(5)}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="form-step">
              <div className="deposit-alert">
                <div className="deposit-alert-title">
                  Sinal necessário para confirmar
                </div>
                <p>
                  Para garantir seu horário, é necessário pagar um sinal de
                  50% do valor do serviço via Pix. O restante é pago no dia do
                  atendimento.
                </p>
              </div>

              <div className="deposit-values">
                <div className="deposit-row">
                  <span className="label">Valor do serviço</span>
                  <span className="val">
                    {formatBRL(service ? SERVICE_PRICES[service] : 0)}
                  </span>
                </div>
                <div className="deposit-row highlight">
                  <span className="label">Sinal a pagar agora (50%)</span>
                  <span className="val">{formatBRL(depositAmount)}</span>
                </div>
              </div>

              <label htmlFor="pix-key">Chave Pix (celular)</label>
              <div className="pix-box" id="pix-key">
                <span>{PIX_KEY_DISPLAY}</span>
                <button type="button" className="pix-copy" onClick={copyPix}>
                  Copiar
                </button>
              </div>
              {pixCopied && (
                <div className="field-error show" style={{ color: "var(--accent)" }}>
                  Chave copiada!
                </div>
              )}

              <p className="deposit-note">
                Depois de pagar, toque em &quot;Já paguei, confirmar
                agendamento&quot; e envie o comprovante junto com a mensagem
                do WhatsApp — assim seu horário fica garantido.
              </p>

              {submitError && (
                <div className="state-banner error" role="alert">
                  {submitError}
                </div>
              )}

              <div className="step-nav">
                <button className="btn-back" onClick={() => goToStep(4)}>
                  Voltar
                </button>
                <button
                  className="btn-next"
                  onClick={confirmBooking}
                  disabled={submitting}
                >
                  {submitting ? "Confirmando…" : "Já paguei, confirmar agendamento"}
                </button>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="form-step">
              <div className="confirm-box">
                <div className="confirm-icon">🤍</div>
                <h3 style={{ fontSize: "22px" }}>Seu horário foi solicitado</h3>
                <p
                  style={{
                    color: "var(--muted)",
                    marginTop: "8px",
                    fontSize: "14.5px",
                  }}
                >
                  Agora falta apenas confirmar os detalhes com a Thais pelo
                  WhatsApp, junto com o comprovante do Pix.
                </p>

                <div className="confirm-summary">
                  <div className="summary-row">
                    <span className="label">Serviço</span>
                    <span className="val">{service}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Data</span>
                    <span className="val">{formatDateLong(date)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Horário</span>
                    <span className="val">{time}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Nome</span>
                    <span className="val">{name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Telefone</span>
                    <span className="val">{phone}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Sinal (50%)</span>
                    <span className="val">{formatBRL(depositAmount)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Status</span>
                    <span className="val">Pendente de confirmação</span>
                  </div>
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-btn"
                >
                  Confirmar pelo WhatsApp
                </a>
                <div style={{ marginTop: "18px" }}>
                  <button className="btn-back" onClick={resetForm}>
                    Agendar outro horário
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
