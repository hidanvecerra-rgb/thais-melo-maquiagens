"use client";

import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="logo">
        Thais Melo <em>Maquiagens</em>
      </div>
      <div className="nav-links">
        <a href="#servicos">Serviços</a>
        <a href="#localizacao">Localização</a>
        <a href="#agendar" className="nav-cta">
          Agendar horário
        </a>
      </div>
      <button
        className="nav-burger"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={"nav-mobile" + (open ? " open" : "")}>
        <a href="#servicos" onClick={() => setOpen(false)}>
          Serviços
        </a>
        <a href="#localizacao" onClick={() => setOpen(false)}>
          Localização
        </a>
        <a href="#agendar" className="nav-cta" onClick={() => setOpen(false)}>
          Agendar horário
        </a>
      </div>
    </nav>
  );
}
