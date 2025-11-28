import React from "react";
import "./LegalPageLayout.css";

const deliverySections = [
  {
    title: "Cobertura",
    paragraphs: [
      "Despachamos a todas las ciudades principales de Colombia y a la mayoría de municipios intermedios mediante aliados logísticos certificados.",
      "Antes de finalizar tu compra confirmaremos automáticamente si tu dirección está dentro de nuestra zona de cobertura." 
    ]
  },
  {
    title: "Tiempos de envío",
    paragraphs: [
      "Los pedidos se procesan en un plazo de 24 horas hábiles y el tiempo de entrega varía entre 1 y 5 días hábiles según la ciudad.",
      "En temporadas de alta demanda te avisaremos cuando se presenten demoras extraordinarias." 
    ],
    list: [
      "Ciudades principales: 1-2 días hábiles",
      "Ciudades intermedias: 2-4 días hábiles",
      "Zonas especiales: hasta 7 días hábiles"
    ]
  },
  {
    title: "Costos de envío",
    paragraphs: [
      "El valor del envío se calcula de acuerdo con la ubicación, el peso y el volumen del pedido.",
      "Ofrecemos envío gratis en compras superiores a $180.000 COP para ciudades principales." 
    ]
  },
  {
    title: "Seguimiento",
    paragraphs: [
      "Te enviaremos un código de seguimiento por correo electrónico tan pronto como tu pedido sea entregado al operador logístico.",
      "Puedes revisar el estado en cualquier momento desde tu cuenta o contactando a nuestro equipo de soporte." 
    ]
  },
  {
    title: "Devoluciones y reclamaciones",
    paragraphs: [
      "Si recibes un producto equivocado o en mal estado, repórtalo en un plazo máximo de cinco días hábiles.",
      "Programaremos la recolección o la reposición según lo que resulte más conveniente para ti." 
    ]
  }
];

export default function DeliveryPolicy() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div>
          <span className="legal-kicker">Logística PetMatch</span>
          <h1>Políticas de entrega</h1>
          <p>
            Queremos que tus pedidos lleguen rápido y seguros, por eso trabajamos con aliados confiables y mantenemos comunicación constante durante todo el proceso.
          </p>
        </div>
        <aside>
          <h3>Recuerda</h3>
          <ul>
            <li>Verifica tus datos de contacto y dirección antes de pagar.</li>
            <li>Monitorea tu envío con el código que recibirás por correo.</li>
            <li>Reporta cualquier novedad para ayudarte oportunamente.</li>
          </ul>
        </aside>
      </section>

      <div className="legal-content">
        {deliverySections.map(section => (
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
        <p className="legal-update">Última actualización: 12 de noviembre de 2025.</p>
      </div>
    </div>
  );
}
