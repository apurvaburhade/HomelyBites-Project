import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {

  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)
  const [imageError, setImageError] = useState(false)

  // ✅ ensure consistent key type
  const itemId = id.toString()

  // Build full image URL if it's a relative path
  const getImageUrl = (imagePath) => {
    // Log the incoming image path
    console.log(`[FoodItem] Item: "${name}", Image Path: "${imagePath}"`)
    
    if (!imagePath || imagePath === 'null') {
      console.log(`  └─ No image path, using placeholder`)
      return assets.placeholder_image
    }
    
    // If it's already an absolute URL (full http), use it as-is
    if (imagePath.startsWith('http')) {
      console.log(`  └─ Absolute URL, using as-is: ${imagePath}`)
      return imagePath
    }
    
    // If it's a relative path starting with /uploads, prepend base URL
    if (imagePath.startsWith('/uploads')) {
      const fullUrl = `${url}${imagePath}`
      console.log(`  └─ Relative path converted: ${imagePath} -> ${fullUrl}`)
      return fullUrl
    }
    
    // Fallback
    console.log(`  └─ Unknown format, using placeholder`)
    return assets.placeholder_image || imagePath
  }

  const displayImage = imageError ? assets.placeholder_image : getImageUrl(image)

  const handleImageError = () => {
    console.log(`[FoodItem] Image failed to load for "${name}": ${displayImage}`)
    setImageError(true)
  }

  return (
    <div className='food-item'>

      <div className='food-item-img-container'>
        <img 
          className='food-item-image' 
          src={displayImage} 
          alt={name}
          onError={handleImageError}
        />

        {!cartItems[itemId] ? (
          <img
            className='add'
            src={assets.add_icon_white}
            alt='add'
            onClick={() => addToCart(itemId)}
          />
        ) : (
          <div className='food-item-counter'>
            <img
              src={assets.remove_icon_red}
              alt='remove'
              onClick={() => removeFromCart(itemId)}
            />
            <p>{cartItems[itemId]}</p>
            <img
              src={assets.add_icon_green}
              alt='add'
              onClick={() => addToCart(itemId)}
            />
          </div>
        )}
      </div>

      <div className='food-item-info'>
        <div className='food-item-name-rating'>
          <p>{name}</p>
          <img src={assets.rating_starts} alt='rating' />
        </div>
        <p className='food-item-desc'>{description}</p>
        <p className='food-item-price'>${price}</p>
      </div>

    </div>
  )
}

export default FoodItem
