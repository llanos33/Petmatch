import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Premium.css'
import PaymentMethods from './PaymentMethods'
import { useAuth } from '../context/AuthContext'
import { apiPath } from '../config/api'

export default function Premium() {
  const { user, getAuthToken, refreshProfile, markPremium } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = useMemo(() => ({
    monthly: {
      id: 'monthly',
      label: 'Plan mensual',
      price: 42000,
      oldPrice: 60000,
      tag: 'Ahorra 30% hoy',
      info: 'Renovación automática. Cancela cuando quieras.',
      highlight: 'Entrega gratis ilimitada y precios miembros desde el primer pedido.'
    },
    yearly: {
      id: 'yearly',
      label: 'Plan anual',
      price: 420000,
      oldPrice: 504000,
      tag: '2 meses gratis',
      info: 'Un único pago al año para que te olvides de las renovaciones.',
      highlight: 'Incluye kit de bienvenida + asesorías exclusivas cada trimestre.'
    }
  }), [])

  const selectedPlan = plans[billingCycle]

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value)

  const monthlyEquivalent = billingCycle === 'yearly'
    ? formatCurrency(Math.round(selectedPlan.price / 12))
    : null

  const heroHighlights = [
    {
      icon: '🎁',
      title: 'Caja de bienvenida',
      description: 'Recibe obsequios seleccionados para consentir a tu mascota apenas actives el plan.'
    },
    {
      icon: '🛡️',
      title: 'Soporte prioritario',
      description: 'Acceso directo a especialistas PetMatch para resolver dudas 24/7 desde la app.'
    },
    {
      icon: '🌱',
      title: 'Impacto positivo',
      description: 'Financiamos rescates y jornadas de esterilización con un porcentaje de tu membresía.'
    }
  ]

  const benefits = [
    {
      icon: '🛒',
      title: 'Descuentos permanentes',
      description: 'Hasta 30% menos en categorías seleccionadas y precios exclusivos en lanzamientos.'
    },
    {
      icon: '🚚',
      title: 'Envíos ilimitados',
      description: 'Cobertura nacional con entregas preferentes y sin costo adicional.'
    },
    {
      icon: '🧠',
      title: 'Contenido experto',
      description: 'Masterclasses mensuales con veterinarios y etólogos aliados de PetMatch.'
    },
    {
      icon: '🎉',
      title: 'Experiencias exclusivas',
      description: 'Acceso a eventos, talleres y preventas para miembros premium.'
    }
  ]

  const experienceExtras = [
    'Seguimiento nutricional personalizado con recordatorios automáticos.',
    'Recompensas adicionales por referir amigos al club PetMatch.',
    'Prioridad en soporte y cambios de pedidos sin cargos ocultos.'
  ]

  const paymentAssurance = [
  ]

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method)
  }

  const handleSubscribe = async () => {
    if (!paymentMethod) {
      alert('Selecciona un método de pago para continuar')
      return
    }

    setIsProcessing(true)

    try {
      const token = getAuthToken()
      if (!token) {
        alert('Debes iniciar sesión para suscribirte')
        setIsProcessing(false)
        return
      }

      const resp = await fetch(apiPath('/api/auth/subscribe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: selectedPlan.id,
          price: selectedPlan.price,
          billingCycle
        })
      })

      const data = await resp.json()
      if (resp.ok && data.success) {
        // Marcar premium de forma persistente (local + perfil)
        markPremium(true)
        try { await refreshProfile() } catch (e) { console.warn(e) }
        setSubscribed(true)
      } else {
        console.error('Fallo suscripción', data)
        alert(data.error || 'No se pudo completar la suscripción')
      }
    } catch (error) {
      console.error('Error en suscripción:', error)
      alert('Error de conexión al servidor. Intenta de nuevo más tarde.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="premium-page">
      {!subscribed ? (
        <>
          <section className="premium-hero">
            <div className="premium-hero-content">
              <h1>La membresía que convierte cada compra en una experiencia WOW</h1>
              <p className="premium-intro">
                Diseñamos un plan para tutores que quieren lo mejor: ahorro, envíos rápidos y acompañamiento experto que piensa en el bienestar de tu peludo.
              </p>

              <div className="billing-toggle" role="tablist" aria-label="Selecciona tu periodo de facturación">
                {Object.keys(plans).map((planKey) => (
                  <button
                    key={planKey}
                    type="button"
                    role="tab"
                    className={`billing-option ${billingCycle === planKey ? 'active' : ''}`}
                    onClick={() => setBillingCycle(planKey)}
                    aria-selected={billingCycle === planKey}
                  >
                    {plans[planKey].label}
                  </button>
                ))}
              </div>

              <div className="premium-price">
                <span className="plan-tag">{selectedPlan.tag}</span>
                <div className="plan-price">
                  {formatCurrency(selectedPlan.price)}
                  <span className="plan-period">{billingCycle === 'monthly' ? ' / mes' : ' pago único'}</span>
                </div>
                <div className="plan-old-price">Antes {formatCurrency(selectedPlan.oldPrice)}</div>
                {monthlyEquivalent && (
                  <div className="plan-extra">Equivale a {monthlyEquivalent} por mes</div>
                )}
                <p className="plan-highlight">{selectedPlan.highlight}</p>
              </div>

              <button
                className="premium-cta-btn"
                onClick={handleSubscribe}
                disabled={isProcessing || !paymentMethod}
              >
                {isProcessing ? 'Procesando...' : 'Unirme a Premium'}
              </button>

              <div className="premium-payment-inline">
                <PaymentMethods
                  onPaymentSelect={handlePaymentSelect}
                  showCod={false}
                  variant="compact"
                />
                <ul className="premium-payment-guarantees">
                  {paymentAssurance.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              

              <p className="premium-guarantee">Garantía de satisfacción de 30 días o te devolvemos tu dinero.</p>
            </div>

            <div className="premium-hero-highlight">
              <div className="highlight-header">
                <span className="highlight-kicker">Beneficios inmediatos</span>
                <h2>Mucho más que descuentos</h2>
              </div>
              <div className="highlight-grid">
                {heroHighlights.map(({ icon, title, description }) => (
                  <article key={title} className="highlight-card">
                    <div className="highlight-icon">{icon}</div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
              <div className="highlight-metrics">
                <div>
                  <span className="metric-value">12K+</span>
                  <span className="metric-label">Pedidos felices</span>
                </div>
                <div>
                  <span className="metric-value">4.9/5</span>
                  <span className="metric-label">Satisfacción member</span>
                </div>
                <div>
                  <span className="metric-value">24/7</span>
                  <span className="metric-label">Atención prioritaria</span>
                </div>
              </div>
            </div>
          </section>

          <section className="premium-benefits">
            <header>
              <span className="benefits-kicker">Todo lo que recibes</span>
              <h2>Ventajas pensadas para tu mascota y para tu bolsillo</h2>
            </header>
            <div className="benefits-grid">
              {benefits.map(({ icon, title, description }) => (
                <article key={title} className="benefit-card">
                  <div className="benefit-icon">{icon}</div>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="premium-experience">
            <div className="experience-card">
              <h3>Una experiencia pensada para tutores exigentes</h3>
              <ul>
                {experienceExtras.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="experience-testimonial">
              <p>
                “Desde que soy parte de Premium ahorro en cada compra y recibo mis pedidos al día siguiente. El equipo PetMatch siempre responde con cariño.”
              </p>
              <span>Laura C. · Tutora de Max y Mila</span>
            </div>
          </section>

        </>
      ) : (
        <div className="premium-success">
          <h2>¡Suscripción activa!</h2>
          <p>Gracias por unirte a PetMatch Premium. Ahora tienes acceso a descuentos y beneficios.</p>
          <div className="success-actions">
            <Link to="/" className="btn-primary">Ir al inicio</Link>
            <Link to="/profile" className="btn-outline">Ir a mi perfil</Link>
          </div>
        </div>
      )}
    </div>
  )
}
