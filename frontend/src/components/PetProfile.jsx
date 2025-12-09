import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePets } from '../context/PetContext';
import { 
  Dog, Cat, Calendar, Weight, Activity, Heart, Syringe, 
  Pill, AlertCircle, Edit, ArrowLeft, User, Sparkles 
} from 'lucide-react';
import './PetProfile.css';

function PetProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPetById, fetchPets } = usePets();
  
  const pet = getPetById(id);

  useEffect(() => {
    if (!pet) {
      fetchPets();
    }
  }, [pet, fetchPets]);

  if (!pet) {
    return (
      <div className="pet-profile-container">
        <div className="not-found">
          <AlertCircle size={64} />
          <h2>Mascota no encontrada</h2>
          <Link to="/pets" className="back-link">Volver a mis mascotas</Link>
        </div>
      </div>
    );
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years === 0) {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else if (months < 0) {
      return `${years - 1} ${years - 1 === 1 ? 'año' : 'años'}`;
    } else {
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getActivityLevelText = (level) => {
    const levels = {
      low: 'Bajo - Prefiere descansar',
      medium: 'Medio - Activo moderado',
      high: 'Alto - Muy enérgico'
    };
    return levels[level] || level;
  };

  return (
    <div className="pet-profile-container">
      <div className="pet-profile-header">
        <button onClick={() => navigate('/pets')} className="back-button">
          <ArrowLeft size={20} />
          Volver
        </button>
        <Link to={`/pets/${pet.id}/edit`} className="edit-button">
          <Edit size={20} />
          Editar Perfil
        </Link>
      </div>

      <div className="pet-profile-hero">
        {pet.photo ? (
          <img src={pet.photo} alt={pet.name} className="pet-hero-photo" />
        ) : (
          <div className="pet-hero-placeholder">
            {pet.type === 'perro' ? <Dog size={80} /> : <Cat size={80} />}
          </div>
        )}
        <div className="pet-hero-info">
          <h1>{pet.name}</h1>
          <p className="pet-hero-breed">{pet.breed || 'Raza no especificada'}</p>
          <span className="pet-type-badge">
            {pet.type === 'perro' ? '🐶 Perro' : '🐱 Gato'}
          </span>
        </div>
      </div>

      <div className="pet-profile-content">
        {/* Información General */}
        <section className="profile-section">
          <h2>
            <User size={24} />
            Información General
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">
                <Calendar size={18} />
                Edad
              </span>
              <span className="info-value">
                {pet.birthDate ? calculateAge(pet.birthDate) || 'Desconocida' : 'No especificada'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Género</span>
              <span className="info-value">{pet.gender || 'No especificado'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <Weight size={18} />
                Peso
              </span>
              <span className="info-value">{pet.weight ? `${pet.weight} kg` : 'No especificado'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <Activity size={18} />
                Nivel de Actividad
              </span>
              <span className="info-value">{getActivityLevelText(pet.activityLevel)}</span>
            </div>
          </div>
          {pet.specialNeeds && (
            <div className="special-needs-banner">
              <AlertCircle size={20} />
              <div>
                <strong>Necesidades Especiales:</strong>
                <p>{pet.specialNeeds}</p>
              </div>
            </div>
          )}
        </section>

        {/* Información Médica */}
        <section className="profile-section">
          <h2>
            <Heart size={24} />
            Información Médica
          </h2>
          
          {pet.medicalInfo?.allergies?.length > 0 && (
            <div className="medical-item">
              <h3>
                <AlertCircle size={18} />
                Alergias
              </h3>
              <div className="tag-list">
                {pet.medicalInfo.allergies.map((allergy, index) => (
                  <span key={index} className="tag tag-warning">{allergy}</span>
                ))}
              </div>
            </div>
          )}

          {pet.medicalInfo?.vaccinations?.length > 0 && (
            <div className="medical-item">
              <h3>
                <Syringe size={18} />
                Vacunas
              </h3>
              <div className="tag-list">
                {pet.medicalInfo.vaccinations.map((vaccine, index) => (
                  <span key={index} className="tag tag-success">{vaccine}</span>
                ))}
              </div>
            </div>
          )}

          {pet.medicalInfo?.medications?.length > 0 && (
            <div className="medical-item">
              <h3>
                <Pill size={18} />
                Medicamentos Actuales
              </h3>
              <div className="tag-list">
                {pet.medicalInfo.medications.map((med, index) => (
                  <span key={index} className="tag tag-info">{med}</span>
                ))}
              </div>
            </div>
          )}

          {pet.medicalInfo?.conditions?.length > 0 && (
            <div className="medical-item">
              <h3>Condiciones Médicas</h3>
              <div className="tag-list">
                {pet.medicalInfo.conditions.map((condition, index) => (
                  <span key={index} className="tag tag-danger">{condition}</span>
                ))}
              </div>
            </div>
          )}

          {pet.medicalInfo?.veterinarian && (
            <div className="medical-item">
              <h3>Veterinario</h3>
              <p>{pet.medicalInfo.veterinarian}</p>
            </div>
          )}

          <div className="checkup-dates">
            <div className="checkup-item">
              <span className="checkup-label">Último Chequeo:</span>
              <span className="checkup-date">{formatDate(pet.medicalInfo?.lastCheckup)}</span>
            </div>
            <div className="checkup-item">
              <span className="checkup-label">Próximo Chequeo:</span>
              <span className="checkup-date">{formatDate(pet.medicalInfo?.nextCheckup)}</span>
            </div>
          </div>
        </section>

        {/* Preferencias */}
        <section className="profile-section">
          <h2>
            <Sparkles size={24} />
            Preferencias y Gustos
          </h2>

          {pet.preferences?.favoriteFood?.length > 0 && (
            <div className="preference-item">
              <h3>Comidas Favoritas</h3>
              <div className="tag-list">
                {pet.preferences.favoriteFood.map((food, index) => (
                  <span key={index} className="tag tag-favorite">❤️ {food}</span>
                ))}
              </div>
            </div>
          )}

          {pet.preferences?.favoriteToys?.length > 0 && (
            <div className="preference-item">
              <h3>Juguetes Favoritos</h3>
              <div className="tag-list">
                {pet.preferences.favoriteToys.map((toy, index) => (
                  <span key={index} className="tag tag-favorite">🎾 {toy}</span>
                ))}
              </div>
            </div>
          )}

          {pet.preferences?.dislikes?.length > 0 && (
            <div className="preference-item">
              <h3>No Le Gusta</h3>
              <div className="tag-list">
                {pet.preferences.dislikes.map((dislike, index) => (
                  <span key={index} className="tag tag-dislike">❌ {dislike}</span>
                ))}
              </div>
            </div>
          )}

          {(!pet.preferences?.favoriteFood?.length && 
            !pet.preferences?.favoriteToys?.length && 
            !pet.preferences?.dislikes?.length) && (
            <p className="no-data">No hay preferencias registradas aún.</p>
          )}
        </section>

        {/* Recomendaciones Personalizadas */}
        <section className="profile-section recommendations">
          <h2>
            <Sparkles size={24} />
            Recomendaciones para {pet.name}
          </h2>
          <p className="recommendations-intro">
            Basado en el perfil de {pet.name}, te sugerimos explorar productos específicos para {pet.type}s.
          </p>
          <div className="recommendation-links">
            <Link to={`/category/Alimentos?petType=${pet.type}`} className="recommendation-card">
              <span>🍖</span>
              <div>
                <strong>Alimentos</strong>
                <p>Para {pet.type}s</p>
              </div>
            </Link>
            <Link to={`/category/Juguetes?petType=${pet.type}`} className="recommendation-card">
              <span>🎾</span>
              <div>
                <strong>Juguetes</strong>
                <p>Diversión garantizada</p>
              </div>
            </Link>
            <Link to={`/category/Medicamentos?petType=${pet.type}`} className="recommendation-card">
              <span>💊</span>
              <div>
                <strong>Salud</strong>
                <p>Cuidado médico</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PetProfile;
