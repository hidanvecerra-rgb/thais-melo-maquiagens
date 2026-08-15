import PlaceholderImage from "@/components/PlaceholderImage";
import Reveal from "@/components/Reveal";
import { ABOUT_TEXT, BRAND, IMAGE_PLACEHOLDERS } from "@/lib/siteConfig";

export default function About() {
  return (
    <section id="sobre">
      <div className="container about-grid">
        <Reveal as="div" className="about-media">
          <PlaceholderImage
            path={IMAGE_PLACEHOLDERS.aboutPortrait}
            label={`Foto: ${IMAGE_PLACEHOLDERS.aboutPortrait} — substituir`}
          />
        </Reveal>

        <Reveal as="div" className="about-content">
          <span className="eyebrow">Sobre</span>
          <h2>Prazer, sou {BRAND.name}</h2>
          {ABOUT_TEXT.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="about-signature">{BRAND.name}</div>
          <a href="#portfolio" className="btn btn-ghost">
            Conhecer meus trabalhos
          </a>
        </Reveal>
      </div>
    </section>
  );
}
