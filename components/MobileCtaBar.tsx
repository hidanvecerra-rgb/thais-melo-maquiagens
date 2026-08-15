"use client";

import { useEffect, useState } from "react";

// Barra fixa só no mobile, aparece depois que a cliente sai da
// primeira tela (hero) — CSS já esconde isso em telas >= 900px.
export default function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={"mobile-cta-bar" + (visible ? " visible" : "")} aria-hidden={!visible}>
      <a href="#agendar" className="btn btn-primary" tabIndex={visible ? 0 : -1}>
        Agendar horário
      </a>
    </div>
  );
}
