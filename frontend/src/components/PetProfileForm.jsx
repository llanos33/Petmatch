import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePets } from '../context/PetContext';
import { Dog, Cat, Save, X, Calendar, Weight, Activity, Heart, Syringe, Pill } from 'lucide-react';
import './PetProfileForm.css';

function PetProfileForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPet, updatePet, getPetById, fetchPets, loading, error } = usePets();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    type: 'perro',
    breed: '',
    birthDate: '',
    gender: '',
    weight: '',
    photo: '',
    activityLevel: 'medium',
    specialNeeds: '',
    allergies: '',
    vaccinations: '',
    medications: '',
    conditions: '',
    veterinarian: '',
    lastCheckup: '',
    nextCheckup: '',
    favoriteFood: '',
    favoriteToys: '',
    dislikes: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const pet = getPetById(id);
      if (pet) {
        setFormData({
          name: pet.name || '',
          type: pet.type || 'perro',
          breed: pet.breed || '',
          birthDate: pet.birthDate || '',
          gender: pet.gender || '',
          weight: pet.weight || '',
          photo: pet.photo || '',
          activityLevel: pet.activityLevel || 'medium',
          specialNeeds: pet.specialNeeds || '',
          allergies: pet.medicalInfo?.allergies?.join(', ') || '',
          vaccinations: pet.medicalInfo?.vaccinations?.join(', ') || '',
          medications: pet.medicalInfo?.medications?.join(', ') || '',
          conditions: pet.medicalInfo?.conditions?.join(', ') || '',
          veterinarian: pet.medicalInfo?.veterinarian || '',
          lastCheckup: pet.medicalInfo?.lastCheckup || '',
          nextCheckup: pet.medicalInfo?.nextCheckup || '',
          favoriteFood: pet.preferences?.favoriteFood?.join(', ') || '',
          favoriteToys: pet.preferences?.favoriteToys?.join(', ') || '',
          dislikes: pet.preferences?.dislikes?.join(', ') || ''
        });
      } else {
        fetchPets();
      }
    }
  }, [id, isEditing, getPetById, fetchPets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.type) {
      alert('Nombre y tipo de mascota son obligatorios');
      return;
    }

    setSubmitting(true);

    // Convertir strings separados por comas en arrays
    const petData = {
      name: formData.name.trim(),
      type: formData.type,
      breed: formData.breed.trim(),
      birthDate: formData.birthDate || null,
      gender: formData.gender,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      photo: formData.photo.trim(),
      activityLevel: formData.activityLevel,
      specialNeeds: formData.specialNeeds.trim(),
      medicalInfo: {
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        vaccinations: formData.vaccinations ? formData.vaccinations.split(',').map(s => s.trim()).filter(Boolean) : [],
        medications: formData.medications ? formData.medications.split(',').map(s => s.trim()).filter(Boolean) : [],
        conditions: formData.conditions ? formData.conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
        veterinarian: formData.veterinarian.trim(),
        lastCheckup: formData.lastCheckup || null,
        nextCheckup: formData.nextCheckup || null
      },
      preferences: {
        favoriteFood: formData.favoriteFood ? formData.favoriteFood.split(',').map(s => s.trim()).filter(Boolean) : [],
        favoriteToys: formData.favoriteToys ? formData.favoriteToys.split(',').map(s => s.trim()).filter(Boolean) : [],
        dislikes: formData.dislikes ? formData.dislikes.split(',').map(s => s.trim()).filter(Boolean) : []
      }
    };

    let result;
    if (isEditing) {
      result = await updatePet(parseInt(id), petData);
    } else {
      result = await addPet(petData);
    }

    setSubmitting(false);

    if (result) {
      navigate('/pets');
    } else {
      alert(error || 'Error al guardar la mascota');
    }
  };

  return (
    <div className="pet-form-container">
      <div className="pet-form-header">
        <h1>{isEditing ? 'Editar Mascota' : 'Agregar Nueva Mascota'}</h1>
        <button onClick={() => navigate('/pets')} className="close-btn">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="pet-form">
        {/* Información Básica */}
        <section className="form-section">
          <h2>
            {formData.type === 'perro' ? <Dog size={24} /> : <Cat size={24} />}
            Información Básica
          </h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Max, Luna"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Tipo de Mascota *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="breed">Raza</label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Ej: Labrador, Persa"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Género</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Seleccionar</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthDate">
                <Calendar size={18} />
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">
                <Weight size={18} />
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.1"
                min="0"
                placeholder="Ej: 12.5"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="photo">URL de Foto</label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="activityLevel">
              <Activity size={18} />
              Nivel de Actividad
            </label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
            >
              <option value="low">Bajo - Prefiere descansar</option>
              <option value="medium">Medio - Activo moderado</option>
              <option value="high">Alto - Muy enérgico</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="specialNeeds">Necesidades Especiales</label>
            <textarea
              id="specialNeeds"
              name="specialNeeds"
              value={formData.specialNeeds}
              onChange={handleChange}
              rows="2"
              placeholder="Ej: Requiere dieta especial, sensible al ruido..."
            />
          </div>
        </section>

        {/* Información Médica */}
        <section className="form-section">
          <h2>
            <Heart size={24} />
            Información Médica
          </h2>

          <div className="form-group">
            <label htmlFor="allergies">
              Alergias (separadas por comas)
            </label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="Ej: Polen, Pollo, Lácteos"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vaccinations">
              <Syringe size={18} />
              Vacunas (separadas por comas)
            </label>
            <input
              type="text"
              id="vaccinations"
              name="vaccinations"
              value={formData.vaccinations}
              onChange={handleChange}
              placeholder="Ej: Rabia, Parvovirus, Moquillo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medications">
              <Pill size={18} />
              Medicamentos Actuales (separados por comas)
            </label>
            <input
              type="text"
              id="medications"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              placeholder="Ej: Antiparasitario, Suplemento articular"
            />
          </div>

          <div className="form-group">
            <label htmlFor="conditions">Condiciones Médicas (separadas por comas)</label>
            <input
              type="text"
              id="conditions"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              placeholder="Ej: Displasia de cadera, Diabetes"
            />
          </div>

          <div className="form-group">
            <label htmlFor="veterinarian">Veterinario</label>
            <input
              type="text"
              id="veterinarian"
              name="veterinarian"
              value={formData.veterinarian}
              onChange={handleChange}
              placeholder="Nombre y contacto del veterinario"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastCheckup">Último Chequeo</label>
              <input
                type="date"
                id="lastCheckup"
                name="lastCheckup"
                value={formData.lastCheckup}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nextCheckup">Próximo Chequeo</label>
              <input
                type="date"
                id="nextCheckup"
                name="nextCheckup"
                value={formData.nextCheckup}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Preferencias */}
        <section className="form-section">
          <h2>Preferencias y Gustos</h2>

          <div className="form-group">
            <label htmlFor="favoriteFood">Comidas Favoritas (separadas por comas)</label>
            <input
              type="text"
              id="favoriteFood"
              name="favoriteFood"
              value={formData.favoriteFood}
              onChange={handleChange}
              placeholder="Ej: Pollo, Salmón, Zanahorias"
            />
          </div>

          <div className="form-group">
            <label htmlFor="favoriteToys">Juguetes Favoritos (separados por comas)</label>
            <input
              type="text"
              id="favoriteToys"
              name="favoriteToys"
              value={formData.favoriteToys}
              onChange={handleChange}
              placeholder="Ej: Pelota, Ratón de juguete"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dislikes">No Le Gusta (separado por comas)</label>
            <input
              type="text"
              id="dislikes"
              name="dislikes"
              value={formData.dislikes}
              onChange={handleChange}
              placeholder="Ej: Ruidos fuertes, Bañarse"
            />
          </div>
        </section>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/pets')}
            className="btn-cancel"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={submitting || loading}
          >
            <Save size={18} />
            {submitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Perfil'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PetProfileForm;
