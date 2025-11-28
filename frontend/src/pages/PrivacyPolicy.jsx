import React from "react";
import "./LegalPageLayout.css";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Información que recopilamos",
      paragraphs: [
        "Recopilamos datos personales como nombre, correo electrónico, teléfono y dirección cuando te registras o realizas una compra.",
        "Algunas interacciones generan datos técnicos (cookies, dirección IP, dispositivo) que usamos para mejorar la experiencia del sitio."
      ]
    },
    {
      title: "Uso de la información",
      paragraphs: [
        "Utilizamos tu información para gestionar pedidos, procesar pagos, enviar comunicaciones relevantes y personalizar recomendaciones.",
        "Nunca vendemos tus datos. Solo compartimos información con aliados logísticos o de pago cuando es necesario para completar tu compra."
      ]
    },
    {
      title: "Derechos como titular",
      paragraphs: [
        "Puedes solicitar acceso, actualización o eliminación de tus datos personales escribiendo a privacy@petmatch.co.",
        "También puedes revocar la autorización de uso o presentar reclamos ante la Superintendencia de Industria y Comercio." 
      ]
    },
    {
      title: "Seguridad de la información",
      paragraphs: [
        "Implementamos protocolos SSL, cifrado de contraseñas y controles internos para proteger tus datos.",
        "Cuando detectamos incidentes de seguridad notificaremos a los usuarios afectados y a las autoridades competentes." 
      ]
    },
    {
      title: "Cookies y preferencias",
      paragraphs: [
        "Utilizamos cookies propias y de terceros para análisis, medición de audiencia y personalización del contenido.",
        "Puedes administrar tus preferencias desde la configuración del navegador, aunque algunas funciones podrían limitarse." 
      ]
    }
  ];

  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div>
          <span className="legal-kicker">Protección de datos</span>
          <h1>Política de privacidad de PetMatch</h1>
          <p>
            Nos comprometemos a manejar tu información personal con transparencia, responsabilidad y altos estándares de seguridad.
          </p>
        </div>
        <aside>
          <h3>Tu privacidad importa</h3>
          <ul>
            <li>Tratamos la información conforme a la normatividad colombiana.</li>
            <li>Usamos tus datos únicamente para la prestación del servicio.</li>
            <li>Siempre podrás ejercer tus derechos de acceso, rectificación y supresión.</li>
          </ul>
        </aside>
      </section>

      <div className="legal-content">
        {sections.map(section => (
          <section key={section.title} className="legal-section">
            <h2>{section.title}</h2>
            {section.paragraphs.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
        <p className="legal-update">Última actualización: 10 de noviembre de 2025.</p>
      </div>
    </div>
  );
}
