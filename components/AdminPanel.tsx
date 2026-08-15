"use client";

import { Fragment, useEffect, useState } from "react";
import {
  TIME_SLOTS,
  WEEKDAY_LABELS,
  buildWhatsAppLink,
  combineDateTime,
  formatBRL,
  formatDateBR,
  getWeekDates,
  toISODate,
} from "@/lib/constants";

const REMINDER_WINDOW_MS = 4 * 60 * 60 * 1000;

function reminderMessage(name: string, service: string, time: string) {
  const firstName = name.trim().split(" ")[0];
  return `Olá ${firstName}! Passando para lembrar do seu horário de ${service} hoje às ${time} com a Thais Melo Maquiagens 💕 Qualquer imprevisto, me avisa!`;
}
import type { Agendamento } from "@/lib/types";

type Tab = "week" | "list";

export default function AdminPanel() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [tab, setTab] = useState<Tab>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  async function loadAgendamentos() {
    setLoadingData(true);
    const res = await fetch("/api/admin/agendamentos", { cache: "no-store" });
    if (res.status === 401) {
      setAuthenticated(false);
      setLoadingData(false);
      return;
    }
    const json = await res.json();
    setAgendamentos(json.agendamentos ?? []);
    setAuthenticated(true);
    setLoadingData(false);
  }

  useEffect(() => {
    loadAgendamentos().finally(() => setAuthChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoggingIn(false);
    if (!res.ok) {
      setLoginError("Senha incorreta.");
      return;
    }
    setPassword("");
    await loadAgendamentos();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setAgendamentos([]);
  }

  async function cancelAgendamento(id: string) {
    const res = await fetch(`/api/admin/agendamentos/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setAgendamentos((list) =>
        list.map((a) => (a.id === id ? { ...a, status: "cancelado" } : a))
      );
    }
  }

  if (!authChecked) {
    return (
      <div className="admin-page">
        <div className="admin-panel">
          <p style={{ color: "var(--ink-soft)" }}>Carregando…</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="admin-page">
        <div className="admin-panel admin-login">
          <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>
            Área da maquiadora
          </h3>
          <p
            style={{
              color: "var(--ink-soft)",
              fontSize: "13.5px",
              marginBottom: "18px",
            }}
          >
            Entre com sua senha para ver sua agenda.
          </p>
          <form onSubmit={handleLogin}>
            <label htmlFor="adminPass">Senha</label>
            <input
              type="password"
              id="adminPass"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && (
              <div className="field-error show">{loginError}</div>
            )}
            <button
              type="submit"
              className="btn-next"
              style={{ marginTop: "18px", width: "100%" }}
              disabled={loggingIn}
            >
              {loggingIn ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const active = agendamentos.filter((a) => a.status !== "cancelado");
  const weekDates = getWeekDates(weekOffset);
  const todayISO = toISODate(new Date());
  const first = weekDates[0];
  const last = weekDates[5];
  const fmtShort = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

  const dayAppts = selectedDay
    ? active.filter((a) => a.date === selectedDay)
    : [];

  const upcoming = active
    .map((a) => ({ a, dt: combineDateTime(a.date, a.time) }))
    .filter(
      ({ dt }) =>
        dt.getTime() > now.getTime() &&
        dt.getTime() - now.getTime() <= REMINDER_WINDOW_MS
    )
    .sort((x, y) => x.dt.getTime() - y.dt.getTime());

  return (
    <div className="admin-page">
      <div className="admin-panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "4px",
          }}
        >
          <h3 style={{ fontSize: "20px" }}>Minha agenda</h3>
          <button className="btn-back" onClick={handleLogout}>
            Sair
          </button>
        </div>
        <p
          style={{
            color: "var(--ink-soft)",
            fontSize: "13.5px",
            marginBottom: "20px",
          }}
        >
          Horários vagos e preenchidos, com o estilo pedido por cliente.
        </p>

        {upcoming.length > 0 && (
          <div className="reminder-banner">
            <div className="reminder-title">
              🔔 Atendimento{upcoming.length > 1 ? "s" : ""} nas próximas 4
              horas — lembre a cliente
            </div>
            {upcoming.map(({ a }) => (
              <div className="reminder-item" key={a.id}>
                <div className="reminder-info">
                  <span className="reminder-name">{a.client_name}</span>
                  <span className="reminder-when">
                    hoje às {a.time} · {a.service}
                  </span>
                </div>
                <a
                  className="reminder-btn"
                  href={buildWhatsAppLink(
                    a.client_phone,
                    reminderMessage(a.client_name, a.service, a.time)
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Lembrar no WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={"admin-tab" + (tab === "week" ? " active" : "")}
            onClick={() => setTab("week")}
          >
            Agenda semanal
          </button>
          <button
            className={"admin-tab" + (tab === "list" ? " active" : "")}
            onClick={() => setTab("list")}
          >
            Lista completa
          </button>
        </div>

        {loadingData && (
          <p style={{ color: "var(--ink-soft)", fontSize: "13.5px" }}>
            Atualizando…
          </p>
        )}

        {tab === "week" && (
          <div>
            <div className="agenda-toolbar">
              <div className="week-nav">
                <button
                  onClick={() => {
                    setWeekOffset((w) => w - 1);
                    setSelectedDay(null);
                  }}
                  aria-label="Semana anterior"
                >
                  ‹
                </button>
                <span className="week-label">
                  {fmtShort(first)} – {fmtShort(last)}
                </span>
                <button
                  onClick={() => {
                    setWeekOffset((w) => w + 1);
                    setSelectedDay(null);
                  }}
                  aria-label="Próxima semana"
                >
                  ›
                </button>
              </div>
              <div className="agenda-legend">
                <span>
                  <i className="legend-dot vago"></i>Vago
                </span>
                <span>
                  <i className="legend-dot ocupado"></i>Ocupado
                </span>
              </div>
            </div>

            <div className="week-grid">
              <div className="head-cell"></div>
              {weekDates.map((d) => (
                <div className="head-cell" key={toISODate(d)}>
                  {WEEKDAY_LABELS[d.getDay()]}
                  <span className="daynum">{d.getDate()}</span>
                </div>
              ))}

              {TIME_SLOTS.map((hour) => (
                <Fragment key={hour}>
                  <div className="time-label">
                    {hour}
                  </div>
                  {weekDates.map((d) => {
                    const iso = toISODate(d);
                    const appt = active.find(
                      (a) => a.date === iso && a.time === hour
                    );
                    const isPast = iso < todayISO;
                    return (
                      <button
                        key={`${iso}-${hour}`}
                        className={
                          "slot-cell " +
                          (appt ? "ocupado" : "vago" + (isPast ? " past" : ""))
                        }
                        onClick={() => setSelectedDay(iso)}
                        title={appt ? appt.client_name : undefined}
                      >
                        {appt && (
                          <span className="slot-chip">
                            {appt.client_name.split(" ")[0]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>

            {selectedDay && (
              <div className="day-detail">
                <div className="day-detail-head">
                  <h4>
                    {(() => {
                      const [y, m, d] = selectedDay.split("-");
                      const dateObj = new Date(
                        parseInt(y),
                        parseInt(m) - 1,
                        parseInt(d)
                      );
                      return `${WEEKDAY_LABELS[dateObj.getDay()]}, ${d}/${m}/${y}`;
                    })()}
                  </h4>
                  <span className="day-count">
                    {dayAppts.length} de {TIME_SLOTS.length} horários
                    ocupados
                  </span>
                </div>
                {TIME_SLOTS.map((hour) => {
                  const appt = dayAppts.find((a) => a.time === hour);
                  return appt ? (
                    <div className="day-slot-row ocupado" key={hour}>
                      <span className="time">{hour}</span>
                      <span className="info">
                        <span className="cname">
                          {appt.client_name} — {appt.service}
                        </span>
                        <span className="cstyle">{appt.style_notes}</span>
                      </span>
                      <span className="status-tag ocupado">Ocupado</span>
                    </div>
                  ) : (
                    <div className="day-slot-row vago" key={hour}>
                      <span className="time">{hour}</span>
                      <span className="info">Sem agendamento</span>
                      <span className="status-tag vago">Vago</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "list" && (
          <div>
            {active.length === 0 ? (
              <div className="empty-state">Nenhum agendamento ainda.</div>
            ) : (
              [...active]
                .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
                .map((a) => (
                  <div className="appt-item" key={a.id}>
                    <div className="appt-top">
                      <span className="appt-name">{a.client_name}</span>
                      <span className="appt-when">
                        {formatDateBR(a.date)} · {a.time}
                      </span>
                    </div>
                    <div className="appt-detail">
                      <strong>Serviço:</strong> {a.service}
                    </div>
                    <div className="appt-detail">
                      <strong>WhatsApp:</strong> {a.client_phone}
                    </div>
                    <div className="appt-detail">
                      <strong>Sinal (50%):</strong>{" "}
                      {formatBRL(a.deposit_amount ?? 0)}
                    </div>
                    <div className="appt-detail">
                      <strong>Estilo desejado:</strong> {a.style_notes}
                    </div>
                    <div className="appt-actions">
                      <button
                        className="danger"
                        onClick={() => cancelAgendamento(a.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
