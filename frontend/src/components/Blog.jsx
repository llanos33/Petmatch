import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Blog.css'
import { 
  ArrowLeft, 
  Heart, 
  Zap, 
  Leaf,
  BookOpen,
  Calendar,
  Crown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const { user } = useAuth()

  const blogPosts = [
    {
      id: 1,
      title: 'Nutrición Equilibrada: La Base de la Salud de tu Mascota',
      category: 'nutricion',
      date: '15 Nov 2024',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Una alimentación adecuada es fundamental para mantener a tu mascota saludable y feliz. Aprende qué nutrientes necesita tu perro o gato.',
      content: 'Una nutrición equilibrada es esencial para la salud de tu mascota. Los perros y gatos necesitan proteínas de alta calidad, grasas saludables, vitaminas y minerales. Alimenta a tu mascota con productos de calidad premium que contengan ingredientes naturales. Evita alimentos con exceso de conservantes o colorantes artificiales. Consulta con tu veterinario sobre la cantidad diaria recomendada según la edad y peso de tu mascota.'
    },
    {
      id: 2,
      title: 'Ejercicio Diario: Mantén a tu Mascota Activa',
      category: 'salud',
      date: '12 Nov 2024',
      image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80',
      excerpt: 'El ejercicio regular previene la obesidad y mantiene a tu mascota mental y físicamente estimulada. Descubre cuánto ejercicio necesita.',
      content: 'El ejercicio diario es crucial para la salud física y mental de tu mascota. Los perros necesitan al menos 30 minutos a 2 horas de ejercicio diario, dependiendo de su raza y edad. Los gatos también necesitan actividad física regular mediante juegos y juguetes interactivos. Usa juguetes como pelotas, frisbees o cuerdas para estimular el juego. El ejercicio ayuda a prevenir comportamientos destructivos y reduce la ansiedad.'
    },
    {
      id: 3,
      title: 'Higiene Dental: Sonrisa Saludable para tu Mascota',
      category: 'salud',
      date: '10 Nov 2024',
      image: 'https://mascoterias.com/blog/wp-content/uploads/2025/02/LIMPIEZA-DENTAL-1300x754.jpg',
      excerpt: 'La salud dental es a menudo ignorada pero es vital. Te enseñamos cómo mantener los dientes de tu mascota limpios y saludables.',
      content: 'La higiene dental es fundamental para prevenir enfermedades bucales y mal aliento en tus mascotas. Cepilla los dientes de tu mascota al menos 3 veces por semana, idealmente diariamente, con cepillos y pastas especiales para animales. Usa juguetes de goma o snacks diseñados para limpiar los dientes naturalmente. Realiza limpiezas profesionales con tu veterinario una vez al año. Una boca saludable es clave para una vida larga y feliz.'
    },
    {
      id: 4,
      title: 'Accesorios Imprescindibles para tu Mascota',
      category: 'productos',
      date: '8 Nov 2024',
      image: 'https://images.unsplash.com/photo-1579945235975-1ef5f126585f?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Descubre los accesorios esenciales que todo dueño de mascota debe tener para garantizar comodidad y seguridad.',
      content: 'Los accesorios adecuados hacen la vida más cómoda tanto para ti como para tu mascota. Algunos esenciales incluyen: correa resistente y collar reflectante, transportín seguro para viajar, cama cómoda, comedero y bebedero, juguetes variados, cepillo para el pelaje, y una maceta con pasto gatera para gatos. Invierte en productos de calidad que duren más tiempo y proporcionen mayor seguridad y comodidad a tu mascota.'
    },
    {
      id: 5,
      title: 'Primeros Auxilios Básicos para Mascotas',
      category: 'salud',
      date: '5 Nov 2024',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Aprende técnicas básicas de primeros auxilios para estar preparado ante emergencias con tu mascota.',
      content: 'Saber primeros auxilios básicos puede salvar la vida de tu mascota en una emergencia. Ten siempre a mano un botiquín de primeros auxilios con vendas, antiséptico, gasas estériles y termómetro. Aprende a controlar hemorragias, reconocer signos de shock, y hacer RCP básico. En caso de envenenamiento o accidente grave, contacta inmediatamente al veterinario. Mantén los números de emergencia veterinaria en tu teléfono. La prevención y preparación son clave.'
    },
    {
      id: 6,
      title: 'Socialización: Crianza de Mascotas Felices',
      category: 'comportamiento',
      date: '2 Nov 2024',
      image: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?auto=format&fit=crop&w=800&q=80',
      excerpt: 'La socialización temprana es fundamental para que tu mascota sea equilibrada y confiada. Conoce cómo hacerlo correctamente.',
      content: 'La socialización es el proceso de exponer a tu mascota a diferentes personas, animales y entornos de manera segura y positiva. Comienza desde cachorro o gatito, durante las primeras semanas de vida. Expón a tu mascota a sonidos diferentes, lugares nuevos, personas variadas y otros animales. Usa refuerzo positivo con premios y caricias. Una mascota bien socializada es menos propensa a miedos, agresión y comportamientos destructivos. Es una inversión en su bienestar emocional.'
    },
    // Artículos exclusivos Premium
    {
      id: 7,
      title: '🌟 Recetas Premium: Alimentación Natural Casera',
      category: 'premium',
      isPremium: true,
      date: '18 Nov 2024',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
      excerpt: '💎 Exclusivo Premium: Recetas balanceadas y aprobadas por veterinarios para preparar en casa comidas nutritivas para tu mascota.',
      content: 'Descubre cómo preparar comidas caseras nutritivas y balanceadas para tu perro o gato. Receta 1 - Pollo con verduras: 300g pechuga de pollo, 100g arroz integral, 50g zanahoria, 50g espinacas. Receta 2 - Res con quinoa: 250g carne molida magra, 100g quinoa, 80g calabaza, 30g brócoli. Incluye suplementos vitamínicos recomendados por tu veterinario. Prepara porciones semanales y refrigera. Siempre consulta con un veterinario antes de cambiar la dieta de tu mascota.'
    },
    {
      id: 8,
      title: '🌟 Medicina Preventiva Avanzada: Calendario Completo',
      category: 'premium',
      isPremium: true,
      date: '16 Nov 2024',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80',
      excerpt: '💎 Exclusivo Premium: Guía completa de medicina preventiva con calendario de vacunas, desparasitación y chequeos según la edad.',
      content: 'Calendario preventivo por edad - Cachorros (0-6 meses): Vacunas a las 6, 9, 12 y 16 semanas. Desparasitación cada 2 semanas. Adultos (1-7 años): Vacunas anuales (rabia, parvovirus, moquillo). Desparasitación trimestral. Control dental cada 6 meses. Seniors (+7 años): Chequeos veterinarios semestrales, análisis de sangre anuales, examen de orina, evaluación dental profesional. Mantén registro digital de todas las vacunas y tratamientos.'
    },
    {
      id: 9,
      title: '🌟 Entrenamiento Avanzado: Trucos y Comandos Complejos',
      category: 'premium',
      isPremium: true,
      date: '14 Nov 2024',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
      excerpt: '💎 Exclusivo Premium: Técnicas profesionales de entrenamiento para enseñar trucos avanzados y mejorar la obediencia.',
      content: 'Técnicas de entrenamiento profesional - Método del clicker: Asocia el sonido con recompensa inmediata. Trucos avanzados: Rodar, hacerse el muerto, caminar en dos patas, traer objetos específicos por nombre. Progresión: Comienza con comandos básicos (sentado, quieto), luego intermedio (dar la pata, girar), finalmente avanzado (saltos, circuitos). Sesiones de 10-15 minutos, 2-3 veces al día. Paciencia y refuerzo positivo constante son clave. Evita castigos, usa solo recompensas.'
    },
    {
      id: 10,
      title: '🌟 Planes de Viaje con Mascotas: Guía Definitiva',
      category: 'premium',
      isPremium: true,
      date: '11 Nov 2024',
      image: 'https://images.unsplash.com/photo-1508022785014-e7f4a5a8e42c?auto=format&fit=crop&w=800&q=80',
      excerpt: '💎 Exclusivo Premium: Todo lo que necesitas saber para viajar con tu mascota: documentos, transportines, destinos pet-friendly.',
      content: 'Preparación para viajar - Documentos necesarios: Carnet de vacunación actualizado, certificado de salud veterinario (máx. 10 días), microchip registrado. Transportín: Mínimo 1.5x el tamaño de tu mascota, ventilación adecuada. Destinos pet-friendly en Colombia: Cartagena, Eje Cafetero, Villa de Leyva. Hoteles que aceptan mascotas, restaurantes con áreas exteriores. Tips de vuelo: Reserva cabina si el peso lo permite (<8kg). Hidratación constante. Collar con identificación y contacto.'
    }
  ]

  const categories = [
    { id: 'todos', name: 'Todos los Artículos' },
    { id: 'nutricion', name: '🍖 Nutrición' },
    { id: 'salud', name: '💊 Salud' },
    { id: 'productos', name: '🛍️ Productos' },
    { id: 'comportamiento', name: '🐾 Comportamiento' },
    { id: 'premium', name: '💎 Premium', isPremium: true }
  ]

  // Filtrar posts según categoría seleccionada
  let filteredPosts = selectedCategory === 'todos'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

  // Si el usuario no es Premium, ocultar artículos premium
  if (!user?.isPremium) {
    filteredPosts = filteredPosts.filter(post => !post.isPremium)
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">Consejos</h1>
        <p className="blog-subtitle">Tips y artículos sobre el cuidado de tus mascotas</p>
      </div>

      <div className="blog-content">
        {/* Sidebar con categorías */}
        <aside className="blog-sidebar">
          <div className="categories-section">
            <h3>
              <BookOpen size={20} />
              Categorías
            </h3>
            <div className="category-list">
              {categories.map(cat => {
                const isPremiumLocked = cat.isPremium && !user?.isPremium
                return (
                  <button
                    key={cat.id}
                    className={`category-btn ${selectedCategory === cat.id ? 'active' : ''} ${isPremiumLocked ? 'locked' : ''}`}
                    onClick={() => {
                      if (isPremiumLocked) return
                      setSelectedCategory(cat.id)
                    }}
                    title={isPremiumLocked ? 'Contenido exclusivo para usuarios Premium' : ''}
                  >
                    {cat.name}
                    {isPremiumLocked && <span className="lock-icon">🔒</span>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="info-box">
            <Heart size={24} />
            <h4>¿Necesitas Ayuda?</h4>
            <p>Consulta nuestra sección de ayuda o contáctanos directamente.</p>
            <Link to="/help" className="info-btn">Ver Ayuda</Link>
          </div>
        </aside>

        {/* Main content con posts */}
        <main className="blog-posts">
          <div className="posts-count">
            Mostrando {filteredPosts.length} artículos
          </div>

          {filteredPosts.length > 0 ? (
            <div className="posts-grid">
              {filteredPosts.map(post => (
                <article key={post.id} className={`blog-post-card ${post.isPremium ? 'premium-post' : ''}`}>
                  <div className="post-image">
                    <img src={post.image} alt={post.title} />
                    <div className="post-category-badge">{
                      categories.find(c => c.id === post.category)?.name || post.category
                    }</div>
                    {post.isPremium && (
                      <div className="premium-post-badge">
                        <Crown size={16} />
                        Premium
                      </div>
                    )}
                  </div>
                  
                  <div className="post-content">
                    <h2 className="post-title">{post.title}</h2>
                    
                    <div className="post-meta">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    
                    <p className="post-excerpt">{post.excerpt}</p>
                    
                    <p className="post-excerpt">{post.excerpt}</p>
                    
                    <Link to={`/blog/${post.id}`} className="read-more-btn">
                      Leer Más
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <p>No hay artículos en esta categoría aún.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
