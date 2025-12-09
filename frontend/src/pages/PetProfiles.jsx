import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import PetProfileList from '../components/PetProfileList';
import { useAuth } from '../context/AuthContext';

function PetProfiles() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="page-container">
      <Breadcrumb customCrumbs={[{ path: '/profile', label: 'Perfil' }, { path: '/pets', label: 'Mis Mascotas' }]} />
      <PetProfileList />
    </div>
  );
}

export default PetProfiles;
