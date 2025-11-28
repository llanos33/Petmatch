import React from 'react'
import { Link } from 'react-router-dom'
import './Help.css'

function Help() {
  return (
    <div className="help-container">
      <div className="help-header">
        <h1>Centro de Ayuda</h1>
        <p className="help-subtitle">¿Cómo podemos ayudarte hoy?</p>
      </div>

      <div className="help-content">
        {/* Preguntas Frecuentes */}
        <section className="help-section">
          <h2>Preguntas Frecuentes</h2>
          
          <div className="faq-item">
            <h3>¿Cómo puedo crear una cuenta?</h3>
            <p>Para crear una cuenta, haz clic en "Registrarse" en la parte superior de la página. Completa el formulario con tu información personal y sigue las instrucciones. ¡Es completamente gratuito!</p>
          </div>

          <div className="faq-item">
            <h3>¿Cómo realizo una compra?</h3>
            <p>Es muy sencillo: navega por nuestros productos, agrega los que te interesen al carrito haciendo clic en "Agregar al Carrito", luego ve a tu carrito y completa el proceso de checkout con tu información de envío.</p>
          </div>

          <div className="faq-item">
            <h3>¿Qué métodos de pago aceptan?</h3>
            <p>Aceptamos tarjetas de crédito/débito, pago contra entrega y transferencia bancaria. Puedes seleccionar el método de tu preferencia durante el checkout.</p>
          </div>

          <div className="faq-item">
            <h3>¿Cuánto tardan en llegar mis pedidos?</h3>
            <p>El tiempo de entrega depende de tu ubicación. Generalmente, los pedidos se entregan entre 3 a 7 días hábiles después de la confirmación del pago.</p>
          </div>

          <div className="faq-item">
            <h3>¿Puedo devolver un producto?</h3>
            <p>Sí, aceptamos devoluciones dentro de los 15 días posteriores a la compra, siempre que el producto esté en su estado original y sin usar. Para más información, revisa nuestra Política de Devoluciones.</p>
          </div>

          <div className="faq-item">
            <h3>¿Cómo puedo rastrear mi pedido?</h3>
            <p>Una vez que tu pedido sea enviado, recibirás un correo electrónico con el número de seguimiento. También puedes ver el estado de tus pedidos en tu perfil, en la sección "Mis Compras".</p>
          </div>
        </section>

        {/* Información de Contacto */}
        <section className="help-section">
          <h2>¿Necesitas más ayuda?</h2>
          
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Teléfono</h3>
              <p>3202826022</p>
              <p className="contact-hours">Lun - Vie: 8:00 AM - 6:00 PM<br />Sáb: 9:00 AM - 2:00 PM</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>Email</h3>
              <p>petmatch@gmail.com</p>
              <p className="contact-hours">Respuesta en 24 horas</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Dirección</h3>
              <p>Calle 43 #15-39</p>
              <p>Dosquebradas, Colombia</p>
            </div>
          </div>
        </section>

        {/* Guías y Tutoriales */}
        <section className="help-section">
          <h2>Guías Rápidas</h2>
          
          <div className="guides-grid">
            <div className="guide-card">
              <h3>Primera Compra</h3>
              <p>Guía paso a paso para realizar tu primera compra en PetMatch</p>
              <Link to="/" className="guide-link">Ver guía →</Link>
            </div>

            <div className="guide-card">
              <h3>Gestión de Perfil</h3>
              <p>Aprende a gestionar tu cuenta y ver tu historial de compras</p>
              <Link to="/profile" className="guide-link">Ver guía →</Link>
            </div>

            <div className="guide-card">
              <h3>Productos para Mascotas</h3>
              <p>Descubre qué productos son mejores para tu mascota</p>
              <Link to="/" className="guide-link">Ver guía →</Link>
            </div>
          </div>
        </section>

        {/* Políticas */}
        <section className="help-section">
          <h2>Políticas y Términos</h2>
          
          <div className="policies-list">
            <Link to="/" className="policy-link">
              <span>📄</span>
              <div>
                <h4>Términos y Condiciones</h4>
                <p>Lee nuestros términos de servicio</p>
              </div>
            </Link>

            <Link to="/" className="policy-link">
              <span>🔒</span>
              <div>
                <h4>Política de Privacidad</h4>
                <p>Cómo protegemos tus datos</p>
              </div>
            </Link>

            <Link to="/" className="policy-link">
              <span>↩️</span>
              <div>
                <h4>Política de Devoluciones</h4>
                <p>Información sobre devoluciones y reembolsos</p>
              </div>
            </Link>

            <Link to="/" className="policy-link">
              <span>🚚</span>
              <div>
                <h4>Política de Envíos</h4>
                <p>Información sobre costos y tiempos de envío</p>
              </div>
            </Link>
          </div>
        </section>
      </div>

      {/* Botón para volver */}
      <div className="help-footer">
        <Link to="/" className="back-button">← Volver al inicio</Link>
      </div>
    </div>
  )
}

export default Help

