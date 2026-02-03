import React, { useState, useEffect } from 'react'
import './Orders.css'
import { homeChefService } from '../../services/homeChefService'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('[Orders] Starting fetch...')
      const response = await homeChefService.getOrders()
      console.log('[Orders] Response received:', response)
      
      if (response && response.status === 'success') {
        const orderData = Array.isArray(response.data) ? response.data : []
        console.log('[Orders] Parsed orders:', orderData.length, 'items')
        setOrders(orderData)
        if (orderData.length === 0) {
          console.log('[Orders] No orders found but fetch successful')
          setError('')
        }
      } else if (response && response.error) {
        // Backend returned an error
        const errorMsg = response.error || response.message || 'Failed to fetch orders'
        console.error('[Orders] Backend error:', errorMsg)
        setError(errorMsg)
        setOrders([])
      } else if (response && response.status === 'error') {
        // Explicit error status
        const errorMsg = response.error || response.message || 'Failed to fetch orders'
        console.error('[Orders] Error status:', errorMsg)
        setError(errorMsg)
        setOrders([])
      } else {
        // Unexpected response format
        console.error('[Orders] Unexpected response:', response)
        setError('Unexpected response format from server')
        setOrders([])
      }
    } catch (err) {
      console.error('[Orders] Catch error:', err)
      const errorMsg = typeof err === 'string' ? err : (err.message || 'Failed to fetch orders')
      setError(`Network error: ${errorMsg}`)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await homeChefService.updateOrderStatus(orderId, newStatus)
      console.log('Update status response:', response)
      
      if (response && response.status === 'success') {
        // Refetch orders after successful update
        await fetchOrders()
        setError('')
      } else {
        const errorMsg = response?.error || response?.message || 'Failed to update status'
        setError(typeof errorMsg === 'string' ? errorMsg : 'Failed to update status')
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      setError(typeof err === 'string' ? err : (err.message || 'Error updating order status'))
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ff9800',
      'confirmed': '#2196f3',
      'preparing': '#9c27b0',
      'ready': '#4caf50',
      'completed': '#8bc34a',
      'cancelled': '#f44336'
    }
    return colors[status] || '#666'
  }

  const filteredOrders = orders.filter(order => 
    filter === 'all' || (order.order_status && order.order_status === filter)
  )

  const handleDebugInfo = () => {
    const token = localStorage.getItem('homeChefToken')
    const chefInfo = localStorage.getItem('homeChefInfo')
    console.log('=== DEBUG INFO ===')
    console.log('Token exists:', !!token)
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log('Token chef_id:', payload.chef_id)
      } catch (e) {
        console.log('Token invalid:', e.message)
      }
    }
    console.log('Chef info:', chefInfo)
    console.log('Current URL:', window.location.href)
    alert('Debug info logged to console (F12). Check Network tab for /homechef/orders request.')
  }

  return (
    <div className='orders-dashboard'>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2>Orders Management</h2>
        <button 
          onClick={handleDebugInfo}
          style={{
            padding: '0.5rem 1rem',
            background: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
          title="Click to log debug info"
        >
          🔍 Debug
        </button>
      </div>

      {error && (
        <div className='error-message'>
          ⚠️ {typeof error === 'string' ? error : 'An error occurred'}
        </div>
      )}

      <div className='filter-section'>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className='filter-select'
        >
          <option value='all'>All Orders</option>
          <option value='pending'>Pending</option>
          <option value='confirmed'>Confirmed</option>
          <option value='preparing'>Preparing</option>
          <option value='ready'>Ready</option>
          <option value='completed'>Completed</option>
          <option value='cancelled'>Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className='loading'>
          <p>📦 Loading orders...</p>
        </div>
      ) : error ? (
        <div className='error-detail' style={{padding: '2rem', textAlign: 'center', color: '#d32f2f'}}>
          <p>❌ Failed to load orders</p>
          <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>Error: {typeof error === 'string' ? error : 'Unknown error'}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className='empty-state'>
          <p>📋 No orders found</p>
          {filter !== 'all' && <p style={{fontSize: '0.9rem', color: '#666'}}>Try changing the filter to see all orders</p>}
        </div>
      ) : (
        <div className='orders-grid'>
          <p style={{marginBottom: '1rem', color: '#666'}}>Showing {filteredOrders.length} order(s)</p>
          {filteredOrders.map(order => (
            <div key={order.order_id} className='order-card'>
              <div className='order-header'>
                <h3>Order #{order.order_id}</h3>
                <span 
                  className='status-badge'
                  style={{ backgroundColor: getStatusColor(order.order_status) }}
                >
                  {order.order_status}
                </span>
              </div>
              <div className='order-details'>
                <p><strong>Customer:</strong> {order.first_name || '?'} {order.last_name || '?'}</p>
                <p><strong>Phone:</strong> {order.phone_number || 'N/A'}</p>
                <p><strong>Items:</strong> {order.item_count || 0}</p>
                <p><strong>Amount:</strong> ₹{order.total_amount || 0}</p>
                <p><strong>Time:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</p>
              </div>
              <div className='order-actions'>
                <select 
                  value={order.order_status}
                  onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                  className='status-select'
                >
                  <option value='pending'>Pending</option>
                  <option value='confirmed'>Confirmed</option>
                  <option value='preparing'>Preparing</option>
                  <option value='ready'>Ready</option>
                  <option value='completed'>Completed</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
