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
