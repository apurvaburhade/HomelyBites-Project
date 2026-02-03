import React, { useState, useEffect, useContext } from 'react'
import { StoreContext } from '../../../context/StoreContext'
import '../styles/DashboardOrders.css'

const DashboardOrders = () => {
  const { token } = useContext(StoreContext)
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [stats, setStats] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      setLoading(true)
      setError(null)
      fetchOrders()
      fetchStats()
    }
  }, [statusFilter, token])

  const fetchOrders = async () => {
    try {
      const url = statusFilter === 'all' 
        ? 'http://localhost:4000/customer/dashboard/orders' 
        : `http://localhost:4000/customer/dashboard/orders?status=${statusFilter}`

      console.log('Fetching orders from:', url)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.status === 'success' && data.data) {
        console.log('Orders loaded:', data.data)
        setOrders(Array.isArray(data.data) ? data.data : [])
        setError(null)
      } else {
        const errorMsg = data.error || 'Failed to load orders'
        console.error('Error:', errorMsg)
        setError(errorMsg)
        setOrders([])
      }
    } catch (err) {
      const errorMsg = 'Error fetching orders: ' + err.message
      console.error(errorMsg)
      setError(errorMsg)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      console.log('Fetching stats...')
      const response = await fetch('http://localhost:4000/customer/dashboard/orders/stats/summary', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Stats response status:', response.status)
      const data = await response.json()
      console.log('Stats data:', data)
      
      if (data.status === 'success' && data.data) {
        console.log('Stats loaded:', data.data)
        setStats(data.data)
      } else {
        console.error('Stats error:', data.error)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:4000/customer/dashboard/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.status === 'success' && data.data) {
        setOrderDetails(data.data)
        setSelectedOrder(orderId)
      }
    } catch (err) {
      setError('Error fetching order details: ' + err.message)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return

    try {
      const response = await fetch(`http://localhost:4000/customer/dashboard/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.status === 'success') {
        alert('Order cancelled successfully')
        fetchOrders()
        setSelectedOrder(null)
        setOrderDetails(null)
      } else {
        setError(data.result || 'Failed to cancel order')
      }
    } catch (err) {
      setError('Error cancelling order: ' + err.message)
    }
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'Placed': '#FFA500',
      'Accepted': '#4169E1',
      'Preparing': '#FF6347',
      'Ready': '#32CD32',
      'Picked Up': '#1E90FF',
      'Delivered': '#228B22',
      'Cancelled': '#696969'
    }
    return statusColors[status] || '#666'
  }

  if (!token) {
    return <div className="dashboard-orders"><div className="error-message">Please log in to view your orders</div></div>
  }

  if (loading) {
    return <div className="dashboard-orders"><div className="loading">Loading orders...</div></div>
  }

  return (
    <div className="dashboard-orders">
      {/* Stats */}
      {stats && (
        <div className="order-stats">
          <div className="stat-box">
            <h4>Total Orders</h4>
            <p className="stat-value">{stats.total_orders || 0}</p>
          </div>
          <div className="stat-box">
            <h4>Total Spent</h4>
            <p className="stat-value">₹{(parseFloat(stats.total_spent) || 0).toFixed(2)}</p>
          </div>
          <div className="stat-box">
            <h4>Delivered</h4>
            <p className="stat-value">{stats.delivered_orders || 0}</p>
          </div>
          <div className="stat-box">
            <h4>Avg Order Value</h4>
            <p className="stat-value">₹{(parseFloat(stats.avg_order_value) || 0).toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="filter-section">
        <div className="filter-header">
          <label>Filter by Status:</label>
          <button 
            className="refresh-btn"
            onClick={() => {
              setLoading(true)
              fetchOrders()
              fetchStats()
            }}
            title="Refresh orders"
          >
            🔄 Refresh
          </button>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Orders
          </button>
          <button
            className={`filter-btn ${statusFilter === 'Placed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Placed')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${statusFilter === 'Delivered' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Delivered')}
          >
            Delivered
          </button>
          <button
            className={`filter-btn ${statusFilter === 'Cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>📦 No Orders Found</h2>
          <p>You haven't placed any orders yet. Start ordering from the Home tab!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.order_id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <h3>Order #{order.order_id}</h3>
                  <p className="order-date">{new Date(order.order_time).toLocaleDateString()}</p>
                </div>
                <div className="order-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="order-info">
                <p><strong>Chef:</strong> {order.business_name}</p>
                <p><strong>Items:</strong> {order.item_count}</p>
                <p><strong>Amount:</strong> ₹{(parseFloat(order.grand_total) || 0).toFixed(2)}</p>
                <p><strong>Delivery:</strong> {order.city}, {order.pincode}</p>
              </div>
              <div className="order-actions">
                <button
                  className="view-details-btn"
                  onClick={() => fetchOrderDetails(order.order_id)}
                >
                  View Details
                </button>
                {order.status === 'Delivered' && (
                  <a 
                    href={`/customer/dashboard#feedback`}
                    className="feedback-btn"
                    title="Leave feedback for this order"
                  >
                    ⭐ Feedback
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal Popup */}
      {orderDetails && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="details-header">
              <h2>Order #{orderDetails.order_id} Details</h2>
              <button 
                type="button"
                className="close-btn" 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedOrder(null)
                  setOrderDetails(null)
                }}
                title="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="details-content">
              {/* Order Status */}
              <div className="detail-section">
                <h3>📍 Order Status</h3>
                <span
                  className="status-badge-large"
                  style={{ backgroundColor: getStatusColor(orderDetails.status) }}
                >
                  {orderDetails.status}
                </span>
              </div>

              {/* Order Date */}
              <div className="detail-section">
                <h3>📅 Order Date</h3>
                <p>{new Date(orderDetails.order_time).toLocaleString()}</p>
              </div>

              {/* Chef Info */}
              <div className="detail-section">
                <h3>👨‍🍳 Chef Information</h3>
                <p><strong>{orderDetails.business_name}</strong></p>
                <p>Rating: {orderDetails.average_rating || 'N/A'} ⭐</p>
                <p>Phone: {orderDetails.chef_phone || 'N/A'}</p>
              </div>

              {/* Order Items */}
              <div className="detail-section">
                <h3>🍽️ Items Ordered</h3>
                <div className="items-table">
                  {orderDetails.items && orderDetails.items.map((item) => (
                    <div key={item.order_item_id} className="item-row">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                      <span>₹{(parseFloat(item.unit_price_at_purchase) * parseFloat(item.quantity) || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="detail-section">
                <h3>📍 Delivery Address</h3>
                <p>{orderDetails.house_no}, {orderDetails.street}</p>
                <p>{orderDetails.city}, {orderDetails.pincode}</p>
              </div>

              {/* Delivery Person */}
              {orderDetails.delivery_first_name && (
                <div className="detail-section">
                  <h3>🚗 Delivery Partner</h3>
                  <p><strong>{orderDetails.delivery_first_name} {orderDetails.delivery_last_name}</strong></p>
                  <p>Phone: {orderDetails.delivery_phone || 'N/A'}</p>
                </div>
              )}

              {/* Order Total */}
              <div className="detail-section total-section">
                <h3>💰 Total Amount</h3>
                <p className="total-amount">₹{(parseFloat(orderDetails.grand_total) || 0).toFixed(2)}</p>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                {orderDetails.status === 'Placed' && (
                  <button
                    type="button"
                    className="cancel-order-btn"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleCancelOrder(orderDetails.order_id)
                    }}
                    title="Cancel this order"
                  >
                    Cancel Order
                  </button>
                )}
                {orderDetails.status === 'Delivered' && (
                  <a 
                    href={`/customer/dashboard#feedback`}
                    className="feedback-btn modal-feedback-btn"
                    title="Leave feedback for this order"
                  >
                    ⭐ Leave Feedback
                  </a>
                )}
                <button
                  type="button"
                  className="close-modal-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedOrder(null)
                    setOrderDetails(null)
                  }}
                  title="Close modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default DashboardOrders
