import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiPath } from '../config/api';
import { MessageCircle, User, ShieldCheck, Send } from 'lucide-react';
import './Consultations.css';
import { Link } from 'react-router-dom';

function Consultations() {
  const { user, getAuthToken } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [petType, setPetType] = useState('General');
  const [submitting, setSubmitting] = useState(false);

  // Admin reply state
  const [replyText, setReplyText] = useState({}); // Map of consultationId -> text

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch(apiPath('/api/consultations'));
      if (!response.ok) throw new Error('Error al cargar consultas');
      const data = await response.json();
      setConsultations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await fetch(apiPath('/api/consultations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, question, petType })
      });

      if (!response.ok) throw new Error('Error al enviar consulta');

      const newConsultation = await response.json();
      setConsultations([newConsultation, ...consultations]);
      setTitle('');
      setQuestion('');
      setPetType('General');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (consultationId) => {
    const answer = replyText[consultationId];
    if (!answer) return;

    try {
      const token = getAuthToken();
      const response = await fetch(apiPath(`/api/consultations/${consultationId}/answer`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answer })
      });

      if (!response.ok) throw new Error('Error al enviar respuesta');

      const updatedConsultation = await response.json();
      setConsultations(consultations.map(c => 
        c.id === consultationId ? updatedConsultation : c
      ));
      setReplyText(prev => ({ ...prev, [consultationId]: '' }));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Cargando consultas...</div>;

  return (
    <div className="consultations-container">
      <div className="consultations-header">
        <h1>Consultas Veterinarias</h1>
        <p className="consultations-subtitle">
          Resuelve tus dudas con nuestros expertos. Pregunta sobre salud, comportamiento o cuidados.
        </p>
      </div>

      <div className="consultations-content">
        <div className="consultation-form-card">
          {user ? (
            <>
              <h3><MessageCircle size={20} style={{verticalAlign: 'middle', marginRight: '8px'}}/> Nueva Consulta</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Resumen breve de tu duda"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Tipo de Mascota</label>
                  <select 
                    className="form-control"
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Tu Pregunta</label>
                  <textarea
                    className="form-control"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Describe detalladamente los síntomas o tu inquietud..."
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Enviar Consulta'}
                </button>
              </form>
            </>
          ) : (
            <div className="login-prompt">
              <p>¿Tienes una duda sobre tu mascota?</p>
              <p>
                <Link to="/login" className="login-link">Inicia sesión</Link> para realizar una consulta a nuestros expertos.
              </p>
            </div>
          )}
        </div>

        <div className="consultations-list">
          {consultations.length === 0 ? (
            <div className="no-consultations">
              <p>No hay consultas aún. ¡Sé el primero en preguntar!</p>
            </div>
          ) : (
            consultations.map(consultation => (
              <div key={consultation.id} className="consultation-card">
                <div className="consultation-header">
                  <div className="consultation-info">
                    <h3>{consultation.title}</h3>
                    <div className="consultation-meta">
                      <span className="user-name">
                        <User size={14} /> {consultation.userName}
                      </span>
                      <span className="date">
                        {new Date(consultation.createdAt).toLocaleDateString()}
                      </span>
                      <span className="pet-tag">{consultation.petType}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${consultation.status}`}>
                    {consultation.status === 'answered' ? 'Respondida' : 'Pendiente'}
                  </span>
                </div>

                <div className="consultation-body">
                  <p className="question-text">{consultation.question}</p>
                  
                  {consultation.answer && (
                    <div className="admin-answer">
                      <div className="answer-header">
                        <ShieldCheck size={16} />
                        Respuesta de PetMatch
                      </div>
                      <p className="answer-text">{consultation.answer}</p>
                    </div>
                  )}
                </div>

                {user?.isAdmin && !consultation.answer && (
                  <div className="admin-reply-form">
                    <textarea
                      className="reply-input"
                      placeholder="Escribe tu respuesta profesional..."
                      value={replyText[consultation.id] || ''}
                      onChange={(e) => setReplyText({
                        ...replyText,
                        [consultation.id]: e.target.value
                      })}
                    />
                    <button 
                      className="reply-btn"
                      onClick={() => handleReply(consultation.id)}
                      disabled={!replyText[consultation.id]}
                    >
                      <Send size={14} style={{marginRight: '5px'}}/> Enviar Respuesta
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Consultations;
