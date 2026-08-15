import PlaceholderImage from "@/components/PlaceholderImage";
import Reveal from "@/components/Reveal";
import { BRAND, IMAGE_PLACEHOLDERS } from "@/lib/siteConfig";

export default function Instagram() {
  return (
    <section style={{ background: "var(--surface)" }}>
      <div className="container">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">Instagram</span>
          <h2>Acompanhe meu trabalho</h2>
          <p>{BRAND.instagramHandle}</p>
        </Reveal>

        <div className="instagram-grid">
          {IMAGE_PLACEHOLDERS.instagram.map((photo) => (
            <a
              key={photo.src}
              className="instagram-item"
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <PlaceholderImage path={photo.src} label={photo.alt} variant="square" />
            </a>
          ))}
        </div>

        <div className="instagram-cta">
          <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
            Seguir no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
