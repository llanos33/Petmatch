import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiPath } from '../config/api';
import { Star, User } from 'lucide-react';
import './ProductReviews.css';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getAuthToken, logout } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(apiPath(`/api/products/${productId}/reviews`));
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = getAuthToken();
      const response = await fetch(apiPath(`/api/products/${productId}/reviews`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      if (response.ok) {
        const savedReview = await response.json();
        setReviews([...reviews, savedReview]);
        setNewReview({ rating: 5, comment: '' });
        setError(null);
      } else {
        const errData = await response.json();
        if (response.status === 401 || response.status === 403) {
          logout();
          setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        } else {
          setError(errData.error);
        }
      }
    } catch (err) {
      setError('Error submitting review');
    }
  };

  return (
    <div className="product-reviews">
      <h3>Reseñas de Clientes</h3>
      
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No hay reseñas aún. ¡Sé el primero en opinar!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <User size={20} />
                  <span className="reviewer-name">{review.userName}</span>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < review.rating ? "#FFD700" : "none"} 
                      color={i < review.rating ? "#FFD700" : "#ccc"}
                    />
                  ))}
                </div>
                <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="review-form">
          <h4>Escribe una reseña</h4>
          {error && <p className="error-message">{error}</p>}
          
          <div className="rating-input">
            <label>Calificación:</label>
            <div className="stars-select">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className="star-cursor"
                  fill={star <= newReview.rating ? "#FFD700" : "none"}
                  color={star <= newReview.rating ? "#FFD700" : "#ccc"}
                  onClick={() => setNewReview({...newReview, rating: star})}
                />
              ))}
            </div>
          </div>

          <div className="comment-input">
            <label>Tu opinión:</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              required
              placeholder="Cuéntanos qué te pareció el producto..."
            />
          </div>

          <button type="submit" className="submit-review-btn">Publicar Reseña</button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Inicia sesión para dejar una reseña</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
