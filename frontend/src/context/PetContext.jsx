import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiPath } from '../config/api';

const PetContext = createContext();

export function usePets() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets debe ser usado dentro de un PetProvider');
  }
  return context;
}

export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  // Cargar mascotas del usuario al montar o cuando cambie el usuario
  useEffect(() => {
    if (user && token) {
      fetchPets();
    } else {
      setPets([]);
    }
  }, [user, token]);

  const fetchPets = async () => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!activeToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(apiPath('/api/pets'), {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPets(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al cargar mascotas');
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Error de conexión al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (petData) => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!activeToken) {
      setError('Debes iniciar sesión para agregar mascotas');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiPath('/api/pets'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(petData)
      });

      if (response.ok) {
        const newPet = await response.json();
        setPets(prev => [...prev, newPet]);
        return newPet;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al agregar mascota');
        return null;
      }
    } catch (err) {
      console.error('Error adding pet:', err);
      setError('Error de conexión al agregar mascota');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePet = async (petId, petData) => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!activeToken) {
      setError('Debes iniciar sesión para actualizar mascotas');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiPath(`/api/pets/${petId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(petData)
      });

      if (response.ok) {
        const updatedPet = await response.json();
        setPets(prev => prev.map(p => p.id === petId ? updatedPet : p));
        return updatedPet;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al actualizar mascota');
        return null;
      }
    } catch (err) {
      console.error('Error updating pet:', err);
      setError('Error de conexión al actualizar mascota');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId) => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!activeToken) {
      setError('Debes iniciar sesión para eliminar mascotas');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiPath(`/api/pets/${petId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });

      if (response.ok) {
        setPets(prev => prev.filter(p => p.id !== petId));
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al eliminar mascota');
        return false;
      }
    } catch (err) {
      console.error('Error deleting pet:', err);
      setError('Error de conexión al eliminar mascota');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPetById = (petId) => {
    return pets.find(p => p.id === parseInt(petId));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    pets,
    loading,
    error,
    fetchPets,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    clearError
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
}
