import React, { useState, useEffect, useContext } from 'react'
import { StoreContext } from '../../../context/StoreContext'
import '../styles/DashboardFeedback.css'

const DashboardFeedback = () => {
  const { token } = useContext(StoreContext)
  const [feedbacks, setFeedbacks] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [formData, setFormData] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    if (token) {
      fetchFeedbacks()
      fetchOrdersForFeedback()
    }
  }, [token])

  const fetchFeedbacks = async () => {
    try {
      console.log('Fetching feedbacks...')
      const response = await fetch('http://localhost:4000/customer/feedbacks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Feedbacks response status:', response.status)
      const data = await response.json()
      console.log('Feedbacks data:', data)

      if (data.status === 'success' && data.data) {
        console.log('Feedbacks loaded:', data.data)
        setFeedbacks(Array.isArray(data.data) ? data.data : [])
        setError(null)
      } else {
        const errorMsg = data.error || 'Failed to load feedbacks'
        console.error('Error:', errorMsg)
        setFeedbacks([])
      }
    } catch (err) {
      const errorMsg = 'Error fetching feedbacks: ' + err.message
      console.error(errorMsg)
      setFeedbacks([])
    } finally {
      setLoading(false)
    }
  }

  const fetchOrdersForFeedback = async () => {
    try {
      const response = await fetch('http://localhost:4000/customer/dashboard/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.status === 'success' && data.data) {
        // Filter for delivered orders that don't have feedback yet
        const deliveredOrders = Array.isArray(data.data) 
          ? data.data.filter(order => order.status === 'Delivered')
          : []
        setOrders(deliveredOrders)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
    }
  }

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()

    if (!selectedOrderId) {
      setError('Please select an order')
      return
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setError('Rating must be between 1 and 5')
      return
    }

    try {
      console.log('Submitting feedback for order:', selectedOrderId)
      const response = await fetch('http://localhost:4000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: selectedOrderId,
          rating: parseInt(formData.rating),
          comment: formData.comment
        })
      })

      const data = await response.json()
      console.log('Feedback response:', data)

      if (data.status === 'success') {
        alert('✓ Feedback submitted successfully!')
        setFormData({ rating: 5, comment: '' })
        setSelectedOrderId(null)
        setShowFeedbackForm(false)
        fetchFeedbacks()
        fetchOrdersForFeedback()
      } else {
        setError(data.error || 'Failed to submit feedback')
      }
    } catch (err) {
      const errorMsg = 'Error submitting feedback: ' + err.message
      console.error(errorMsg)
      setError(errorMsg)
    }
  }

  const handleRatingChange = (e) => {
    setFormData({
      ...formData,
      rating: parseInt(e.target.value)
    })
  }

  const handleCommentChange = (e) => {
    setFormData({
      ...formData,
      comment: e.target.value
    })
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#228B22'
    if (rating >= 3) return '#FFA500'
    return '#DC143C'
  }

  if (!token) {
    return <div className="dashboard-feedback"><div className="error-message">Please log in to view feedbacks</div></div>
  }

  if (loading) {
    return <div className="dashboard-feedback"><div className="loading">Loading feedbacks...</div></div>
  }

  return (
    <div className="dashboard-feedback">
      {/* Submit Feedback Section */}
      {orders.length > 0 && (
        <div className="feedback-submit-section">
          <h2>📝 Share Your Feedback</h2>
          {!showFeedbackForm ? (
            <button 
              className="submit-feedback-btn"
              onClick={() => setShowFeedbackForm(true)}
            >
              + Add New Feedback
            </button>
          ) : (
            <form className="feedback-form" onSubmit={handleSubmitFeedback}>
              <div className="form-group">
                <label>Select Order *</label>
                <select 
                  value={selectedOrderId || ''} 
                  onChange={(e) => setSelectedOrderId(parseInt(e.target.value))}
                  required
                >
                  <option value="">-- Choose an order --</option>
                  {orders.map(order => (
                    <option key={order.order_id} value={order.order_id}>
                      Order #{order.order_id} - {order.business_name} (₹{order.grand_total.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Rating (1-5 stars) *</label>
                <div className="rating-input">
                  <select 
                    value={formData.rating}
                    onChange={handleRatingChange}
                    className="rating-select"
                  >
                    <option value="1">⭐ 1 - Poor</option>
                    <option value="2">⭐⭐ 2 - Fair</option>
                    <option value="3">⭐⭐⭐ 3 - Good</option>
                    <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                  </select>
                  <div className="rating-display">
                    {'⭐'.repeat(formData.rating)}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Comments</label>
                <textarea 
                  value={formData.comment}
                  onChange={handleCommentChange}
                  placeholder="Share your thoughts about this order... (optional)"
                  rows="4"
                  maxLength="500"
                />
                <small>{formData.comment.length}/500 characters</small>
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  Submit Feedback
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowFeedbackForm(false)
                    setFormData({ rating: 5, comment: '' })
                    setSelectedOrderId(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Feedbacks List */}
      {feedbacks.length === 0 ? (
        <div className="empty-feedbacks">
          <h2>📭 No Feedbacks Yet</h2>
          <p>You haven't submitted any feedback yet. Complete an order to leave feedback!</p>
        </div>
      ) : (
        <div className="feedbacks-section">
          <h2>📋 Your Feedbacks ({feedbacks.length})</h2>
          <div className="feedbacks-list">
            {feedbacks.map((feedback) => (
              <div key={feedback.feedback_id} className="feedback-card">
                <div className="feedback-header">
                  <div className="feedback-order">
                    <h3>Order #{feedback.order_id}</h3>
                    <p className="feedback-date">{new Date(feedback.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="feedback-rating">
                    <div 
                      className="rating-stars"
                      style={{ color: getRatingColor(feedback.rating) }}
                    >
                      {'⭐'.repeat(feedback.rating)}
                    </div>
                    <p className="rating-value">{feedback.rating}/5</p>
                  </div>
                </div>

                {feedback.comment && (
                  <div className="feedback-comment">
                    <p>{feedback.comment}</p>
                  </div>
                )}

                {feedback.business_name && (
                  <div className="feedback-chef">
                    <p>Chef: <strong>{feedback.business_name}</strong></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default DashboardFeedback
