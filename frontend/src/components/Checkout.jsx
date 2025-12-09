import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "./Breadcrumb";
import { CheckCircle, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import "./Checkout.css";
import PaymentMethods from "../components/PaymentMethods";
import { apiPath } from "../config/api";

function Checkout({ cart, products, clearCart }) {
  const navigate = useNavigate();
  const { user, getAuthToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/checkout");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    }));
  }, [user, navigate]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price);

  const getSubtotal = () =>
    cart.reduce((total, item) => {
      // Usar el precio guardado en el item (que puede ser precio con descuento)
      return total + (item.price * item.quantity);
    }, 0);

  const getShippingCost = () => {
    // Envío gratis para usuarios Premium
    if (user?.isPremium) {
      return 0;
    }
    // Para usuarios no-Premium siempre cobrar tarifa estándar
    return 8000;
  };

  const getPremiumDiscount = () => {
    if (!user?.isPremium) return 0;
    return getSubtotal() * 0.10;
  };

  const getTotal = () => getSubtotal() - getPremiumDiscount() + getShippingCost();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone && formData.address && formData.city) {
      setCurrentStep(2);
    } else {
      alert("Por favor completa todos los campos de información y dirección.");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSelect = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (formData.paymentMethod) {
      setCurrentStep(3);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const effectivePrice = item.price ?? product?.price ?? 0;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: effectivePrice, // precio real usado (incluye descuento si aplica)
        };
      });

      const itemsTotal = orderItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
      const premiumDiscount = getPremiumDiscount();
      const shippingCost = getShippingCost();
      const orderTotal = itemsTotal - premiumDiscount + shippingCost;

      const token = getAuthToken();
      if (!token) {
        navigate("/login?redirect=/checkout");
        return;
      }

      const response = await fetch(apiPath("/api/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          total: orderTotal,
          shippingCost,
          premiumDiscount,
          customerInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}`,
            paymentMethod: formData.paymentMethod,
          },
        }),
      });

      if (response.ok) {
        clearCart?.();
        setOrderSuccess(true);
        setTimeout(() => navigate("/"), 3000);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      alert("Error al procesar la orden. Por favor, intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-container">
        <Breadcrumb />
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>¡Orden Realizada con Éxito!</h2>
          <p>Tu pedido ha sido procesado correctamente.</p>
          <p>Te redirigiremos al inicio en unos segundos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Breadcrumb />
      <h1>Finalizar Compra</h1>

      <div className="steps-indicator">
        <div className={`step ${currentStep >= 1 ? (currentStep === 1 ? 'active' : 'completed') : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Información</span>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 2 ? (currentStep === 2 ? 'active' : 'completed') : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Pago</span>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Confirmar</span>
        </div>
      </div>

      <div className="checkout-content">
        <form className="checkout-form">
          {currentStep === 1 && (
            <>
              <div className="step1-container">
                <div className="sections-row">
                  <div className="form-section">
                    <h2>Información de Contacto</h2>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Nombre Completo *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Teléfono *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h2>Dirección de Entrega</h2>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="address">Dirección *</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="city">Ciudad *</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="continue-btn-container">
                  <button type="button" className="submit-order-btn continue-btn" onClick={handleNextStep}>
                    Continuar al Pago →
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="step2-container">
                <div className="payment-methods-wrapper">
                  <PaymentMethods onPaymentSelect={handlePaymentSelect} />
                </div>

                <div className="step-buttons-container">
                  <button type="button" className="back-btn" onClick={handlePrevStep}>
                    ← Volver
                  </button>
                  <button
                    type="button"
                    className="submit-order-btn"
                    disabled={!formData.paymentMethod}
                    onClick={handleConfirmPayment}
                  >
                    Continuar a Confirmación →
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="step3-container">
                <h2>Confirmación de Pedido</h2>

                {/* Información de Contacto */}
                <div className="confirmation-section">
                  <div className="section-header">
                    <Mail size={20} />
                    <h3>Información de Contacto</h3>
                  </div>
                  <div className="confirmation-content">
                    <div className="info-row">
                      <span className="info-label">Nombre:</span>
                      <span className="info-value">{formData.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{formData.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Teléfono:</span>
                      <span className="info-value">{formData.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Dirección de Entrega */}
                <div className="confirmation-section">
                  <div className="section-header">
                    <MapPin size={20} />
                    <h3>Dirección de Entrega</h3>
                  </div>
                  <div className="confirmation-content">
                    <div className="info-row">
                      <span className="info-label">Dirección:</span>
                      <span className="info-value">{formData.address}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Ciudad:</span>
                      <span className="info-value">{formData.city}</span>
                    </div>
                  </div>
                </div>

                {/* Método de Pago */}
                <div className="confirmation-section">
                  <div className="section-header">
                    <CreditCard size={20} />
                    <h3>Método de Pago</h3>
                  </div>
                  <div className="confirmation-content">
                    <div className="info-row">
                      <span className="info-label">Método:</span>
                      <span className="info-value payment-badge">
                        {formData.paymentMethod === "tarjeta" && "Tarjeta Crédito"}
                        {formData.paymentMethod === "pse" && "PSE"}
                        {formData.paymentMethod === "efectivo" && "Efectivo"}
                        {formData.paymentMethod === "datafono" && "Datáfono"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="step-buttons-container">
                  <button type="button" className="back-btn" onClick={handlePrevStep}>
                    ← Volver
                  </button>
                  <button
                    type="button"
                    className="submit-order-btn final-confirm-btn"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Confirmar Pedido
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>

        <div className="order-summary">
          <h2>Resumen del Pedido</h2>
          <div className="order-items">
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;

              return (
                <div key={item.productId} className="order-item">
                  <div className="order-item-info">
                    <span className="order-item-name">{product.name}</span>
                    <span className="order-item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="order-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            {user?.isPremium && (
              <div className="total-row">
                <span>Descuento Premium (10%):</span>
                <span style={{ color: '#10B981', fontWeight: '600' }}>
                  -{formatPrice(getPremiumDiscount())}
                </span>
              </div>
            )}
            <div className="total-row">
              <span>Envío:</span>
              {user?.isPremium ? (
                <span style={{ color: '#9333EA', fontWeight: '600' }}>
                  💎 Gratis (Premium)
                </span>
              ) : getShippingCost() === 0 ? (
                <span style={{ color: '#10B981', fontWeight: '600' }}>
                  Gratis (compra &gt; $100.000)
                </span>
              ) : (
                <span>{formatPrice(getShippingCost())}</span>
              )}
            </div>
            <div className="total-row final-total">
              <span>Total:</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
