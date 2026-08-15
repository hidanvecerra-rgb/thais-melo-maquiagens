import PlaceholderImage from "@/components/PlaceholderImage";
import Reveal from "@/components/Reveal";
import { BRAND, IMAGE_PLACEHOLDERS } from "@/lib/siteConfig";

export default function LocationSection() {
  return (
    <section id="localizacao" style={{ background: "var(--surface)" }}>
      <div className="container loc-wrap">
        <Reveal as="div" className="loc-info">
          <span className="eyebrow">Localização</span>
          <h3>Onde você será atendida</h3>
          <div className="loc-line">
            <span>
              <strong>{BRAND.cityState}.</strong> Atendimento em estúdio
              próprio e exclusivamente com horário marcado.
            </span>
          </div>
          <div className="loc-line">
            <span>{BRAND.phoneDisplay}</span>
          </div>
          <div className="loc-line">
            <span>{BRAND.hoursLabel}</span>
          </div>
          <p className="loc-note">
            O endereço completo é informado após a confirmação do
            agendamento.
          </p>
          <a
            href="#agendar"
            className="btn btn-primary"
            style={{ marginTop: "20px" }}
          >
            Agendar horário
          </a>
        </Reveal>
        <Reveal as="div" className="loc-map">
          <PlaceholderImage
            path={IMAGE_PLACEHOLDERS.studio}
            label={`Foto: ${IMAGE_PLACEHOLDERS.studio} — substituir`}
            variant="wide"
          />
        </Reveal>
      </div>
    </section>
  );
}
