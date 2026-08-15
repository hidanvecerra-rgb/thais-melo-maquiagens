import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function SiteFooter() {
  return (
    <>
      <footer>
        <div className="logo">Thais Melo Maquiagens</div>
        <div className="foot-links">
          <a href="#servicos">Serviços</a>
          <a href="#agendar">Agendar</a>
          <a href="#localizacao">Localização</a>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} Thais Melo Maquiagens. Todos os
          direitos reservados.
        </div>
      </footer>
      <a
        className="whatsapp-float"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          "Olá! Vim pelo site e gostaria de saber mais."
        )}`}
        target="_blank"
        rel="noreferrer"
        title="Falar no WhatsApp"
        aria-label="Falar no WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.14-1.13l-.3-.18-3.09.81.82-3.01-.19-.31a8.08 8.08 0 0 1-1.24-4.3c0-4.47 3.64-8.11 8.12-8.11 2.17 0 4.2.85 5.73 2.38a8.05 8.05 0 0 1 2.38 5.74c0 4.47-3.64 8.11-8.08 8.11Zm4.44-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.2-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
      <a
        className="admin-link"
        href="/painel"
        title="Área da maquiadora"
        aria-label="Área da maquiadora"
      >
        🔒
      </a>
    </>
  );
}
