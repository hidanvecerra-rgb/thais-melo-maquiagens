"use client";

import { useCallback, useEffect, useState } from "react";
import PlaceholderImage from "@/components/PlaceholderImage";
import Reveal from "@/components/Reveal";
import { IMAGE_PLACEHOLDERS } from "@/lib/siteConfig";

const photos = IMAGE_PLACEHOLDERS.portfolio;

export default function Portfolio() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    []
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    []
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, prev, next]);

  return (
    <section id="portfolio">
      <div className="container">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">Portfólio</span>
          <h2>Beleza que valoriza quem você é</h2>
          <p>
            Cada produção é criada respeitando seus traços, sua
            personalidade e o momento que você deseja viver.
          </p>
        </Reveal>

        <div className="portfolio-grid">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              className="portfolio-item"
              onClick={() => setOpenIndex(i)}
              aria-label={`Abrir fotografia ${i + 1} em tela cheia`}
            >
              <PlaceholderImage path={photo.src} label={photo.alt} />
            </button>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização da fotografia"
          onClick={close}
        >
          <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
            <PlaceholderImage
              path={photos[openIndex].src}
              label={photos[openIndex].alt}
              variant="portrait"
            />
            <button
              type="button"
              className="lightbox-close"
              onClick={close}
              aria-label="Fechar"
              autoFocus
            >
              ✕
            </button>
            <button
              type="button"
              className="lightbox-nav prev"
              onClick={prev}
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="lightbox-nav next"
              onClick={next}
              aria-label="Próxima foto"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
