import React from "react";
import "./LegalPageLayout.css";

const faqItems = [
  {
    question: "¿Cómo puedo registrar una cuenta en PetMatch?",
    answer: "Selecciona la opción de registro, completa el formulario con tus datos personales y confirma el correo electrónico que te enviaremos."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Recibimos tarjetas débito y crédito, pagos PSE y ciertos métodos contraentrega disponibles en ciudades principales."
  },
  {
    question: "¿Puedo modificar o cancelar un pedido?",
    answer: "Sí, comunícate con nosotros dentro de las primeras dos horas posteriores a la compra para evaluar el estado de tu pedido y ayudarte con los cambios." 
  },
  {
    question: "¿Cómo funcionan los envíos?",
    answer: "Trabajamos con operadores logísticos aliados que nos permiten cubrir la mayoría de ciudades del país. Recibirás actualizaciones del estado de tu envío por correo."
  },
  {
    question: "¿Qué hago si mi producto llegó dañado?",
    answer: "Por favor reporta el incidente a soporte@petmatch.co con fotos del paquete y del producto. Nuestro equipo gestionará la reposición o reembolso según corresponda." 
  },
  {
    question: "¿Ofrecen atención veterinaria?",
    answer: "Tenemos aliados veterinarios para orientaciones básicas. Los diagnósticos presenciales debes coordinarlos directamente con nuestros centros asociados." 
  }
];

export default function FAQ() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div>
          <span className="legal-kicker">Centro de ayuda</span>
          <h1>Preguntas frecuentes</h1>
          <p>
            Encuentra respuestas a las dudas más comunes sobre pedidos, pagos, envíos y soporte para tu mascota.
          </p>
        </div>
        <aside>
          <h3>Necesitas más ayuda</h3>
          <ul>
            <li>Escríbenos a soporte@petmatch.co</li>
            <li>Contáctanos por WhatsApp al 320 282 6022</li>
            <li>Consulta la sección de ayuda para tutoriales paso a paso</li>
          </ul>
        </aside>
      </section>

      <div className="legal-content">
        {faqItems.map(item => (
          <section key={item.question} className="legal-section">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </section>
        ))}
        <p className="legal-update">Última actualización: 5 de noviembre de 2025.</p>
      </div>
    </div>
  );
}
