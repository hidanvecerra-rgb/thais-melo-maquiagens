import { BRAND } from "@/lib/siteConfig";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-name">{BRAND.name.toUpperCase()}</span>
            <p>
              {BRAND.tagline}
              <br />
              {BRAND.cityState}
            </p>
          </div>
          <nav className="footer-links" aria-label="Links do rodapé">
            <a href="#inicio">Início</a>
            <a href="#servicos">Serviços</a>
            <a href="#portfolio">Portfólio</a>
            <a href="#agendar">Agendamento</a>
          </nav>
          <nav className="footer-links" aria-label="Contato">
            <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a href="/politica-de-privacidade">Política de Privacidade</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {BRAND.legalName}. Todos os direitos
            reservados.
          </span>
          <span>{BRAND.cityState}</span>
        </div>
      </div>
    </footer>
  );
}
