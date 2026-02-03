import React, { useState, useEffect, useContext } from 'react'
import { StoreContext } from '../../../context/StoreContext'
import '../styles/DashboardCart.css'

const DashboardCart = () => {
  const { token } = useContext(StoreContext)
  const [cartItems, setCartItems] = useState([])
  const [selectedChef, setSelectedChef] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('dashboardCart')
    if (savedCart) {
      const cartObj = JSON.parse(savedCart)
      const cartArray = Object.values(cartObj)
      setCartItems(cartArray)
      if (cartArray.length > 0) {
        setSelectedChef(cartArray[0].chef_id)
      }
    }
    if (token) {
      fetchAddresses()
    }
  }, [token])

  const fetchAddresses = async () => {
    try {
      console.log('Fetching addresses...')
      const response = await fetch('http://localhost:4000/customer/dashboard/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Cart data response:', data)
      if (data.status === 'success' && data.data) {
        console.log('Addresses loaded:', data.data.addresses)
        setAddresses(data.data.addresses || [])
        if (data.data.addresses && data.data.addresses.length > 0) {
          setSelectedAddress(data.data.addresses[0].address_id)
        }
      }
    } catch (err) {
      console.error('Error fetching addresses:', err)
      setError('Error fetching addresses: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      const updated = cartItems.map((item) =>
        item.item_id === itemId ? { ...item, quantity: newQuantity } : item
      )
      setCartItems(updated)
      const cartObj = {}
      updated.forEach(item => {
        cartObj[item.item_id] = item
      })
      localStorage.setItem('dashboardCart', JSON.stringify(cartObj))
    }
  }

  const removeItem = (itemId) => {
    const updated = cartItems.filter((item) => item.item_id !== itemId)
    setCartItems(updated)
    const cartObj = {}
    updated.forEach(item => {
      cartObj[item.item_id] = item
    })
    localStorage.setItem('dashboardCart', JSON.stringify(cartObj))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.base_price * item.quantity, 0)
  }

  const getDeliveryFee = () => {
    const subtotal = calculateTotal()
    return subtotal > 500 ? 0 : 50
  }

  const getGrandTotal = () => {
    return calculateTotal() + getDeliveryFee()
  }

  const handlePlaceOrder = async () => {
    if (!selectedChef || !selectedAddress || cartItems.length === 0) {
      setError('Please select an address and ensure cart is not empty')
      return
    }

    setError(null)
    setSuccess(null)

    try {
      setPlacing(true)
      console.log('Placing order with:', {
        chef_id: selectedChef,
        delivery_address_id: selectedAddress,
        cartItems: cartItems,
        grand_total: getGrandTotal()
      })

      const response = await fetch('http://localhost:4000/customer/dashboard/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chef_id: selectedChef,
          delivery_address_id: selectedAddress,
          cartItems: cartItems,
          grand_total: getGrandTotal()
        })
      })

      const data = await response.json()
      console.log('Order response:', data)
      
      if (data.status === 'success') {
        localStorage.removeItem('dashboardCart')
        setCartItems([])
        setSuccess('✓ Order placed successfully! Switching to orders...')
        // Use hash change instead of full page reload to avoid white screen
        setTimeout(() => {
          window.location.hash = 'orders'
        }, 1500)
      } else {
        setError(data.error || 'Failed to place order')
      }
    } catch (err) {
      console.error('Order error:', err)
      setError('Error placing order: ' + err.message)
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>
  }

  return (
    <div className="dashboard-cart">
      {/* Success Message */}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>🛒 Your Cart is Empty</h2>
          <p>Add items from the Home tab to get started!</p>
        </div>
      ) : (
        <div className="cart-container">
          {/* Cart Items */}
          <div className="cart-section">
            <h2>Cart Items ({cartItems.length})</h2>
            <div className="items-list">
              {cartItems.map((item) => (
                <div key={item.item_id} className="cart-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="price">₹{item.base_price}</p>
                  </div>
                  <div className="item-controls">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.item_id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.item_id, parseInt(e.target.value) || 1)
                      }
                      className="qty-input"
                    />
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.item_id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">₹{(item.base_price * item.quantity).toFixed(2)}</div>
                  <button className="remove-btn" onClick={() => removeItem(item.item_id)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout */}
          <div className="checkout-section">
            <h2>Delivery Details</h2>

            {/* Address Selection */}
            <div className="form-group">
              <label>Select Delivery Address</label>
              <select
                value={selectedAddress || ''}
                onChange={(e) => setSelectedAddress(parseInt(e.target.value))}
                className="select-input"
              >
                <option value="">Choose an address...</option>
                {addresses.map((addr) => (
                  <option key={addr.address_id} value={addr.address_id}>
                    {addr.label} - {addr.street}, {addr.city} {addr.pincode}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>₹{getDeliveryFee().toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{getGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={placing || cartItems.length === 0 || !selectedAddress}
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardCart
