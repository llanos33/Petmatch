import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configuración del servidor de desarrollo
  server: {
    port: 5173, // puedes cambiarlo si necesitas otro puerto
    open: true, // abre el navegador automáticamente al iniciar
    proxy: {
      // redirige automáticamente las llamadas a /api hacia el backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Opcional: base para despliegues en producción
  // base: '/',
})


