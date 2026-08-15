import PlaceholderImage from "@/components/PlaceholderImage";
import { BRAND, IMAGE_PLACEHOLDERS } from "@/lib/siteConfig";

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-eyebrow">
            Maquiadora • {BRAND.city.toUpperCase()} — {BRAND.state}
          </div>
          <h1>
            Sua beleza. <em>Sua essência.</em> Seu momento.
          </h1>
          <p className="hero-sub">
            Maquiagem profissional e personalizada para valorizar quem você é
            em cada momento especial.
          </p>
          <div className="hero-ctas">
            <a href="#agendar" className="btn btn-primary">
              Agendar minha maquiagem
            </a>
            <a href="#portfolio" className="btn btn-ghost">
              Ver portfólio
            </a>
          </div>
          <div className="hero-trust">
            <span className="hero-trust-item">Atendimento com hora marcada</span>
            <span className="hero-trust-item">Estúdio em {BRAND.city}</span>
            <span className="hero-trust-item">Produção personalizada</span>
          </div>
        </div>
        <div className="hero-media">
          <PlaceholderImage
            path={IMAGE_PLACEHOLDERS.heroPortrait}
            label={`Foto: ${IMAGE_PLACEHOLDERS.heroPortrait} — substituir`}
            variant="portrait"
          />
        </div>
      </div>
    </section>
  );
}
