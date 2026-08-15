export default function NavBar() {
  return (
    <nav className="nav">
      <div className="logo">
        Thais Melo <em>Maquiagens</em>
      </div>
      <div className="nav-links">
        <a href="#servicos">Serviços</a>
        <a href="#localizacao">Localização</a>
        <a href="#agendar" className="nav-cta">
          Agendar horário
        </a>
      </div>
    </nav>
  );
}
