import Reveal from "@/components/Reveal";
import { TESTIMONIALS } from "@/lib/siteConfig";

export default function Testimonials() {
  return (
    <section id="depoimentos" style={{ background: "var(--surface)" }}>
      <div className="container">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">Depoimentos</span>
          <h2>O que minhas clientes dizem</h2>
        </Reveal>

        <div className="testimonials-track">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="div" className="testimonial-card" key={i} delay={i * 70}>
              {t.isPlaceholder && (
                <span className="testimonial-placeholder-tag">Placeholder</span>
              )}
              <div className="testimonial-stars" aria-label="5 de 5 estrelas">
                ★★★★★
              </div>
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <div className="testimonial-name">{t.name}</div>
              {t.context && <div className="testimonial-context">{t.context}</div>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
