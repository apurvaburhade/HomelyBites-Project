import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Kitchen.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'

const Kitchen = () => {
  const { chef_id } = useParams()
  const navigate = useNavigate()
  const { token, url } = useContext(StoreContext)
  
  const [kitchenData, setKitchenData] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!chef_id || isNaN(chef_id)) {
      setError('Invalid chef ID')
      setLoading(false)
      return
    }

    fetchKitchenData()
  }, [chef_id])

  const fetchKitchenData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch menu items for the chef
      const response = await fetch(`${url}/menu/chef/${chef_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.status === 'success' && data.data && data.data.length > 0) {
        // Use first item to get kitchen info (business_name, phone_number, average_rating)
        const firstItem = data.data[0]
        setKitchenData({
          chef_id: firstItem.chef_id,
          business_name: firstItem.business_name,
          phone_number: firstItem.phone_number,
          average_rating: firstItem.average_rating
        })

        // Transform menu items to match FoodItem format
        const transformedItems = data.data.map((item) => ({
          _id: item.item_id.toString(),
          name: item.name,
          image: item.image_url || null,
          price: parseFloat(item.base_price),
          description: item.description,
          category: 'All',
          chef_id: item.chef_id,
          business_name: item.business_name
        }))

        setMenuItems(transformedItems)
      } else {
        setError(data.message || 'No menu items found for this kitchen')
        setMenuItems([])
      }
    } catch (err) {
      console.error('Error fetching kitchen data:', err)
      setError('Failed to load kitchen. Please try again.')
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className='kitchen-container'>
        <div className='loading'>
          <p>Loading kitchen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='kitchen-container'>
      {/* Back Button */}
      <button className='back-btn' onClick={handleBackClick}>
        ← Back to Home
      </button>

      {error ? (
        <div className='error-message'>
          <p>{error}</p>
          <button onClick={handleBackClick}>Go Back Home</button>
        </div>
      ) : kitchenData ? (
        <>
          {/* Kitchen Header */}
          <div className='kitchen-header'>
            <div className='kitchen-info'>
              <h1>{kitchenData.business_name}</h1>
              <div className='kitchen-details'>
                <span className='rating'>
                  ⭐ {kitchenData.average_rating ? kitchenData.average_rating.toFixed(1) : 'N/A'} rating
                </span>
                {kitchenData.phone_number && (
                  <span className='phone'>📞 {kitchenData.phone_number}</span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className='kitchen-menu-section'>
            <h2>Menu</h2>
            {menuItems.length > 0 ? (
              <div className='kitchen-menu-list'>
                {menuItems.map((item, index) => (
                  <FoodItem
                    key={index}
                    id={item._id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                  />
                ))}
              </div>
            ) : (
              <div className='no-items'>
                <p>No menu items available at this kitchen</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className='error-message'>
          <p>Kitchen not found</p>
          <button onClick={handleBackClick}>Go Back Home</button>
        </div>
      )}
    </div>
  )
}

export default Kitchen
