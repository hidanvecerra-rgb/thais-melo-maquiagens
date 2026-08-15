import Reveal from "@/components/Reveal";
import { BENEFITS } from "@/lib/siteConfig";

export default function Benefits() {
  return (
    <section style={{ background: "var(--surface)" }}>
      <div className="container">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">Diferenciais</span>
          <h2>Uma experiência pensada em cada detalhe</h2>
        </Reveal>

        <div className="benefits-grid">
          {BENEFITS.map((b, i) => (
            <Reveal as="div" className="benefit-item" key={b.title} delay={i * 70}>
              <span className="benefit-index">{String(i + 1).padStart(2, "0")}</span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
