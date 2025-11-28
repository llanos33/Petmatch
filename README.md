# PetMatch - Plataforma de Productos para Mascotas

Una plataforma web moderna y simple para vender productos para mascotas. Desarrollada con tecnologías fáciles de entender y mantener.

## 🚀 Tecnologías Utilizadas

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Base de Datos**: JSON (simple y fácil de entender)

## 📋 Características

- ✅ Catálogo de productos con filtros (Perros, Gatos, Todos)
- ✅ Búsqueda de productos
- ✅ Detalle de productos
- ✅ Carrito de compras
- ✅ Proceso de checkout
- ✅ Gestión de stock
- ✅ Diseño responsivo y moderno
- ✅ API REST para gestión de productos y órdenes

## 🛠️ Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Paso 1: Instalar dependencias del Backend

```bash
cd backend
npm install
```

### Paso 2: Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
```

## 🚀 Ejecutar la aplicación

### Terminal 1 - Backend

```bash
cd backend
npm start
```

El backend estará corriendo en `http://localhost:3001`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

El frontend estará corriendo en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
Proyecto PetMatch/
├── backend/
│   ├── server.js          # Servidor Express
│   ├── package.json       # Dependencias del backend
│   └── data/
│       ├── products.json  # Base de datos de productos
│       └── orders.json    # Base de datos de órdenes
│
└── frontend/
    ├── src/
    │   ├── components/    # Componentes React
    │   │   ├── Header.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   └── Checkout.jsx
    │   ├── App.jsx        # Componente principal
    │   └── main.jsx       # Punto de entrada
    ├── index.html
    ├── package.json       # Dependencias del frontend
    └── vite.config.js     # Configuración de Vite
```

## 🔌 API Endpoints

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto por ID

### Órdenes

- `POST /api/orders` - Crear una nueva orden
- `GET /api/orders` - Obtener todas las órdenes

## 📝 Ejemplo de Orden

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "customerInfo": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "3001234567",
    "address": "Calle 123 #45-67, Bogotá"
  }
}
```

## 🎨 Personalización

Los productos se almacenan en `backend/data/products.json`. Puedes agregar, modificar o eliminar productos editando este archivo.

## 📦 Build para Producción

### Frontend

```bash
cd frontend
npm run build
```

Los archivos optimizados se generarán en `frontend/dist`

## 🤝 Contribuir

Este es un proyecto educativo. Siéntete libre de modificarlo y mejorarlo según tus necesidades.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.


