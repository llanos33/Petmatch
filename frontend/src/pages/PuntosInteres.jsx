import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Phone, Clock, Star, Search, Filter } from 'lucide-react'
import './PuntosInteres.css'

const PUNTOS_INTERES = [
  // Veterinarias
  {
    id: 1,
    tipo: 'veterinaria',
    nombre: 'Veterinaria San Francisco',
    direccion: 'Cl. 69 #25-23, Pereira, Risaralda',
    telefono: '63272739',
    horario: 'Lun-Vie: 9:15 AM - 5:30 PM, Sáb: 9:00 AM - 5:00 PM',
    calificacion: 4.6,
    servicios: ['Consulta general', 'Vacunación', 'Cirugía', 'Emergencias 24h'],
    imagen: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSy-euBmPObHveytB6xf0GKYDMBUbF3e7N54KxtBXAMGLF0CL6Bfpn3PWxCeZNC-RoUR4WgPzth1WkyKXqcWmmO9xnPzzX-ck721ZwyH-2PmTSFbcVNV59r5u9lU0RVbGYDnF0EoLhhfGSH0=w408-h725-k-no'
  },
  {
    id: 2,
    tipo: 'veterinaria',
    nombre: 'Clínica Veterinaria El Refugio',
    direccion: 'Cl. 128 #59A-26, Suba, Bogotá',
    telefono: '601 555 5678',
    horario: 'Lun-Dom: 24 horas',
    calificacion: 4.9,
    servicios: ['Emergencias 24h', 'Hospitalización', 'Rayos X', 'Laboratorio'],
    imagen: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=cDAYeAHIWG0f82GYmop5IQ&cb_client=search.gws-prod.gps&w=408&h=240&yaw=15.437361&pitch=0&thumbfov=100'
  },
  {
    id: 3,
    tipo: 'veterinaria',
    nombre: 'VetCare Especialistas',
    direccion: 'Cl. 14 #84A-17, Comuna 17, Cali, Valle del Cauca',
    telefono: '601 555 9012',
    horario: 'Lun-Vie: 7:00 AM - 8:00 PM, Sáb: 8:00 AM - 6:00 PM',
    calificacion: 4.7,
    servicios: ['Cardiología', 'Dermatología', 'Odontología', 'Cirugía especializada'],
    imagen: 'https://lh3.googleusercontent.com/p/AF1QipMPQ3cfzcctuQfXAyA7_4HNpD3jx6mfeuMxL2In=w408-h544-k-no'
  },
  // Clínicas
  {
    id: 4,
    tipo: 'clinica',
    nombre: 'Clínica Veterinaria Patitas Felices',
    direccion: 'Cra. 83a #15-110, Comuna 17, Cali, Valle del Cauca',
    telefono: '601 555 3456',
    horario: 'Lun-Sáb: 8:00 AM - 6:00 PM',
    calificacion: 4.6,
    servicios: ['Consulta general', 'Vacunación', 'Desparasitación', 'Baño medicado'],
    imagen: 'https://lh3.googleusercontent.com/p/AF1QipNlbK1HsQmMQPHaGXfWuQN_gqZS6GwAca77LAev=w426-h240-k-no'
  },
  {
    id: 5,
    tipo: 'clinica',
    nombre: 'Clinica veterinaria la Zona animal',
    direccion: 'Av. 30 de Agosto #35-75, Pereira, Risaralda',
    telefono: '601 555 7890',
    horario: 'Lun-Vie: 9:00 AM - 6:00 PM',
    calificacion: 4.5,
    servicios: ['Consulta', 'Vacunas', 'Peluquería', 'Guardería'],
    imagen: 'https://lh3.googleusercontent.com/p/AF1QipOdOvq44GTFuAzlFtqCTR_W2tLyjVoihZf07JY8=w426-h240-k-no'
  },
  // Peluquerías
  {
    id: 6,
    tipo: 'peluqueria',
    nombre: 'Animal Glamour Peluquería',
    direccion: 'Balalaika, Cra. 16 #26 65, Dosquebradas, Risaralda',
    telefono: '3226540591',
    horario: 'Mar-Sáb: 9:00 AM - 6:00 PM',
    calificacion: 4.9,
    servicios: ['Baño', 'Corte', 'Tinte', 'Spa', 'Arreglo de uñas'],
    imagen: 'https://lh3.googleusercontent.com/p/AF1QipM59SGyayJcJLwwbT6RK2p9iyd3qajg1xKOylcO=w408-h544-k-no'
  },
  {
    id: 7,
    tipo: 'peluqueria',
    nombre: 'Luxury Pets',
    direccion: 'Mall Sky Plaza, Tv 10 #14-25 Local 10, Dosquebradas, Risaralda',
    telefono: '3006456853',
    horario: 'Lun-Sáb: 10:00 AM - 7:00 PM',
    calificacion: 4.8,
    servicios: ['Baño', 'Corte especializado', 'Spa', 'Masajes', 'Aromaterapia'],
    imagen: 'https://lh3.googleusercontent.com/p/AF1QipNYo0Dlln9iKKUGYJ_sMzInhLuBkZofnPWKAuHu=w426-h240-k-no'
  },
  {
    id: 8,
    tipo: 'peluqueria',
    nombre: 'Pelos y Colas Estética Canina y Felina',
    direccion: 'Cl 1 #9-33, Comuna Oriente, Pereira, Risaralda',
    telefono: '3175038701',
    horario: 'Lun-Vie: 8:00 AM - 6:00 PM, Sáb: 9:00 AM - 4:00 PM',
    calificacion: 4.7,
    servicios: ['Baño', 'Corte', 'Limpieza dental', 'Corte de uñas'],
    imagen: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxFkBOo3w3BCz3dEFGfqqZEFCM-a9-m9ZpRjec1AzF5Xzh84yt7Ztlw3PEblqNfQ4ODw23OJvQv5TuuMxlHtlX6hW9TGs4lFeeggf27JBRoqc7tAzU9tHwECleMLiWPsDXbVvY=w408-h725-k-no'
  }
]

