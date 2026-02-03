import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ChefMenu.css'
import { StoreContext } from '../../context/StoreContext'

const ChefMenu = () => {
  const { chefId } = useParams()
  const navigate = useNavigate()
  const { token, cartItems, addToCart } = useContext(StoreContext)
  const [chefInfo, setChefInfo] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedItems, setAddedItems] = useState(new Set())

  useEffect(() => {
    fetchChefMenu()
  }, [chefId])

  const fetchChefMenu = async () => {
    try {
      setLoading(true)
      // Get all menu items and chef info
      const response = await axios.get(`http://localhost:4000/api/chef/menu/${chefId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.status === 'success') {
        setChefInfo(response.data.data.chef)
        setMenuItems(response.data.data.items || [])
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching chef menu:', err)
      // Fallback: try alternative endpoint
      fetchChefMenuFallback()
    } finally {
      setLoading(false)
    }
  }

  const fetchChefMenuFallback = async () => {
    try {
      // Get all menu items from dashboard
      const response = await axios.get('http://localhost:4000/customer/dashboard/home', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.status === 'success') {
        const items = response.data.data.popularItems.filter(item => 
          item.chef_id === parseInt(chefId)
        )
        
        const chef = response.data.data.featuredChefs.find(c => 
          c.chef_id === parseInt(chefId)
        )

        setChefInfo(chef)
        setMenuItems(items)
      }
    } catch (err) {
      setError('Failed to load chef menu. Please try again.')
      console.error('Error fetching menu:', err)
    }
  }

  const handleAddToCart = (item) => {
    addToCart(item.item_id)
    setAddedItems(new Set([...addedItems, item.item_id]))
    
    // Show feedback
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(item.item_id)
        return newSet
      })
    }, 2000)
  }

  const handleGoToCart = () => {
    navigate('/customer/dashboard')
  }

  const handleBack = () => {
    navigate('/browse')
  }

  if (loading) {
    return <div className='chef-menu-container'><div className='loading'>Loading menu...</div></div>
  }

  return (
    <div className='chef-menu-container'>
      <div className='menu-header'>
        <button className='back-btn' onClick={handleBack}>← Back to Chefs</button>
        
        <div className='chef-info-section'>
          {chefInfo && (
            <>
              <h1>{chefInfo.business_name}</h1>
              <div className='chef-stats'>
                <span className='rating'>⭐ {chefInfo.average_rating ? chefInfo.average_rating.toFixed(1) : 'New'}</span>
                <span className='orders'>📦 {chefInfo.total_orders || 0} orders</span>
              </div>
            </>
          )}
        </div>
      </div>

      {error && <div className='error-message'>{error}</div>}

      {menuItems.length === 0 ? (
        <div className='no-items'>
          <p>No menu items available from this chef yet</p>
        </div>
      ) : (
        <div className='menu-grid'>
          {menuItems.map((item) => (
            <div key={item.item_id} className='menu-item-card'>
              {item.image_url && (
                <div className='item-image'>
                  <img src={item.image_url} alt={item.name} />
                </div>
              )}

              <div className='item-content'>
                <h3>{item.name}</h3>
                
                {item.description && (
                  <p className='item-description'>{item.description}</p>
                )}

                <div className='item-footer'>
                  <div className='item-price'>
                    <span className='price'>₹{item.base_price}</span>
                  </div>

                  <button
                    className={`add-to-cart-btn ${addedItems.has(item.item_id) ? 'added' : ''}`}
                    onClick={() => handleAddToCart(item)}
                  >
                    {addedItems.has(item.item_id) ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {menuItems.length > 0 && (
        <div className='cart-action'>
          <button className='view-cart-btn' onClick={handleGoToCart}>
            🛒 Go to Cart
          </button>
        </div>
      )}
    </div>
  )
}

export default ChefMenu
