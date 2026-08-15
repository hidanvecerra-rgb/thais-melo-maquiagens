"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  SERVICES,
  SERVICE_PRICES,
  TIME_SLOTS,
  WHATSAPP_NUMBER,
  PIX_KEY_DISPLAY,
  PIX_KEY_RAW,
  formatBRL,
  formatDateBR,
  toISODate,
  type ServiceName,
} from "@/lib/constants";

const STEP_LABELS = [
  { step: 1, label: "Serviço" },
  { step: 2, label: "Data e hora" },
  { step: 3, label: "Seus dados" },
  { step: 4, label: "Revisão" },
  { step: 5, label: "Sinal" },
];

type Errors = Partial<
  Record<"service" | "date" | "time" | "name" | "phone" | "style", string>
>;

export default function BookingExperience() {
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
  const bookingSectionRef = useRef<HTMLElement>(null);

  const today = useMemo(() => toISODate(new Date()), []);
  const depositAmount = service ? SERVICE_PRICES[service] / 2 : 0;

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

  function quickSelectService(value: ServiceName) {
    setService(value);
    setErrors((e) => ({ ...e, service: undefined }));
    setCurrentStep(1);
    bookingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

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
          "Não foi possível confirmar seu agendamento agora. Tente novamente em instantes."
        );
      }
      return;
    }

    const message =
      `Olá Thais! Gostaria de confirmar meu agendamento:\n\n` +
      `*Serviço:* ${service}\n` +
      `*Data:* ${formatDateBR(date)}\n` +
      `*Horário:* ${time}\n` +
      `*Nome:* ${name.trim()}\n` +
      `*Estilo desejado:* ${style.trim()}\n\n` +
      `*Sinal de 50% (${formatBRL(depositAmount)}) pago via Pix — segue o comprovante em anexo.*`;
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

  return (
    <>
      <section className="services" id="servicos">
        <div className="section-head">
          <span className="eyebrow">O que eu faço</span>
          <h2>Serviços</h2>
          <p>
            Escolha entre uma produção para o seu evento ou uma aula pensada
            para o seu dia a dia.
          </p>
        </div>
        <div className="service-grid">
          {SERVICES.map((s) => (
            <div className="service-card" key={s.value}>
              <span className="tag">{s.tag}</span>
              <h3>{s.label}</h3>
              <p>{s.description}</p>
              <div className="price">
                {s.priceLabel} <span>{s.priceUnit}</span>
              </div>
              <button
                className="service-pick"
                onClick={() => quickSelectService(s.value)}
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="booking" id="agendar" ref={bookingSectionRef}>
        <div className="section-head">
          <span className="eyebrow">Reserve seu horário</span>
          <h2>Agendar horário</h2>
          <p>
            Preencha os dados abaixo — é rápido e você recebe a confirmação na
            hora.
          </p>
        </div>

        <div className="booking-card">
          {currentStep <= 5 && (
            <div className="steps">
              {STEP_LABELS.map((s) => (
                <div
                  key={s.step}
                  className={
                    "step" +
                    (s.step === currentStep ? " active" : "") +
                    (s.step < currentStep ? " done" : "")
                  }
                >
                  {s.label}
                </div>
              ))}
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
                    onClick={() => {
                      setService(s.value);
                      setErrors((e) => ({ ...e, service: undefined }));
                    }}
                  >
                    <div className="name">{s.label}</div>
                    <div className="meta">{s.meta}</div>
                  </button>
                ))}
              </div>
              {errors.service && (
                <div className="field-error show">{errors.service}</div>
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
                <div className="field-error show">{errors.date}</div>
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
                    onClick={() => selectTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {loadingTaken && (
                <p style={{ fontSize: "12.5px", color: "var(--ink-soft)", marginTop: "6px" }}>
                  Verificando horários disponíveis…
                </p>
              )}
              {errors.time && (
                <div className="field-error show">{errors.time}</div>
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
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((err) => ({ ...err, name: undefined }));
                }}
              />
              {errors.name && (
                <div className="field-error show">{errors.name}</div>
              )}

              <label htmlFor="phone">Seu WhatsApp</label>
              <input
                type="tel"
                id="phone"
                placeholder="(34) 99999-9999"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((err) => ({ ...err, phone: undefined }));
                }}
              />
              {errors.phone && (
                <div className="field-error show">{errors.phone}</div>
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
                <div className="field-error show">{errors.style}</div>
              )}

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
                  <span className="val">{formatDateBR(date)}</span>
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
                  <span className="label">Estilo desejado</span>
                  <span className="val">{style}</span>
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

              <label>Chave Pix (celular)</label>
              <div className="pix-box">
                <span>{PIX_KEY_DISPLAY}</span>
                <button type="button" className="pix-copy" onClick={copyPix}>
                  Copiar
                </button>
              </div>
              {pixCopied && (
                <div
                  className="field-error show"
                  style={{ color: "var(--butter-700)" }}
                >
                  Chave copiada!
                </div>
              )}

              <p className="deposit-note">
                Depois de pagar, toque em &quot;Já paguei, confirmar
                agendamento&quot; e envie o comprovante junto com a mensagem
                do WhatsApp — assim seu horário fica garantido.
              </p>

              {submitError && (
                <div className="field-error show">{submitError}</div>
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
                <div className="confirm-icon">✓</div>
                <h3 style={{ fontSize: "20px" }}>Horário reservado!</h3>
                <p
                  style={{
                    color: "var(--ink-soft)",
                    marginTop: "8px",
                    fontSize: "14.5px",
                  }}
                >
                  Toque no botão abaixo para confirmar seu agendamento pelo
                  WhatsApp e enviar o comprovante do sinal. A Thais vai
                  receber todos os detalhes automaticamente.
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-btn"
                >
                  Confirmar no WhatsApp
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
      </section>
    </>
  );
}
