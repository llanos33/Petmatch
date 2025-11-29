import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiPath } from '../config/api'
import {
  AlertCircle,
  CheckCircle2,
  Image,
  Layers,
  ListChecks,
  Plus,
  RefreshCw,
  Save,
  Trash2
} from 'lucide-react'
import './AdminContentManager.css'

function slugify(value) {
  return (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .trim() || `cat-${Date.now()}`
}

function parseList(input) {
  return input
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function parseProductIds(input) {
  return input
    .split(',')
    .map(item => Number(item.trim()))
    .filter(value => Number.isFinite(value))
}

function createBaseContent(source) {
  return {
    categories: Array.isArray(source?.categories) ? [...source.categories] : [],
    promotionalSliders: Array.isArray(source?.promotionalSliders) ? [...source.promotionalSliders] : [],
    homepageFeatured: {
      categories: Array.isArray(source?.homepageFeatured?.categories) ? [...source.homepageFeatured.categories] : [],
      products: Array.isArray(source?.homepageFeatured?.products) ? [...source.homepageFeatured.products] : []
    },
    updatedAt: source?.updatedAt || new Date().toISOString()
  }
}

const emptyCategory = {
  name: '',
  description: '',
  image: '',
  enabled: true
}

const emptySlider = {
  title: '',
  subtitle: '',
  image: '',
  ctaText: '',
  ctaLink: '',
  order: '',
  active: true
}

const AdminContentManager = () => {
  const { user, getAuthToken, loading } = useAuth()
  const [content, setContent] = useState(null)
  const [localContent, setLocalContent] = useState(null)
  const [loadingContent, setLoadingContent] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [newCategory, setNewCategory] = useState(emptyCategory)
  const [newSlider, setNewSlider] = useState(emptySlider)
  const [featuredCategoriesInput, setFeaturedCategoriesInput] = useState('')
  const [featuredProductsInput, setFeaturedProductsInput] = useState('')

  const showStatus = (type, message) => {
    setStatus({ type, message })
    if (message) {
      setTimeout(() => {
        setStatus({ type: '', message: '' })
      }, 4500)
    }
  }

  const fetchContent = useCallback(async () => {
    if (!user?.isAdmin) {
      setLoadingContent(false)
      return
    }

    try {
      setLoadingContent(true)
      setStatus({ type: '', message: '' })
      const token = getAuthToken()
      if (!token) {
        throw new Error('No se encontró un token de autenticación. Inicia sesión nuevamente.')
      }

      const response = await fetch(apiPath('/api/admin/site-content'), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const payload = await response.json()
      if (!response.ok || payload.success === false) {
        throw new Error(payload.error || 'No se pudo obtener la información de contenido.')
      }

      const data = payload.data || payload
      setContent(data)
      setLocalContent(data)
      setFeaturedCategoriesInput((data?.homepageFeatured?.categories || []).join(', '))
      setFeaturedProductsInput((data?.homepageFeatured?.products || []).join(', '))
    } catch (error) {
      console.error('Error al cargar contenido del sitio:', error)
      showStatus('error', error?.message || 'Error inesperado al cargar el contenido del sitio.')
    } finally {
      setLoadingContent(false)
    }
  }, [getAuthToken, user?.isAdmin])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const lastUpdatedText = useMemo(() => {
    if (!content?.updatedAt) return ''
    try {
      const date = new Date(content.updatedAt)
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date)
    } catch (error) {
      return ''
    }
  }, [content?.updatedAt])

  const handleCategoryChange = (index, field, value) => {
    setLocalContent(prev => {
      const current = createBaseContent(prev)
      const categories = [...current.categories]
      categories[index] = {
        ...categories[index],
        [field]: value
      }
      return { ...current, categories }
    })
  }

  const handleToggleCategory = (index) => {
    setLocalContent(prev => {
      const current = createBaseContent(prev)
      const categories = [...current.categories]
      categories[index] = {
        ...categories[index],
        enabled: !categories[index].enabled
      }
      return { ...current, categories }
    })
  }

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      showStatus('error', 'La nueva categoría necesita un nombre.')
      return
    }

    const id = slugify(newCategory.name)

    setLocalContent(prev => {
      const current = createBaseContent(prev)
      const categories = [...current.categories]
      if (categories.some(category => category.id === id)) {
        showStatus('error', 'Ya existe una categoría con ese nombre.')
        return current
      }
      categories.push({
        id,
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        image: newCategory.image.trim(),
        enabled: newCategory.enabled
      })
      return { ...current, categories }
    })

    setNewCategory(emptyCategory)
  }

  const handleRemoveCategory = (id) => {
    setLocalContent(prev => {
      const current = createBaseContent(prev)
      const categories = current.categories.filter(category => category.id !== id)
      const homepageFeatured = {
        categories: current.homepageFeatured.categories.filter(categoryId => categoryId !== id),
        products: current.homepageFeatured.products
      }
      return { ...current, categories, homepageFeatured }
    })
    setFeaturedCategoriesInput(prev => parseList(prev).filter(categoryId => categoryId !== id).join(', '))
  }

  const handleSliderChange = (index, field, value) => {
    setLocalContent(prev => {
      const current = createBaseContent(prev)
      const sliders = [...current.promotionalSliders]
      sliders[index] = {
        ...sliders[index],
        [field]: value
      }
      return { ...current, promotionalSliders: sliders }
    })
  }

  const handleToggleSlider = (index) => {
    setLocalContent(prev => {
      const current = createBaseContent(prev)
      const sliders = [...current.promotionalSliders]
      sliders[index] = {
        ...sliders[index],
        active: !sliders[index].active
      }
      return { ...current, promotionalSliders: sliders }
    })
  }

  const handleAddSlider = () => {
    if (!newSlider.title.trim()) {
      showStatus('error', 'El slider necesita un título para ser agregado.')
      return
    }

    const id = slugify(newSlider.title)

    setLocalContent(prev => {
      const current = createBaseContent(prev)
      const sliders = [...current.promotionalSliders]
      if (sliders.some(slider => slider.id === id)) {
        showStatus('error', 'Ya existe un slider con ese identificador.')
        return current
      }
      sliders.push({
        id,
        title: newSlider.title.trim(),
        subtitle: newSlider.subtitle.trim(),
        image: newSlider.image.trim(),
        ctaText: newSlider.ctaText.trim(),
        ctaLink: newSlider.ctaLink.trim(),
        order: newSlider.order ? Number(newSlider.order) : sliders.length + 1,
        active: newSlider.active
      })
      return { ...current, promotionalSliders: sliders }
    })

    setNewSlider(emptySlider)
  }

  const handleRemoveSlider = (id) => {
    setLocalContent(prev => {
      const current = createBaseContent(prev)
      const sliders = current.promotionalSliders.filter(slider => slider.id !== id)
      return { ...current, promotionalSliders: sliders }
    })
  }

  const handleSave = async () => {
    if (!user?.isAdmin) return

    try {
      setSaving(true)
      const token = getAuthToken()
      if (!token) {
        throw new Error('No fue posible validar tu sesión. Inicia sesión nuevamente.')
      }

      const categoriesList = parseList(featuredCategoriesInput)
      const productsList = parseProductIds(featuredProductsInput)

      const payload = {
        categories: localContent?.categories || [],
        promotionalSliders: (localContent?.promotionalSliders || []).map(slider => ({
          ...slider,
          order: Number.isFinite(Number(slider.order)) ? Number(slider.order) : 1
        })),
        homepageFeatured: {
          categories: categoriesList,
          products: productsList
        }
      }

      const response = await fetch(apiPath('/api/admin/site-content'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const payloadResponse = await response.json()
      if (!response.ok || payloadResponse.success === false) {
        throw new Error(payloadResponse.error || 'Ocurrió un problema guardando la información.')
      }

      const updatedData = payloadResponse.data || payloadResponse
      setContent(updatedData)
      setLocalContent(updatedData)
      setFeaturedCategoriesInput((updatedData?.homepageFeatured?.categories || []).join(', '))
      setFeaturedProductsInput((updatedData?.homepageFeatured?.products || []).join(', '))
      showStatus('success', 'Contenido actualizado correctamente.')
    } catch (error) {
      console.error('Error al guardar contenido:', error)
      showStatus('error', error?.message || 'No fue posible guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || loadingContent) {
    return (
      <div className="admin-content admin-content--center">
        <div className="admin-content__card">
          <span className="admin-content__spinner" aria-hidden="true" />
          <p>Cargando gestor de contenido...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="admin-content admin-content--center">
        <div className="admin-content__card">
          <h2>Necesitas iniciar sesión</h2>
          <p>Inicia sesión con una cuenta de administrador para gestionar el contenido.</p>
          <Link className="admin-content__button" to="/login">Ir a iniciar sesión</Link>
        </div>
      </div>
    )
  }

  if (!user.isAdmin) {
    return (
      <div className="admin-content admin-content--center">
        <div className="admin-content__card">
          <h2>Acceso restringido</h2>
          <p>Este módulo es exclusivo para administradores de PetMatch.</p>
          <Link className="admin-content__button" to="/">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-content">
      <header className="admin-content__header">
        <div>
          <h1>Gestión de categorías y banners</h1>
          <p>Actualiza la experiencia del home controlando categorías destacadas y sliders promocionales.</p>
          {lastUpdatedText && (
            <span className="admin-content__timestamp">Última actualización: {lastUpdatedText}</span>
          )}
        </div>
        <div className="admin-content__actions">
          <Link className="admin-content__action-button" to="/admin/dashboard">
            <Layers size={18} />
            <span>Volver al dashboard</span>
          </Link>
          <button type="button" className="admin-content__action-button" onClick={fetchContent}>
            <RefreshCw size={18} />
            <span>Recargar</span>
          </button>
          <button
            type="button"
            className="admin-content__action-button admin-content__action-button--primary"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={18} />
            <span>{saving ? 'Guardando...' : 'Guardar cambios'}</span>
          </button>
        </div>
      </header>

      {status.message && (
        <div className={`admin-content__alert admin-content__alert--${status.type}`}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      <section className="admin-content__panel">
        <header className="admin-content__panel-header">
          <div>
            <h2>Categorías disponibles</h2>
            <span>Controla qué categorías aparecen en la tienda y su contenido visual.</span>
          </div>
          <div className="admin-content__panel-tools">
            <ListChecks size={18} />
            <span>{localContent?.categories?.length || 0} categorías</span>
          </div>
        </header>

        <div className="admin-content__list">
          {(localContent?.categories || []).map((category, index) => (
            <article key={category.id} className="admin-content__item">
              <div className="admin-content__item-header">
                <span className="admin-content__item-id">{category.id}</span>
                <div className="admin-content__item-actions">
                  <label className="admin-content__toggle">
                    <input
                      type="checkbox"
                      checked={category.enabled}
                      onChange={() => handleToggleCategory(index)}
                    />
                    <span>{category.enabled ? 'Visible' : 'Oculto'}</span>
                  </label>
                  <button type="button" onClick={() => handleRemoveCategory(category.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="admin-content__grid">
                <label>
                  <span>Nombre visible</span>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(event) => handleCategoryChange(index, 'name', event.target.value)}
                  />
                </label>
                <label>
                  <span>Descripción corta</span>
                  <input
                    type="text"
                    value={category.description}
                    onChange={(event) => handleCategoryChange(index, 'description', event.target.value)}
                  />
                </label>
                <label>
                  <span>Imagen destacada</span>
                  <input
                    type="text"
                    value={category.image}
                    onChange={(event) => handleCategoryChange(index, 'image', event.target.value)}
                    placeholder="https://..."
                  />
                </label>
              </div>
            </article>
          ))}
        </div>

        <div className="admin-content__new">
          <h3>Agregar nueva categoría</h3>
          <div className="admin-content__grid">
            <label>
              <span>Nombre visible</span>
              <input
                type="text"
                value={newCategory.name}
                onChange={(event) => setNewCategory(prev => ({ ...prev, name: event.target.value }))}
                placeholder="Ej. Juguetes ecológicos"
              />
            </label>
            <label>
              <span>Descripción corta</span>
              <input
                type="text"
                value={newCategory.description}
                onChange={(event) => setNewCategory(prev => ({ ...prev, description: event.target.value }))}
              />
            </label>
            <label>
              <span>Imagen destacada</span>
              <input
                type="text"
                value={newCategory.image}
                onChange={(event) => setNewCategory(prev => ({ ...prev, image: event.target.value }))}
                placeholder="https://..."
              />
            </label>
          </div>
          <button type="button" className="admin-content__add" onClick={handleAddCategory}>
            <Plus size={18} />
            <span>Agregar categoría</span>
          </button>
        </div>
      </section>

      <section className="admin-content__panel">
        <header className="admin-content__panel-header">
          <div>
            <h2>Destacados en homepage</h2>
            <span>Define qué categorías y productos se muestran como destacados.</span>
          </div>
          <Image size={18} />
        </header>

        <div className="admin-content__grid admin-content__grid--two">
          <label>
            <span>Categorías destacadas (IDs separados por coma)</span>
            <input
              type="text"
              value={featuredCategoriesInput}
              onChange={(event) => setFeaturedCategoriesInput(event.target.value)}
              placeholder="alimentos, juguetes, higiene"
            />
          </label>
          <label>
            <span>Productos destacados (IDs separados por coma)</span>
            <input
              type="text"
              value={featuredProductsInput}
              onChange={(event) => setFeaturedProductsInput(event.target.value)}
              placeholder="1, 2, 3"
            />
          </label>
        </div>
        <p className="admin-content__hint">Usa los IDs existentes de categorías y productos para mantener la navegación consistente.</p>
      </section>

      <section className="admin-content__panel">
        <header className="admin-content__panel-header">
          <div>
            <h2>Sliders promocionales</h2>
            <span>Gestiona los banners que se muestran en el carrusel principal.</span>
          </div>
          <div className="admin-content__panel-tools">
            <Image size={18} />
            <span>{localContent?.promotionalSliders?.length || 0} sliders</span>
          </div>
        </header>

        <div className="admin-content__list">
          {(localContent?.promotionalSliders || []).sort((a, b) => (a.order || 0) - (b.order || 0)).map((slider, index) => (
            <article key={slider.id} className="admin-content__item">
              <div className="admin-content__item-header">
                <span className="admin-content__item-id">{slider.id}</span>
                <div className="admin-content__item-actions">
                  <label className="admin-content__toggle">
                    <input
                      type="checkbox"
                      checked={slider.active}
                      onChange={() => handleToggleSlider(index)}
                    />
                    <span>{slider.active ? 'Activo' : 'Pausado'}</span>
                  </label>
                  <button type="button" onClick={() => handleRemoveSlider(slider.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="admin-content__grid">
                <label>
                  <span>Título</span>
                  <input
                    type="text"
                    value={slider.title}
                    onChange={(event) => handleSliderChange(index, 'title', event.target.value)}
                  />
                </label>
                <label>
                  <span>Subtítulo</span>
                  <input
                    type="text"
                    value={slider.subtitle}
                    onChange={(event) => handleSliderChange(index, 'subtitle', event.target.value)}
                  />
                </label>
                <label>
                  <span>Imagen del banner</span>
                  <input
                    type="text"
                    value={slider.image}
                    onChange={(event) => handleSliderChange(index, 'image', event.target.value)}
                    placeholder="https://..."
                  />
                </label>
                <label>
                  <span>Texto del botón</span>
                  <input
                    type="text"
                    value={slider.ctaText}
                    onChange={(event) => handleSliderChange(index, 'ctaText', event.target.value)}
                  />
                </label>
                <label>
                  <span>Enlace del botón</span>
                  <input
                    type="text"
                    value={slider.ctaLink}
                    onChange={(event) => handleSliderChange(index, 'ctaLink', event.target.value)}
                    placeholder="/promociones"
                  />
                </label>
                <label>
                  <span>Orden de aparición</span>
                  <input
                    type="number"
                    value={slider.order ?? ''}
                    onChange={(event) => handleSliderChange(index, 'order', event.target.value)}
                    min="1"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>

        <div className="admin-content__new">
          <h3>Agregar nuevo slider</h3>
          <div className="admin-content__grid">
            <label>
              <span>Título</span>
              <input
                type="text"
                value={newSlider.title}
                onChange={(event) => setNewSlider(prev => ({ ...prev, title: event.target.value }))}
                placeholder="Ej. Semana del gato"
              />
            </label>
            <label>
              <span>Subtítulo</span>
              <input
                type="text"
                value={newSlider.subtitle}
                onChange={(event) => setNewSlider(prev => ({ ...prev, subtitle: event.target.value }))}
              />
            </label>
            <label>
              <span>Imagen del banner</span>
              <input
                type="text"
                value={newSlider.image}
                onChange={(event) => setNewSlider(prev => ({ ...prev, image: event.target.value }))}
                placeholder="https://..."
              />
            </label>
            <label>
              <span>Texto del botón</span>
              <input
                type="text"
                value={newSlider.ctaText}
                onChange={(event) => setNewSlider(prev => ({ ...prev, ctaText: event.target.value }))}
              />
            </label>
            <label>
              <span>Enlace del botón</span>
              <input
                type="text"
                value={newSlider.ctaLink}
                onChange={(event) => setNewSlider(prev => ({ ...prev, ctaLink: event.target.value }))}
                placeholder="/promociones"
              />
            </label>
            <label>
              <span>Orden</span>
              <input
                type="number"
                value={newSlider.order}
                onChange={(event) => setNewSlider(prev => ({ ...prev, order: event.target.value }))}
                min="1"
              />
            </label>
          </div>
          <button type="button" className="admin-content__add" onClick={handleAddSlider}>
            <Plus size={18} />
            <span>Agregar slider</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default AdminContentManager
