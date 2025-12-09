import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePets } from '../context/PetContext';
import { useAuth } from '../context/AuthContext';
import { Dog, Cat, Plus, Calendar, Weight, AlertCircle } from 'lucide-react';
import './PetProfileList.css';

function PetProfileList() {
  const { pets, loading, error, deletePet } = usePets();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (petId, petName) => {
    if (!confirm(`¿Estás seguro de eliminar el perfil de ${petName}?`)) {
      return;
    }

    setDeletingId(petId);
    const success = await deletePet(petId);
    
    if (!success) {
      alert('Error al eliminar la mascota');
    }
    setDeletingId(null);
  };

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

  const canAddMorePets = () => {
    if (user?.isPremium) return true;
    return pets.length < 2;
  };

  if (loading) {
    return (
      <div className="pet-list-container">
        <div className="loading-message">Cargando mascotas...</div>
      </div>
    );
  }

  return (
    <div className="pet-list-container">
      <div className="pet-list-header">
        <h1>Mis Mascotas</h1>
        {!user?.isPremium && (
          <p className="premium-hint">
            <AlertCircle size={16} />
            Usuarios gratuitos: máximo 2 mascotas. 
            <Link to="/premium" className="upgrade-link">Actualiza a Premium</Link> para mascotas ilimitadas.
          </p>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="pet-list-actions">
        {canAddMorePets() ? (
          <Link to="/pets/new" className="add-pet-btn">
            <Plus size={20} />
            Agregar Nueva Mascota
          </Link>
        ) : (
          <button className="add-pet-btn disabled" disabled>
            <Plus size={20} />
            Límite alcanzado - Actualiza a Premium
          </button>
        )}
      </div>

      {pets.length === 0 ? (
        <div className="empty-state">
          <Dog size={64} className="empty-icon" />
          <h2>No tienes mascotas registradas</h2>
          <p>Agrega el perfil de tu mascota para obtener recomendaciones personalizadas</p>
          {canAddMorePets() && (
            <Link to="/pets/new" className="empty-action-btn">
              Agregar mi primera mascota
            </Link>
          )}
        </div>
      ) : (
        <div className="pet-cards-grid">
          {pets.map(pet => (
            <div key={pet.id} className="pet-card">
              <div className="pet-card-header">
                {pet.photo ? (
                  <img src={pet.photo} alt={pet.name} className="pet-photo" />
                ) : (
                  <div className="pet-photo-placeholder">
                    {pet.type === 'perro' ? <Dog size={48} /> : <Cat size={48} />}
                  </div>
                )}
                <div className="pet-basic-info">
                  <h3>{pet.name}</h3>
                  <p className="pet-breed">{pet.breed || 'Raza no especificada'}</p>
                </div>
              </div>

              <div className="pet-card-details">
                <div className="pet-detail-item">
                  <Calendar size={16} />
                  <span>
                    {pet.birthDate 
                      ? calculateAge(pet.birthDate) || 'Edad desconocida'
                      : 'Edad no especificada'}
                  </span>
                </div>
                {pet.weight && (
                  <div className="pet-detail-item">
                    <Weight size={16} />
                    <span>{pet.weight} kg</span>
                  </div>
                )}
                <div className="pet-detail-item">
                  <span className="pet-type-badge">
                    {pet.type === 'perro' ? '🐶 Perro' : '🐱 Gato'}
                  </span>
                </div>
              </div>

              {pet.specialNeeds && (
                <div className="pet-special-needs">
                  <AlertCircle size={14} />
                  <span>{pet.specialNeeds}</span>
                </div>
              )}

              <div className="pet-card-actions">
                <Link to={`/pets/${pet.id}`} className="pet-action-btn primary">
                  Ver Perfil
                </Link>
                <Link to={`/pets/${pet.id}/edit`} className="pet-action-btn secondary">
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(pet.id, pet.name)}
                  className="pet-action-btn danger"
                  disabled={deletingId === pet.id}
                >
                  {deletingId === pet.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PetProfileList;
