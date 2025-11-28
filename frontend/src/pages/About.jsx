import React from 'react'
import './About.css'

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-text">
          <p className="about-kicker">Sobre PetMatch</p>
          <h1>Conectamos a las familias con el mejor cuidado para sus mascotas</h1>
          <p className="about-subtitle">
            Somos un equipo de pet lovers que combina tecnología, logística y asesoría veterinaria
            para que tu perro o gato reciba lo mejor, cuando lo necesite.
          </p>
        </div>
        <div className="about-hero-card">
          <h3>Nuestra promesa</h3>
          <ul>
            <li>Selección curada de productos y servicios confiables.</li>
            <li>Entregas rápidas y seguras con seguimiento.</li>
            <li>Beneficios Premium exclusivos para clientes frecuentes.</li>
          </ul>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h3>Nuestra historia</h3>
          <p>
            PetMatch nace para simplificar la vida de quienes aman a sus mascotas. Desde
            alimentos especializados y juguetes interactivos, hasta servicios de bienestar,
            construimos una plataforma completa para acompañarte en cada etapa.
          </p>
        </div>
        <div className="about-card">
          <h3>Cómo trabajamos</h3>
          <p>
            Colaboramos con marcas y proveedores confiables, priorizamos inventario disponible
            y usamos tecnología para personalizar recomendaciones y optimizar rutas de entrega.
          </p>
        </div>
        <div className="about-card">
          <h3>Compromiso con el bienestar</h3>
          <p>
            Promovemos nutrición balanceada, enriquecimiento ambiental y prevención en salud.
            Nuestro blog y equipo de soporte comparten guías prácticas para un cuidado responsable.
          </p>
        </div>
      </div>

      <div className="about-values">
        <h2>Nuestros pilares</h2>
        <div className="values-grid">
          <div className="value-card">
            <h4>Confianza</h4>
            <p>Productos verificados, reseñas transparentes y soporte humano real.</p>
          </div>
          <div className="value-card">
            <h4>Rapidez</h4>
            <p>Envíos ágiles y seguimiento claro para que nunca falte nada en casa.</p>
          </div>
          <div className="value-card">
            <h4>Innovación</h4>
            <p>Recomendaciones personalizadas y experiencias pensadas para mascotas modernas.</p>
          </div>
          <div className="value-card">
            <h4>Comunidad</h4>
            <p>Contenido educativo, tips de expertos y una red que comparte el mismo amor animal.</p>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <div>
          <h2>¿Quieres conocer más?</h2>
          <p>Explora nuestras categorías, activa beneficios Premium o chatea con nosotros.</p>
        </div>
        <div className="about-cta-actions">
          <a className="about-btn primary" href="/premium">Ver beneficios Premium</a>
          <a className="about-btn secondary" href="/servicios">Explorar servicios</a>
        </div>
      </div>
    </div>
  )
}

export default About
