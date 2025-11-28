import React, { useState } from "react";
import { CreditCard, Banknote, Wallet, PiggyBank, ChevronDown } from "lucide-react";
import "./PaymentMethods.css";

export default function PaymentMethods({ onPaymentSelect, showCod = true, variant = "default" }) {
  const [selected, setSelected] = useState(null);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [pseData, setPseData] = useState({
    bank: "",
    docType: "cc",
    docNumber: "",
  });

  const handleSelect = (method) => {
    setSelected(method);
    onPaymentSelect?.(method);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePseChange = (e) => {
    const { name, value } = e.target;
    setPseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^\d]/gi, "");
    const matches = v.match(/\d{4,}/g);
    return matches ? matches.map((match) => match.match(/\d{1,4}/g).join(" ")).join(" ") : v;
  };

  const containerClass = `payment-container${variant === "compact" ? " payment-container-compact" : ""}`;

  return (
    <div className={containerClass}>
      <h2 className="payment-title">Selecciona tu método de pago</h2>
      <p className="payment-subtitle">
        Contamos con pasarelas de pagos certificadas y seguras.
      </p>

      {/* 🔹 Pago Online */}
      <section className="payment-section">
        <h3 className="section-title">Pago online</h3>
        <div
          className={`payment-option ${selected === "tarjeta" ? "active" : ""}`}
          onClick={() => handleSelect("tarjeta")}
        >
          <div className="option-icon">
            <CreditCard size={32} strokeWidth={2.5} />
          </div>
          <div className="option-info">
            <h4>Tarjeta Crédito</h4>
          </div>
          <div className="option-radio">
            <input
              type="radio"
              name="payment"
              checked={selected === "tarjeta"}
              readOnly
            />
          </div>
        </div>

        {/* Formulario de Tarjeta de Crédito */}
        {selected === "tarjeta" && (
          <div className="card-form-container">
            <div className="card-form-header">
              <ChevronDown size={18} />
              <span>Ingresa los datos de tu tarjeta</span>
            </div>
            <form className="card-form">
              <div className="card-input-group full-width">
                <label htmlFor="cardNumber">Número de Tarjeta</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    if (formatted.replace(/\s/g, "").length <= 16) {
                      handleCardChange({ target: { name: "cardNumber", value: formatted } });
                    }
                  }}
                  maxLength="19"
                />
              </div>

              <div className="card-input-group full-width">
                <label htmlFor="cardHolder">Titular de la Tarjeta</label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  placeholder="Nombre Apellido"
                  value={cardData.cardHolder}
                  onChange={handleCardChange}
                />
              </div>

              <div className="card-inputs-row">
                <div className="card-input-group">
                  <label htmlFor="expiryDate">Vencimiento (MM/YY)</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="12/25"
                    value={cardData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + "/" + value.slice(2, 4);
                      }
                      handleCardChange({ target: { name: "expiryDate", value } });
                    }}
                    maxLength="5"
                  />
                </div>

                <div className="card-input-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 4) {
                        handleCardChange({ target: { name: "cvv", value } });
                      }
                    }}
                    maxLength="4"
                  />
                </div>
              </div>

              <div className="card-form-note">
                ✓ Tus datos están protegidos con encriptación de 256 bits
              </div>
            </form>
          </div>
        )}

        <div
          className={`payment-option ${selected === "pse" ? "active" : ""}`}
          onClick={() => handleSelect("pse")}
        >
          <div className="option-icon">
            <Wallet size={32} strokeWidth={2.5} />
          </div>
          <div className="option-info">
            <h4>PSE</h4>
          </div>
          <div className="option-radio">
            <input
              type="radio"
              name="payment"
              checked={selected === "pse"}
              readOnly
            />
          </div>
        </div>

        {/* Formulario PSE */}
        {selected === "pse" && (
          <div className="pse-form-container">
            <div className="card-form-header">
              <ChevronDown size={18} />
              <span>Datos para pago por PSE</span>
            </div>
            <form className="pse-form">
              <div className="card-input-group full-width">
                <label htmlFor="pseBank">Banco</label>
                <select
                  id="pseBank"
                  name="bank"
                  value={pseData.bank}
                  onChange={handlePseChange}
                >
                  <option value="">Selecciona tu banco</option>
                  <option value="bancolombia">Bancolombia</option>
                  <option value="davivienda">Davivienda</option>
                  <option value="bbva">BBVA</option>
                  <option value="bcp">Banco de Bogotá</option>
                </select>
              </div>

              <div className="card-inputs-row">
                <div className="card-input-group">
                  <label htmlFor="docType">Tipo de documento</label>
                  <select
                    id="docType"
                    name="docType"
                    value={pseData.docType}
                    onChange={handlePseChange}
                  >
                    <option value="cc">Cédula de ciudadanía</option>
                    <option value="ti">Tarjeta de identidad</option>
                    <option value="ce">Cédula de extranjería</option>
                  </select>
                </div>

                <div className="card-input-group">
                  <label htmlFor="docNumber">Número de documento</label>
                  <input
                    type="text"
                    id="docNumber"
                    name="docNumber"
                    placeholder="12345678"
                    value={pseData.docNumber}
                    onChange={(e) => handlePseChange(e)}
                  />
                </div>
              </div>

              <div className="card-form-note">
                Serás redirigido al portal de tu banco para completar el pago.
              </div>
            </form>
          </div>
        )}
      </section>

      {/* 🔹 Pago Contra Entrega (opcional, depende de showCod) */}
      {showCod && (
        <section className="payment-section">
        <h3 className="section-title">Pago contra entrega</h3>

        <div
          className={`payment-option ${selected === "efectivo" ? "active" : ""}`}
          onClick={() => handleSelect("efectivo")}
        >
          <div className="option-icon">
            <Banknote size={32} strokeWidth={2.5} />
          </div>
          <div className="option-info">
            <h4>Efectivo</h4>
            <p className="option-note">Costo adicional de $5000</p>
          </div>
          <div className="option-radio">
            <input
              type="radio"
              name="payment"
              checked={selected === "efectivo"}
              readOnly
            />
          </div>
        </div>

        <div
          className={`payment-option ${selected === "datafono" ? "active" : ""}`}
          onClick={() => handleSelect("datafono")}
        >
          <div className="option-icon">
            <PiggyBank size={32} strokeWidth={2.5} />
          </div>
          <div className="option-info">
            <h4>Datáfono</h4>
            <p className="option-note">Costo adicional de $5000</p>
          </div>
          <div className="option-radio">
            <input
              type="radio"
              name="payment"
              checked={selected === "datafono"}
              readOnly
            />
          </div>
        </div>
        </section>
      )}
    </div>
  );
}
