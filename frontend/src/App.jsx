import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { PetProvider } from './context/PetContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import Help from './components/Help'
import Consultations from './components/Consultations'
import VeterinarianVerification from './components/VeterinarianVerification'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import BlogPostEdit from './components/BlogPostEdit'
import CategoryPage from './components/CategoryPage'
import PromocionesPage from './components/PromocionesPage'
import Servicios from './components/Servicios'
import Premium from './components/Premium'
import ExclusiveProducts from './pages/ExclusiveProducts'
import './App.css'
import CheckoutInfo from "./pages/CheckoutInfo";
import CheckoutPayment from "./pages/CheckoutPayment";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import SearchResults from "./pages/SearchResults";
import BackHomeButton from "./components/BackHomeButton";
import PetProducts from "./pages/PetProducts";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import DeliveryPolicy from "./pages/DeliveryPolicy";
import SiteMap from "./pages/SiteMap";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminVeterinarianRequests from "./pages/AdminVeterinarianRequests";
import PuntosInteres from "./pages/PuntosInteres";
import PetProfiles from "./pages/PetProfiles";
import PetProfileForm from "./components/PetProfileForm";
import PetProfile from "./components/PetProfile";

const CART_STORAGE_KEY = 'petmatch_cart_v1'

const serializeProductForCart = (product) => {
  if (!product || typeof product !== 'object') return null
  const {
    id,
    name,
    description,
    price,
    category,
    petType,
    image,
    stock,
    exclusive,
    isOnSale,
    salePrice
  } = product

  return {
    id,
    name,
    description,
    price,
    category,
    petType,
    image,
    stock,
    exclusive,
    isOnSale,
    salePrice
  }
}

const loadStoredCart = () => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(item => {
        const productId = Number(item?.productId)
        if (!Number.isInteger(productId) || productId <= 0) return null

        const rawQuantity = Number(item?.quantity)
        const quantity = Number.isInteger(rawQuantity) ? Math.max(1, rawQuantity) : 1

        const priceValue = Number(item?.price)
        const price = Number.isFinite(priceValue) ? priceValue : undefined

        return {
          productId,
          quantity,
          price,
          product: serializeProductForCart(item?.product) || null
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.warn('No se pudo restaurar el carrito guardado', error)
    return []
  }
}

function AppContent({ 
  cart, 
  products, 
  searchTerm, 
  setSearchTerm, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  getCartItemCount 
}) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      <Header 
        cartItemCount={getCartItemCount()} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        products={products}
      />
      <main className={isAuthPage ? "main-content-full" : "main-content"}>
        <Routes>
          <Route
            path="/"
            element={<ProductList products={products} addToCart={addToCart} searchTerm={searchTerm} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail products={products} addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                products={products}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} products={products} clearCart={clearCart} />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/pets"
            element={<PetProfiles />}
          />
          <Route
            path="/pets/new"
            element={<PetProfileForm />}
          />
          <Route
            path="/pets/:id"
            element={<PetProfile />}
          />
          <Route
            path="/pets/:id/edit"
            element={<PetProfileForm />}
          />
          <Route
            path="/help"
            element={<Help />}
          />
          <Route
            path="/consultations"
            element={<Consultations />}
          />
          <Route
            path="/veterinarian-verification"
            element={<VeterinarianVerification />}
          />
          <Route
            path="/lista-deseos"
            element={<Wishlist products={products} addToCart={addToCart} />}
          />
          <Route
            path="/category/:categoryName"
            element={<CategoryPage products={products} addToCart={addToCart} />}
          />
          <Route
            path="/promociones"
            element={<PromocionesPage products={products} addToCart={addToCart} />}
          />
          <Route
            path="/exclusivos"
            element={<ExclusiveProducts products={products} addToCart={addToCart} />}
          />
          <Route
            path="/servicios"
            element={<Servicios />}
          />
          <Route
            path="/blog"
            element={<Blog />}
          />
          <Route
            path="/blog/:id"
            element={<BlogPost />}
          />
          <Route
            path="/blog/:id/edit"
            element={<BlogPostEdit />}
          />
          <Route
            path="/premium"
            element={<Premium />}
          />
          <Route
            path="/buscar"
            element={<SearchResults products={products} addToCart={addToCart} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
          />
          <Route
            path="/mascotas/:petType"
            element={<PetProducts products={products} addToCart={addToCart} />}
          />
          <Route
            path="/sobre"
            element={<About />}
          />
          <Route
            path="/terms"
            element={<TermsAndConditions />}
          />
          <Route
            path="/privacy"
            element={<PrivacyPolicy />}
          />
          <Route
            path="/faq"
            element={<FAQ />}
          />
          <Route
            path="/delivery"
            element={<DeliveryPolicy />}
          />
          <Route
            path="/sitemap"
            element={<SiteMap />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />
          <Route
            path="/admin/veterinarian-requests"
            element={<AdminVeterinarianRequests />}
          />
          <Route
            path="/puntos-interes"
            element={<PuntosInteres />}
          />
        </Routes>
      </main>
      <BackHomeButton />
      <Footer />
    </div>
  );
}

function App() {
  const [cart, setCart] = useState(() => loadStoredCart())
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.warn('No se pudo guardar el carrito', error)
    }
  }, [cart])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorage = (event) => {
      if (event.key === CART_STORAGE_KEY) {
        setCart(loadStoredCart())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      // Log para depuración
      console.log('fetch /api/products', { status: response.status, ok: response.ok, data })

      // El backend puede devolver un array directo o un objeto { success, data }
      let productsArray = []
      if (Array.isArray(data)) {
        productsArray = data
      } else if (data && Array.isArray(data.data)) {
        productsArray = data.data
      } else {
        // fallback: intentar encontrar cualquier array dentro del objeto
        for (const key of Object.keys(data || {})) {
          if (Array.isArray(data[key])) {
            productsArray = data[key]
            break
          }
        }
      }

      setProducts(productsArray)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id)
      const parsedPrice = Number(product.price)
      const priceToStore = Number.isFinite(parsedPrice) ? parsedPrice : existingItem?.price || 0
      const productSnapshot = serializeProductForCart(product)

      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                price: priceToStore,
                product: productSnapshot || item.product || null
              }
            : item
        )
      }

      return [
        ...prevCart,
        {
          productId: product.id,
          quantity: 1,
          price: priceToStore,
          product: productSnapshot
        }
      ]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const clearCart = () => setCart([])

  return (
    <AuthProvider clearCart={clearCart}>
      <WishlistProvider>
        <PetProvider>
          <Router>
            <AppContent 
              cart={cart}
              products={products}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              clearCart={clearCart}
              getCartItemCount={getCartItemCount}
            />
          </Router>
        </PetProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default App