const TIPO_LABELS = {
  veterinaria: 'Veterinaria',
  clinica: 'Clínica',
  peluqueria: 'Peluquería'
}

export default function PuntosInteres() {
  const [searchParams] = useSearchParams()
  const tipoParam = searchParams.get('tipo')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    if (tipoParam && ['veterinaria', 'clinica', 'peluqueria'].includes(tipoParam)) {
      setFiltroTipo(tipoParam)
    }
  }, [tipoParam])

  const puntosFiltrados = PUNTOS_INTERES.filter(punto => {
    const coincideTipo = filtroTipo === 'todos' || punto.tipo === filtroTipo
    const coincideBusqueda = busqueda === '' || 
      punto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      punto.direccion.toLowerCase().includes(busqueda.toLowerCase())
    
    return coincideTipo && coincideBusqueda
  })

  return (
    <div className="puntos-interes-page">
      <div className="puntos-header">
        <h1>
          <MapPin size={32} />
          Puntos de Interés
        </h1>
        <p className="puntos-subtitle">
          Encuentra veterinarias, clínicas y peluquerías cerca de ti
        </p>
      </div>

      <div className="puntos-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filtroTipo === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('todos')}
          >
            <Filter size={18} />
            Todos
          </button>
          <button
            className={`filter-btn ${filtroTipo === 'veterinaria' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('veterinaria')}
          >
            Veterinarias
          </button>
          <button
            className={`filter-btn ${filtroTipo === 'clinica' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('clinica')}
          >
            Clínicas
          </button>
          <button
            className={`filter-btn ${filtroTipo === 'peluqueria' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('peluqueria')}
          >
            Peluquerías
          </button>
        </div>
      </div>

      <div className="puntos-grid">
        {puntosFiltrados.map(punto => (
          <div key={punto.id} className="punto-card">
            <div className="punto-imagen">
              <img src={punto.imagen} alt={punto.nombre} />
              <div className="punto-tipo-badge">{TIPO_LABELS[punto.tipo]}</div>
            </div>
            
            <div className="punto-content">
              <div className="punto-header">
                <h3>{punto.nombre}</h3>
                <div className="punto-rating">
                  <Star size={16} fill="currentColor" />
                  <span>{punto.calificacion}</span>
                </div>
              </div>

              <div className="punto-info">
                <div className="punto-info-item">
                  <MapPin size={18} />
                  <span>{punto.direccion}</span>
                </div>
                <div className="punto-info-item">
                  <Phone size={18} />
                  <span>{punto.telefono}</span>
                </div>
                <div className="punto-info-item">
                  <Clock size={18} />
                  <span>{punto.horario}</span>
                </div>
              </div>

              <div className="punto-servicios">
                <h4>Servicios:</h4>
                <ul>
                  {punto.servicios.map((servicio, idx) => (
                    <li key={idx}>{servicio}</li>
                  ))}
                </ul>
              </div>

              <div className="punto-actions">
                <a 
                  href={`https://www.google.com/maps/search/${encodeURIComponent(punto.direccion)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ver-mapa"
                >
                  <MapPin size={18} />
                  Ver en mapa
                </a>
                <a 
                  href={`tel:${punto.telefono.replace(/\s/g, '')}`}
                  className="btn-llamar"
                >
                  <Phone size={18} />
                  Llamar
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {puntosFiltrados.length === 0 && (
        <div className="no-resultados">
          <MapPin size={48} />
          <p>No se encontraron puntos de interés con los filtros seleccionados</p>
        </div>
      )}
    </div>
  )
}
