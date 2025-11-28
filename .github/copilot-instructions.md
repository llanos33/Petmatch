# PetMatch - AI Coding Instructions

## Project Overview

**PetMatch** is an e-commerce platform for pet products using a full-stack JavaScript architecture:
- **Frontend**: React 18 + Vite + React Router (ports at `localhost:3000`)
- **Backend**: Node.js + Express (runs on `localhost:3001`)
- **Data**: JSON files in `/backend/data/` (products.json, users.json, orders.json)

### Critical Startup Knowledge

- **Backend uses ES modules** (`"type": "module"` in package.json) - import/export syntax only
- **CORS enabled** on backend - frontend communicates via hardcoded URLs (`http://localhost:3001`)
- **JWT authentication** with `jsonwebtoken` + `bcryptjs` - tokens stored in localStorage
- **No database** - data persisted as JSON files on disk
- **Development commands**: Backend: `npm start` or `npm run dev` (watch mode); Frontend: `npm run dev`

## Architecture & Data Flow

### Frontend State Management
- **App.jsx** (root): holds `cart`, `products`, `searchTerm` state
- **AuthContext.jsx**: global authentication state (user, token), provides `useAuth()` hook
- **Cart flow**: `addToCart()` → state updates → passes to Cart component → Checkout
- Product data fetched once on App mount via `fetchProducts()` from `/api/products`

### Backend Request/Response Pattern
All API responses follow: `{ success: boolean, data: {...}, error?: string }`

**Key endpoints**:
- `GET /api/products` - returns array of all products
- `POST /api/auth/login` - body: `{email, password}`, returns `{token, user}`
- `POST /api/auth/register` - body: `{name, email, password, phone}`
- `GET /api/auth/profile` - requires `Authorization: Bearer ${token}` header
- `POST /api/orders` - body: `{items, userInfo}`, requires auth

### Component Architecture
- **Header.jsx**: search + cart icon (passes searchTerm state)
- **ProductList.jsx**: featured products carousel + category filters
- **Cart.jsx**: displays items, update quantity, remove, total calculation
- **AuthContext**: auth state, login/register/logout functions, localStorage token management
- All components use `lucide-react` for icons

## Development Patterns & Conventions

### Error Handling Pattern
Components check for `Failed to fetch` or `NetworkError` messages to detect backend connectivity issues:
```javascript
if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
  return { success: false, error: 'Backend not running on port 3001' }
}
```

### Discount System
- **productDiscounts.js**: exports `applyDiscountToProduct()` utility
- Used in ProductList to calculate promotional prices
- Applied at display time, not in data layer

### Product Structure
```javascript
{
  id: number,
  name: string,
  description: string,
  price: number, // in local currency (e.g., 45000 COP)
  category: string, // "Alimentos", "Juguetes", "Accesorios", "Medicamentos", "Higiene", "Camas y Casas"
  petType: string, // "perro", "gato", or null for universal
  image: string, // URL to Unsplash or external CDN
  stock: number
}
```

### Cart Item Structure
```javascript
{
  productId: number,
  quantity: number,
  price: number,
  product: {...} // full product object for display
}
```

## Common Tasks

### Adding a New Feature
1. **Backend API**: Add route in `server.js` following RESTful pattern
2. **Frontend Component**: Create in `/components/` with matching `.css` file
3. **Context if needed**: Add state management to `AuthContext.jsx`
4. **Testing locally**: Run both servers in separate terminals, check browser DevTools for fetch errors

### Modifying Products
- Edit `/backend/data/products.json` directly OR create migration logic in backend
- Products auto-loaded on App mount - no restart needed if file changes during development
- Remember `price` is in local currency (test with realistic amounts)

### Authentication Flow
1. User submits email/password to Login.jsx
2. AuthContext.login() calls `POST /api/auth/login`
3. Token stored in localStorage; user object set in React state
4. useAuth() hook provides access to `user`, `login()`, `logout()`, `register()` functions
5. Protected routes check `user` state (not implemented yet - add manually if needed)

## File Reference Guide

- **Global state**: `frontend/src/context/AuthContext.jsx`
- **Cart logic**: `frontend/src/App.jsx` (addToCart, removeFromCart, updateQuantity)
- **Discount calculations**: `frontend/src/utils/productDiscounts.js`
- **API endpoints**: `backend/server.js` (routes defined sequentially)
- **Product data**: `backend/data/products.json`
- **Styling**: Each component has paired `.css` file in same directory

## Known Limitations & TODOs

- **No input validation** on frontend forms - add before production
- **No protected routes** - implement in Router once auth is fully integrated
- **No error boundaries** - add React Error Boundary component
- **Hardcoded backend URL** - move to environment variables for deployment
- **Stock management** not enforced on checkout
- **No search filtering** fully connected (searchTerm passed but not used everywhere)
