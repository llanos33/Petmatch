import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  PencilLine,
  Trash2,
  Save,
  RefreshCw,
  Percent,
  PackageCheck,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'
import './AdminProducts.css'
import { useAuth } from '../context/AuthContext'
import { apiPath } from '../config/api'

const initialFormState = {
  name: '',
  description: '',
  category: 'Alimentos',
  petType: 'perro',
  image: '',
  price: '',
  stock: '',
  exclusive: false,
  isOnSale: false,
  salePrice: ''
}

const formatCurrency = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(numeric)
}

const categoryOptions = [
  'Alimentos',
  'Juguetes',
  'Accesorios',
  'Medicamentos',
  'Higiene',
  'Camas y Casas'
]

const petTypeOptions = [
  { value: 'perro', label: 'Perro' },
  { value: 'gato', label: 'Gato' },
  { value: 'ambos', label: 'Perros y Gatos' }
]

const AdminProducts = () => {
  const { user, getAuthToken, loading } = useAuth()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState(initialFormState)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  const token = useMemo(() => getAuthToken?.(), [getAuthToken])

  const resetNotifications = () => {
    setError('')
    setSuccess('')
  }

  const resetForm = () => {
    setSelectedProductId(null)
    setForm(initialFormState)
  }

  const fetchProducts = useCallback(async () => {
    if (!token) {
      setIsLoadingProducts(false)
      return
    }
    try {
      setIsLoadingProducts(true)
      resetNotifications()
      const response = await fetch(apiPath('/api/admin/products'), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const payload = await response.json()
      if (!response.ok || payload.success === false) {
        throw new Error(payload.error || 'No se pudieron obtener los productos')
      }
      setProducts(Array.isArray(payload.data) ? payload.data : payload)
    } catch (err) {
      console.error('Error cargando productos:', err)
      setError(err?.message || 'Error desconocido al cargar los productos')
    } finally {
      setIsLoadingProducts(false)
    }
  }, [token])

  useEffect(() => {
    if (user?.isAdmin) {
      fetchProducts()
    } else {
      setIsLoadingProducts(false)
    }
  }, [fetchProducts, user?.isAdmin])

  useEffect(() => {
    if (!form.isOnSale) {
      setForm(prev => ({ ...prev, salePrice: '' }))
    }
  }, [form.isOnSale])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return products
    return products.filter(product => {
      const composite = [product.name, product.category, product.petType, product.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return composite.includes(term)
    })
  }, [products, searchTerm])

  const handleEditClick = (product) => {
    resetNotifications()
    setSelectedProductId(product.id)
    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'Alimentos',
      petType: product.petType || 'perro',
      image: product.image || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      exclusive: !!product.exclusive,
      isOnSale: !!product.isOnSale,
      salePrice: product.salePrice ? product.salePrice.toString() : ''
    })
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    resetNotifications()
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const buildPayload = () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      petType: form.petType,
      image: form.image.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      exclusive: form.exclusive,
      isOnSale: form.isOnSale
    }

    if (form.isOnSale && form.salePrice) {
      payload.salePrice = Number(form.salePrice)
    }

    return payload
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    resetNotifications()

    if (!token) {
      setError('Sesión inválida. Por favor inicia sesión nuevamente.')
      return
    }

    const payload = buildPayload()

    if (!payload.name || !payload.description || !payload.category || !payload.petType) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      setError('El precio debe ser un número mayor a cero.')
      return
    }

    if (!Number.isInteger(payload.stock) || payload.stock < 0) {
      setError('El stock debe ser un número entero igual o mayor a cero.')
      return
    }

    if (payload.isOnSale && (!payload.salePrice || payload.salePrice <= 0)) {
      setError('El precio de oferta debe ser un número válido y mayor a cero.')
      return
    }

    if (payload.isOnSale && payload.salePrice >= payload.price) {
      setError('El precio de oferta debe ser menor que el precio base.')
      return
    }

    try {
      setIsSaving(true)
      const isEdit = Boolean(selectedProductId)
      const endpoint = isEdit
        ? apiPath(`/api/admin/products/${selectedProductId}`)
        : apiPath('/api/admin/products')
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok || result.success === false) {
        throw new Error(result.error || 'No fue posible guardar el producto')
      }

      setSuccess(isEdit ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.')
      resetForm()
      fetchProducts()
    } catch (err) {
      console.error('Error al guardar producto:', err)
      setError(err?.message || 'Error desconocido al guardar el producto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (productId) => {
    resetNotifications()
    if (!token) {
      setError('Sesión inválida. Por favor inicia sesión nuevamente.')
      return
    }

    const confirmDelete = window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')
    if (!confirmDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(apiPath(`/api/admin/products/${productId}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const result = await response.json()
      if (!response.ok || result.success === false) {
        throw new Error(result.error || 'No fue posible eliminar el producto')
      }
      setSuccess('Producto eliminado correctamente.')
      if (selectedProductId === productId) {
        resetForm()
      }
      fetchProducts()
    } catch (err) {
      console.error('Error al eliminar producto:', err)
      setError(err?.message || 'Error desconocido al eliminar el producto')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading || isLoadingProducts) {
    return (
      <div className="admin-products admin-products--loading">
        <div className="admin-products__spinner" aria-hidden="true" />
        <p>Cargando productos...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="admin-products admin-products--center">
        <div className="admin-products__card">
          <h2>Inicia sesión</h2>
          <p>Este módulo es exclusivo para administradores.</p>
          <Link to="/login" className="admin-products__button">Ir a iniciar sesión</Link>
        </div>
      </div>
    )
  }

  if (!user.isAdmin) {
    return (
      <div className="admin-products admin-products--center">
        <div className="admin-products__card">
          <h2>Acceso restringido</h2>
          <p>No cuentas con privilegios de administrador.</p>
          <Link to="/" className="admin-products__button">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-products">
      <header className="admin-products__header">
        <div>
          <h1>Gestión de productos</h1>
          <p>Administra precios, inventarios y promociones de PetMatch.</p>
        </div>
        <div className="admin-products__actions">
          <Link to="/admin/dashboard" className="admin-products__action-link">
            <PackageCheck size={16} />
            Panel general
          </Link>
          <button type="button" className="admin-products__action-link" onClick={fetchProducts}>
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>
      </header>

      <section className="admin-products__content">
        <aside className="admin-products__form">
          <div className="admin-products__form-header">
            <h2>{selectedProductId ? 'Editar producto' : 'Crear nuevo producto'}</h2>
            <button type="button" className="admin-products__reset" onClick={resetForm}>
              <Plus size={16} />
              Nuevo
            </button>
          </div>

          {(error || success) && (
            <div className={`admin-products__alert ${error ? 'admin-products__alert--error' : 'admin-products__alert--success'}`}>
              <AlertCircle size={16} />
              <span>{error || success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-products__form-fields">
            <label>
              Nombre del producto
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Ej: Alimento premium para perros"
                required
              />
            </label>

            <label>
              Descripción
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe el producto y sus beneficios"
                rows={4}
                required
              />
            </label>

            <label>
              Categoría
              <select name="category" value={form.category} onChange={handleInputChange} required>
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label>
              Tipo de mascota
              <select name="petType" value={form.petType} onChange={handleInputChange} required>
                {petTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              URL de imagen
              <div className="admin-products__input-with-icon">
                <ImageIcon size={16} />
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
            </label>

            <div className="admin-products__grid-two">
              <label>
                Precio base (COP)
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  min="1"
                  step="100"
                  required
                />
              </label>

              <label>
                Stock disponible
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  required
                />
              </label>
            </div>

            <div className="admin-products__checkboxes">
              <label className="admin-products__checkbox">
                <input
                  type="checkbox"
                  name="exclusive"
                  checked={form.exclusive}
                  onChange={handleInputChange}
                />
                <span>Producto exclusivo para usuarios Premium</span>
              </label>

              <label className="admin-products__checkbox">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={form.isOnSale}
                  onChange={handleInputChange}
                />
                <span>Activar oferta</span>
              </label>
            </div>

            {form.isOnSale && (
              <label>
                Precio en oferta (COP)
                <div className="admin-products__input-with-icon">
                  <Percent size={16} />
                  <input
                    type="number"
                    name="salePrice"
                    value={form.salePrice}
                    onChange={handleInputChange}
                    min="1"
                    step="100"
                    required={form.isOnSale}
                  />
                </div>
              </label>
            )}

            <div className="admin-products__form-actions">
              <button type="submit" className="admin-products__submit" disabled={isSaving}>
                <Save size={16} />
                {selectedProductId ? 'Guardar cambios' : 'Crear producto'}
              </button>
              {selectedProductId && (
                <button
                  type="button"
                  className="admin-products__delete"
                  onClick={() => handleDelete(selectedProductId)}
                  disabled={isDeleting}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              )}
            </div>
          </form>
        </aside>

        <section className="admin-products__list">
          <div className="admin-products__list-header">
            <h2>Inventario ({filteredProducts.length})</h2>
            <input
              type="search"
              placeholder="Buscar por nombre, categoría o descripción"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="admin-products__table-wrapper">
            <table className="admin-products__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Mascota</th>
                  <th>Precio</th>
                  <th>Oferta</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="admin-products__empty">No se encontraron productos.</td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className={product.isOnSale ? 'admin-products__row-sale' : ''}>
                      <td>#{product.id}</td>
                      <td>
                        <div className="admin-products__product-info">
                          <strong>{product.name}</strong>
                          <span>{product.description}</span>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.petType === 'ambos' ? 'Perros y Gatos' : product.petType}</td>
                      <td>
                        <div className="admin-products__price-cell">
                          <span>{formatCurrency(product.price)}</span>
                          {product.isOnSale && product.salePrice && (
                            <span>{formatCurrency(product.salePrice)}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        {product.isOnSale && product.salePrice ? (
                          <span className="admin-products__badge admin-products__badge--sale">En oferta</span>
                        ) : (
                          <span className="admin-products__badge">Precio regular</span>
                        )}
                      </td>
                      <td>
                        <span className={`admin-products__stock ${product.stock <= 5 ? 'admin-products__stock--low' : ''}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <div className="admin-products__actions-cell">
                          <button type="button" onClick={() => handleEditClick(product)}>
                            <PencilLine size={16} />
                            Editar
                          </button>
                          <button type="button" className="danger" onClick={() => handleDelete(product.id)} disabled={isDeleting}>
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  )
}

export default AdminProducts
