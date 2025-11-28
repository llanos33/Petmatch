import React, { useMemo, useState } from 'react'
import { MapPin, Navigation, Phone, Clock, HeartPulse, Shield } from 'lucide-react'
import BackHomeButton from './BackHomeButton'
import './Servicios.css'

const typeFilters = ['Todos', 'Veterinaria', 'Clinica 24/7', 'Peluqueria']

const pointsOfInterest = [
  {
    name: 'Fundacion Veterinaria Felican',
    type: 'Veterinaria',
    address: 'Cra. 3 #26-55, Pereira, Risaralda',
    phone: '3046238991',
    schedule: 'Lun - Vie: 9:00 a.m. - 18:30 p.m.',
    services: ['Urgencias', 'Hospitalizacion', 'Cirugia', 'Examenes'],
    mapLink: 'https://www.google.com/maps/place/Veterinaria+Felican/@4.8150274,-75.7083111,17z/data=!3m1!4b1!4m6!3m5!1s0x8e388743069b2015:0x13be94066c5499a1!8m2!3d4.8150221!4d-75.7057362!16s%2Fg%2F11ghlk5mm_?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D',
    distance: 'Pereira - Av. 30 de Agosto',
    image: 'https://lh3.googleusercontent.com/p/AF1QipN1FQLCnDKl7D1wz3nVxImwZB4fYumSPvzk1GsV=w408-h306-k-no'
  },
  {
    name: 'Veterinaria San Francisco',
    type: 'Veterinaria',
    address: 'Cl. 69 #25-23, Pereira, Risaralda',
    phone: '63272739',
    schedule: 'Lun - Sab: 8:00 a.m. - 8:00 p.m.',
    services: ['Consultas', 'Vacunas', 'Laboratorio'],
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Clinica+Veterinaria+San+Francisco+Pereira',
    distance: 'Cuba, Pereira',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwlRcFjLxtCO7qapYWG7t24WkUtleZPdWr7xGHOauxtvPReFs3FNiqNsvGSjJRBsFmuPtXyYbDhPYCxyx1pS8amakfYiYx43wgYN3XFdg_AuP-NCfWmVIfMYgEEsYzgLQTGFWK_6TKnGjsZ=w408-h725-k-no'
  },
  {
    name: 'Veterinaria Dosquebradas EPS mascotas 24 horas',
    type: 'Clinica 24/7',
    address: 'Cl. 33 #10-54, Dosquebradas, Risaralda',
    phone: '3225441116',
    schedule: 'Abierto las 24 horas',
    services: ['Cirugia', 'Imagenologia', 'Farmacia'],
    mapLink: 'https://www.google.com/maps/place/Veterinaria+Dosquebradas+EPS+mascotas+24+horas/@4.8365372,-75.6778207,17.25z/data=!4m9!1m2!2m1!1sVeterinaria+La+Pradera+Dosquebradas!3m5!1s0x8e3881e515897667:0x75f0f6ed889418cf!8m2!3d4.8373271!4d-75.6759105!16s%2Fg%2F11kxnlhfy1?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D',
    distance: 'Dosquebradas - La Pradera',
    image: 'https://lh3.googleusercontent.com/p/AF1QipMj4qXBdPWo4CrSPyGVPWmVYVf6RRLhtDyf6M9p=w408-h244-k-no'
  },
  {
    name: 'Asvet Clinica Veterinaria',
    type: 'Clinica 24/7',
    address: 'Cra. 12b #8-48, Pereira, Risaralda',
    phone: '3007493929',
    schedule: 'Abierto las 24 horas',
    services: ['Emergencias', 'Hospitalizacion', 'Rayos X'],
    mapLink: 'https://www.google.com/maps/place/Asvet+Cl%C3%ADnica+Veterinaria/@4.8105483,-75.6941165,15.5z/data=!4m10!1m2!2m1!1sclinica+24%2F7+mascotas+pereira!3m6!1s0x8e38870032c3c381:0x9ae9e1964c056db2!8m2!3d4.808318!4d-75.6859568!15sCh1jbGluaWNhIDI0LzcgbWFzY290YXMgcGVyZWlyYVofIh1jbGluaWNhIDI0IDcgbWFzY290YXMgcGVyZWlyYZIBHmVtZXJnZW5jeV92ZXRlcmluYXJpYW5fc2VydmljZZoBJENoZERTVWhOTUc5blMwVkpRMEZuVFVSbmNUVjJVSE5CUlJBQqoBawoIL20vMDY4aHkQASoZIhVjbGluaWNhIDI0IDcgbWFzY290YXMoDjIfEAEiGxKRbk2IFiCP1_jSJOQewYpCPndRSyJQcMLRmTIhEAIiHWNsaW5pY2EgMjQgNyBtYXNjb3RhcyBwZXJlaXJh4AEA-gEECAAQQw!16s%2Fg%2F11y9rt0lsr?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D',
    distance: 'Los Alpes, Pereira',
    image: 'https://lh3.googleusercontent.com/p/AF1QipO_F09sJ_Yv-EISVK-scSwBgX2yAWpzz7NViEMF=w408-h544-k-no'
  },
  {
    name: 'Pet Canino',
    type: 'Peluqueria',
    address: 'Cra. 24 #8-30, Dosquebradas, Risaralda',
    phone: '3137665056',
    schedule: 'Lun - Sab: 9:00 a.m. - 16:00 p.m.',
    services: ['Bano y corte'],
    mapLink: 'https://www.google.com/maps/place/Pet+Canino/@4.8178566,-75.686547,16.25z/data=!4m10!1m2!2m1!1sestetica+caninos+dosquebradas!3m6!1s0x8e38872e19402c6b:0x3474d6da0f58a74f!8m2!3d4.8166844!4d-75.6785378!15sCh1lc3RldGljYSBjYW5pbm9zIGRvc3F1ZWJyYWRhc1ofIh1lc3RldGljYSBjYW5pbm9zIGRvc3F1ZWJyYWRhc5IBC3BldF9ncm9vbWVymgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVU5rT0V3ek1VNTNFQUWqAWUKBy9tLzB4MHcQASoUIhBlc3RldGljYSBjYW5pbm9zKA4yHxABIhsZnRpEVZdf3jF6EMgWjD0VcxC8Uj9jrCdoM3YyIRACIh1lc3RldGljYSBjYW5pbm9zIGRvc3F1ZWJyYWRhc-ABAPoBBAgAEDI!16s%2Fg%2F11c2jn2h53?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D',
    distance: 'La Sultana, Dosquebradas',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwVJayJd8DHtuU-o63DvoegdwoRfnhaW7gIS4qh69nFhXKloTOd6Wq2zDU094hZIkRm8T2rqyTVV55ICVqvVXznbcymWPcAiWkrRGO9ULoZtWfTwYe-9ZU15ma7LjY7DSpUXOznRA=w408-h544-k-no'
  },
  {
    name: 'Dido Veterinaria Circunvalar',
    type: 'Veterinaria',
    address: 'Av. Circunvalar #10 75, Pereira, Risaralda',
    phone: '(606) 3111604',
    schedule: 'Lun - Sab: 9:00 a.m. - 18:00 p.m.',
    services: ['Farmacia', 'Consultas', 'Pet Shop'],
    mapLink: 'https://www.google.com/maps/place/Dido+Veterinaria+Circunvalar/@4.8081875,-75.6970561,16z/data=!4m10!1m2!2m1!1sVeterinaria+circunvalar!3m6!1s0x8e3887bc7ef948c1:0x2c3bb8536fa47dd3!8m2!3d4.8081764!4d-75.6878822!15sChdWZXRlcmluYXJpYSBjaXJjdW52YWxhcloZIhd2ZXRlcmluYXJpYSBjaXJjdW52YWxhcpIBEHBldF9zdXBwbHlfc3RvcmWaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUkdkMHBmTVVOQkVBRaoBURABKg8iC3ZldGVyaW5hcmlhKA4yHxABIhtQabzIE3llEp0Pgf_uOLtXjoI33BcDcuxMfH8yGxACIhd2ZXRlcmluYXJpYSBjaXJjdW52YWxhcuABAPoBBAgAEDs!16s%2Fg%2F11j79x98g8?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D',
    distance: 'Pereira - Av. Circunvalar',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwOzHIdK_lDSS9s9PMRBue7fa-hpAbXH1g4YivO-n_3TplblCJmEVwU6oY6mUyJ5IcJ2szUUPXyZL09tZ1vn0_HdKIbx0v9pc7JWxaH2M_qsRlDo-X0_FUDXlsE3cNxz_MzicPb=w426-h240-k-no'
  },
  {
    name: 'Estetica Canina y Felina Medbiovet',
    type: 'Peluqueria',
    address: 'Cra. 11 #31-33, Pereira, Risaralda',
    phone: '3148751874',
    schedule: 'Lun - Sab: 8:00 a.m. - 16:00 p.m.',
    services: ['Bano y corte', 'Spa', 'Desenredo'],
    mapLink: 'https://www.google.com/maps/place/Estetica+Canina+y+Felina+Medbiovet/@4.8123303,-75.7230413,15z/data=!4m10!1m2!2m1!1sPeluqueria+Canica+Pereira!3m6!1s0x8e38879b1acc5655:0x3d1825d5ae1ab7bd!8m2!3d4.8123308!4d-75.7050171!15sChlQZWx1cXVlcmlhIENhbmluYSBQZXJlaXJhkgELcGV0X2dyb29tZXKqAXAKCi9tLzA0Z2gzOXEKCS9tLzA1al9rZBABKhUiEXBlbHVxdWVyaWEgY2FuaW5hKA4yHxABIhs5mZCD1m7i-NbYicnPA-6RE9j2BJw9oGB5et0yHRACIhlwZWx1cXVlcmlhIGNhbmluYSBwZXJlaXJh4AEA!16s%2Fg%2F11t3c_lj29?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D',
    distance: 'Pereira - Av. 30 de Agosto',
    image: 'https://lh3.googleusercontent.com/p/AF1QipMMr3CWH9bm5ndCO-l6UPT0ud0ayO-hoto7jf0L=w408-h544-k-no'
  },
  {
    name: 'El Granjero Clinica Veterinaria 24 horas',
    type: 'Clinica 24/7',
    address: 'Cra 15b, Inducentro Guadalupe #40 -18, Dosquebradas, Risaralda',
    phone: '3113244660',
    schedule: 'Abierto las 24 horas',
    services: ['Cirugia', 'Imagenologia', 'Farmacia'],
    mapLink: 'https://www.google.com/maps/place/El+Granjero+Cl%C3%ADnica+Veterinaria+24+horas/@4.8359585,-75.6726727,18z/data=!4m10!1m2!2m1!1sclinica+24%2F7+mascotas+pereira!3m6!1s0x8e3881defc6b09ff:0xd8faa50713404463!8m2!3d4.8359585!4d-75.6704196!15sCh1jbGluaWNhIDI0LzcgbWFzY290YXMgcGVyZWlyYVofIh1jbGluaWNhIDI0IDcgbWFzY290YXMgcGVyZWlyYZIBHmVtZXJnZW5jeV92ZXRlcmluYXJpYW5fc2VydmljZZoBRENpOURRVWxSUVVOdlpFTm9kSGxqUmpsdlQydHNWRkl6VmxSalZsWndaVVJhTVdSc1JsaFdiVVl3VkZWamVGRXdSUkFCqgFrCggvbS8wNjhoeRABKhkiFWNsaW5pY2EgMjQgNyBtYXNjb3RhcygOMh8QASIbEpFuTYgWII_X-NIk5B7BikI-d1FLIlBwwtGZMiEQAiIdY2xpbmljYSAyNCA3IG1hc2NvdGFzIHBlcmVpcmHgAQD6AQQIABA2!16s%2Fg%2F11by_l37hp?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D',
    distance: 'El Progreso, Dosquebradas',
    image: 'https://clinicaelgranjero.com/wp-content/uploads/2023/10/IMG_9223.png'
  }
]

