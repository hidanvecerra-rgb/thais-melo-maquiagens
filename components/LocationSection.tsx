import { PIX_KEY_DISPLAY } from "@/lib/constants";

export default function LocationSection() {
  return (
    <section className="location" id="localizacao">
      <div className="loc-wrap">
        <div className="loc-info">
          <h3>Onde estou</h3>
          <div className="loc-line">
            <span>📍</span>
            <p>
              Atendimento em estúdio próprio, em Ituiutaba - MG. O endereço
              completo é enviado na confirmação do WhatsApp.
            </p>
          </div>
          <div className="loc-line">
            <span>📱</span>
            <p>{PIX_KEY_DISPLAY}</p>
          </div>
          <div className="loc-line">
            <span>🕐</span>
            <p>Terça a sábado, das 9h às 19h</p>
          </div>
          <a
            href="#agendar"
            className="btn-primary"
            style={{ display: "inline-block", marginTop: "10px" }}
          >
            Agendar horário
          </a>
        </div>
        <div className="loc-map">Mapa do estúdio</div>
      </div>
    </section>
  );
}
