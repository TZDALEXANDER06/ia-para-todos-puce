export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footerMain">
          <strong className="footerBrand">
            <span className="brandMark" aria-hidden="true">
              IA
            </span>
            IA para Todos · PUCE Sistemas 2026
          </strong>

          <div className="footerDirector">
            <span className="directorLogo" aria-hidden="true">
              FR
            </span>
            <span className="directorText">
              <small>Director del proyecto</small>
              <strong>Francisco Rodríguez</strong>
            </span>
          </div>

          <address className="footerContact">
            <span>
              <span className="ic">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12 21s7-6.2 7-12A7 7 0 0 0 5 9c0 5.8 7 12 7 12Z" />
                  <circle cx="12" cy="9" r="2.4" />
                </svg>
              </span>
              Avenida 12 de Octubre 1076 y Vicente Ramón Roca
            </span>
            <a href="tel:+593022991700">
              <span className="ic">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z" />
                </svg>
              </span>
              (593) (02) 2991700
            </a>
            <a href="https://www.puce.edu.ec">
              <span className="ic">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                  <path d="M12 2a15.3 15.3 0 0 0 0 20" />
                </svg>
              </span>
              www.puce.edu.ec
            </a>
          </address>

          <p className="footerNote">
            Todos los derechos reservados · Pontificia Universidad Católica del
            Ecuador · Dirección de Informática · 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
