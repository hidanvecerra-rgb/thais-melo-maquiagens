"use client";

import Reveal from "@/components/Reveal";
import { useBookingContext } from "@/components/BookingProvider";
import { formatBRL } from "@/lib/constants";
import { SERVICES } from "@/lib/siteConfig";

export default function Services() {
  const { selectService } = useBookingContext();

  function handleSelect(value: (typeof SERVICES)[number]["value"]) {
    selectService(value);
    document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="servicos">
      <div className="container">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">Serviços</span>
          <h2>Escolha a experiência ideal para você</h2>
        </Reveal>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <Reveal as="div" key={s.value} delay={i * 80}>
              <article className="service-card-lg">
                <span className="tag">{s.tag}</span>
                <h3>{s.label}</h3>
                <p className="suitable">{s.suitableFor.join(" • ")}</p>
                <p className="desc">{s.description}</p>
                <ul className="includes">
                  {s.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="price-row">
                  <div className="price">
                    {formatBRL(s.priceFrom)}
                    <span>a partir de</span>
                  </div>
                  <div className="duration">{s.durationLabel}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSelect(s.value)}
                >
                  {s.ctaLabel}
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
