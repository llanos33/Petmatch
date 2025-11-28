import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { 
  Youtube, 
  Facebook, 
  Instagram,
  Send,
  MapPin,
  Phone,
  Shield,
  Lock
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-col logo-col">
          <div className="logo">
            <span className="logo-icon" aria-hidden="true">🐾</span>
            <span className="logo-text">PetMatch!</span>
          </div>
          <p className="slogan">Por la felicidad de tus peludos .</p>
          <div className="social">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={28} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={28} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <Youtube size={28} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>ACERCA DE PETMATCH</h4>
          <Link to="/sobre">Sobre PetMatch</Link>
          <Link to="/servicios">Servicios</Link>
          <Link to="/blog">Consejos</Link>
          <Link to="/terms">Términos y condiciones</Link>
        </div>

        <div className="footer-col">
          <h4>LINKS DE INTERÉS</h4>
          <Link to="/faq">Preguntas frecuentes</Link>
          <Link to="/privacy">Política de Privacidad</Link>
          <Link to="/delivery">Políticas de Entrega</Link>
          <Link to="/sitemap">Mapa del sitio</Link>
        </div>

        <div className="footer-col">
          <h4>NUESTRAS TIENDAS</h4>
          <Link to="/stores" className="link">
            <MapPin size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Dosquebradas, calle 43 #15-39, Br Buenos Aires
          </Link>
        </div>

        <div className="footer-col">
          <h4>INFORMACIÓN</h4>
          <p>
            <Phone size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Teléfono: 320 282 6022
          </p>
          <p>
            <MapPin size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Dosquebradas, Colombia
          </p>
        </div>

        <div className="footer-col">
          <h4>SUSCRÍBETE</h4>
          <p>Recibe noticias y promociones al instante.</p>
          <form>
            <input type="email" placeholder="Correo electrónico" />
            <button type="submit">
              <Send size={18} />
            </button>
          </form>
          <label className="check">
            <input type="checkbox" /> Acepto las políticas de privacidad
          </label>
        </div>
      </div>

      <div className="footer-security">
        <div className="secure-item">
          <Lock size={20} style={{ marginRight: '8px' }} />
          <span>SSL Pago 100% seguro</span>
        </div>
        <div className="secure-item">
          <Shield size={20} style={{ marginRight: '8px' }} />
          <span className="badge">Protección segura 24/7</span>
        </div>
        <div className="payments">
          <span>Medios de pago:</span> VISA · MasterCard · AMEX · PSE · Efecty
        </div>
      </div>

      <div className="footer-apps">
        <a href="#">App Store</a>
        <a href="#">Google Play</a>
        <a href="#">AppGallery</a>
      </div>

      <div className="footer-legal">
        <p>
          PetMatch S.A.S · NIT 900.000.000-0 · Cra 68G No.74B-56, Bogotá DC ·
          Tel. 300 910 8496 · <a href="mailto:legal@petmatch.co">legal@petmatch.co</a>
        </p>
      </div>
    </footer>
  );
}