function Servicios() {
  const [selectedType, setSelectedType] = useState('Todos')

  const filteredPoints = useMemo(() => {
    if (selectedType === 'Todos') {
      return pointsOfInterest
    }
    return pointsOfInterest.filter(point => point.type === selectedType)
  }, [selectedType])

  const formatPhoneForTel = (phone) => phone.replace(/[^\d+]/g, '')

  return (
    <div className="services-page">
      <BackHomeButton />
      <section className="services-hero">
        <div className="services-hero-content">
          <p className="services-kicker">Servicios cercanos</p>
          <h1>Puntos de interes para tu mascota</h1>
          <p className="services-subtitle">
            Encuentra veterinarias, clinicas, farmacias y peluquerias con direcciones verificadas para que llegues rapido.
          </p>
          <div className="services-actions">
            <a
              href="https://www.google.com/maps/search/?api=1&query=veterinaria+cercana"
              target="_blank"
              rel="noreferrer"
              className="services-action primary"
            >
              <Navigation size={18} />
              <span>Abrir en Google Maps</span>
            </a>
            <a href="#listado-servicios" className="services-action ghost">
              <MapPin size={18} />
              <span>Ver listado</span>
            </a>
          </div>
        </div>

        <div className="services-hero-panel">
          <div className="services-stat">
            <HeartPulse size={20} />
            <div>
              <p className="stat-label">Emergencias 24/7</p>
              <p className="stat-value">Veterinarias disponibles</p>
            </div>
          </div>
          <div className="services-stat">
            <Shield size={20} />
            <div>
              <p className="stat-label">Ubicaciones confiables</p>
              <p className="stat-value">Curadas por PetMatch</p>
            </div>
          </div>
          <div className="services-stat">
            <Clock size={20} />
            <div>
              <p className="stat-label">Horarios actualizados</p>
              <p className="stat-value">Revisa antes de salir</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services-filters" aria-label="Filtro de servicios">
        <div className="filter-header">
          <div>
            <h2>Filtra por tipo de servicio</h2>
            <p>Selecciona el punto que necesitas visitar hoy.</p>
          </div>
          <span className="filter-count">
            {filteredPoints.length} resultados
          </span>
        </div>
        <div className="filter-chips">
          {typeFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`filter-chip ${selectedType === filter ? 'active' : ''}`}
              onClick={() => setSelectedType(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="poi-section" id="listado-servicios">
        {filteredPoints.length === 0 ? (
          <div className="services-empty">
            <p>No hay puntos para este filtro.</p>
            <button type="button" onClick={() => setSelectedType('Todos')} className="services-action primary">
              Ver todos los servicios
            </button>
          </div>
        ) : (
          <div className="poi-grid">
            {filteredPoints.map((point) => (
              <article key={point.name} className="poi-card">
                <div className="poi-image-wrapper">
                  <img src={point.image} alt={`Foto de ${point.name}`} className="poi-image" loading="lazy" />
                  <span className="poi-type-badge">{point.type}</span>
                </div>

                <div className="poi-head">
                  <div>
                    <h3 className="poi-name">{point.name}</h3>
                    <p className="poi-distance">{point.distance}</p>
                  </div>
                </div>

                <p className="poi-address">
                  <MapPin size={16} />
                  <span>{point.address}</span>
                </p>

                <div className="poi-meta">
                  <div className="poi-meta-item">
                    <Phone size={16} />
                    <a href={`tel:${formatPhoneForTel(point.phone)}`}>{point.phone}</a>
                  </div>
                  <div className="poi-meta-item">
                    <Clock size={16} />
                    <span>{point.schedule}</span>
                  </div>
                </div>

                <div className="poi-tags">
                  {point.services.map((service) => (
                    <span key={service} className="poi-tag">
                      {service}
                    </span>
                  ))}
                </div>

                <div className="poi-actions">
                  <a
                    href={point.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="poi-link"
                  >
                    <Navigation size={16} />
                    <span>Ver en mapa</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Servicios
