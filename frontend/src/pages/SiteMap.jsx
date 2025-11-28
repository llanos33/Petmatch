import React from "react";
import { Link } from "react-router-dom";
import "./LegalPageLayout.css";

const groupedLinks = [
  {
    title: "Tienda",
    links: [
      { label: "Inicio", path: "/" },
      { label: "Promociones", path: "/promociones" },
      { label: "Productos exclusivos", path: "/exclusivos" },
      { label: "Carrito", path: "/cart" },
      { label: "Checkout", path: "/checkout" }
    ]
  },
  {
    title: "Categorías",
    links: [
      { label: "Alimentos", path: "/category/Alimentos" },
      { label: "Juguetes", path: "/category/Juguetes" },
      { label: "Accesorios", path: "/category/Accesorios" },
      { label: "Medicamentos", path: "/category/Medicamentos" },
      { label: "Higiene", path: "/category/Higiene" },
      { label: "Camas y Casas", path: "/category/Camas%20y%20Casas" }
    ]
  },
  {
    title: "Comunidad",
    links: [
      { label: "Blog", path: "/blog" },
      { label: "Servicios", path: "/servicios" },
      { label: "Plan Premium", path: "/premium" },
      { label: "Lista de deseos", path: "/lista-deseos" }
    ]
  },
  {
    title: "Soporte",
    links: [
      { label: "Preguntas frecuentes", path: "/faq" },
      { label: "Ayuda", path: "/help" },
      { label: "Política de privacidad", path: "/privacy" },
      { label: "Políticas de entrega", path: "/delivery" },
      { label: "Términos y condiciones", path: "/terms" }
    ]
  },
  {
    title: "Cuenta",
    links: [
      { label: "Iniciar sesión", path: "/login" },
      { label: "Registrarme", path: "/register" },
      { label: "Mi perfil", path: "/profile" }
    ]
  }
];

export default function SiteMap() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div>
          <span className="legal-kicker">Navegación</span>
          <h1>Mapa del sitio</h1>
          <p>
            Visualiza todas las secciones de PetMatch y accede rápidamente a la información que necesitas para tus compras y tu mascota.
          </p>
        </div>
        <aside>
          <h3>Recomendaciones</h3>
          <ul>
            <li>Guarda tus accesos favoritos para volver en segundos.</li>
            <li>Visita la sección de soporte si necesitas asistencia adicional.</li>
            <li>Contáctanos en cualquier momento a través de nuestros canales oficiales.</li>
          </ul>
        </aside>
      </section>

      <div className="legal-content">
        {groupedLinks.map(group => (
          <section key={group.title} className="legal-section">
            <h2>{group.title}</h2>
            <ul>
              {group.links.map(item => (
                <li key={item.path}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="legal-update">Última actualización: 20 de noviembre de 2025.</p>
      </div>
    </div>
  );
}
