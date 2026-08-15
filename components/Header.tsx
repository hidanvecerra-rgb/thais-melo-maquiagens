"use client";

import { useEffect, useState } from "react";
import { BRAND, NAV_LINKS } from "@/lib/siteConfig";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")}>
      <div className="container site-header-inner">
        <a href="#inicio" className="brand">
          <span className="brand-name">{BRAND.name.toUpperCase()}</span>
          <span className="brand-tagline">{BRAND.tagline}</span>
        </a>

        <nav className="site-nav" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a href="#agendar" className="btn btn-primary header-cta">
            Agendar horário
          </a>
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
        </div>

        <div className={"nav-mobile" + (open ? " open" : "")}>
          <div className="nav-mobile-inner">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href="#agendar" className="btn btn-primary" onClick={() => setOpen(false)}>
              Agendar horário
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
