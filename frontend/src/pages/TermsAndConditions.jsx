import React from "react";
import "./LegalPageLayout.css";

export default function TermsAndConditions() {
  const sections = [
    {
      title: "Aceptación de los términos",
      paragraphs: [
        "Al acceder y utilizar PetMatch confirmas que eres mayor de edad y que aceptas estos términos y condiciones en su totalidad.",
        "Nos reservamos el derecho de actualizar este documento. Los cambios entran en vigor inmediatamente y se destacarán en esta página."
      ]
    },
    {
      title: "Servicios ofrecidos",
      paragraphs: [
        "PetMatch actúa como plataforma de comercio electrónico para productos y servicios enfocados en el bienestar de las mascotas.",
        "Nos comprometemos a brindar información clara sobre disponibilidad, precios y características de cada producto." 
      ],
      list: [
        "Descripciones detalladas y actualizadas de productos",
        "Asistencia pre y post venta a través de nuestros canales de contacto",
        "Gestión segura de pagos digitales"
      ]
    },
    {
      title: "Obligaciones del usuario",
      paragraphs: [
        "Los usuarios deben proporcionar información veraz, mantener sus credenciales seguras y hacer uso responsable de la plataforma.",
        "PetMatch puede suspender cuentas ante actividades sospechosas o uso indebido de los servicios." 
      ]
    },
    {
      title: "Propiedad intelectual",
      paragraphs: [
        "La marca PetMatch, así como los contenidos, imágenes y material gráfico del sitio, son propiedad de la compañía o cuentan con licencias de uso.",
        "Queda prohibida la reproducción total o parcial de los contenidos sin autorización escrita." 
      ]
    },
    {
      title: "Limitación de responsabilidad",
      paragraphs: [
        "PetMatch realiza esfuerzos razonables para garantizar la continuidad del servicio, pero no se hace responsable por interrupciones ocasionadas por terceros o causas de fuerza mayor.",
        "En ningún caso la responsabilidad excederá el valor total del pedido asociado a la reclamación." 
      ]
    }
  ];

  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div>
          <span className="legal-kicker">Documento legal</span>
          <h1>Términos y condiciones de PetMatch</h1>
          <p>
            Este documento describe los acuerdos entre PetMatch y nuestros usuarios para garantizar una experiencia segura, transparente y confiable.
          </p>
        </div>
        <aside>
          <h3>Resumen</h3>
          <ul>
            <li>Protegemos tu información y tu experiencia de compra.</li>
            <li>Exigimos un uso respetuoso y responsable de la plataforma.</li>
            <li>Actualizamos estos términos cuando implementamos nuevas funcionalidades.</li>
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
            {section.list && (
              <ul>
                {section.list.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <p className="legal-update">Última actualización: 15 de noviembre de 2025.</p>
      </div>
    </div>
  );
}
