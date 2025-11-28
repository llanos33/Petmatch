// Base de URL para el backend. Configurable por variable de entorno.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiPath = (path = '') => `${API_URL}${path}`;
