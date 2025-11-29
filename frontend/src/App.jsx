import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
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
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
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

function App() {
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
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
      // Usar el precio del producto (que puede incluir descuento aplicado en ProductList)
      const priceToStore = product.price
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { productId: product.id, quantity: 1, price: priceToStore, product }]
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
        <Router>
          <div className="App">
            <Header 
              cartItemCount={getCartItemCount()} 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <main className="main-content">
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
                path="/help"
                element={<Help />}
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
              </Routes>
          </main>
          <BackHomeButton />
          <Footer />
        </div>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default App


