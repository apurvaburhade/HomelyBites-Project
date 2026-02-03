import React, { useState } from 'react'
import './AddMenuItem.css'
import { homeChefService } from '../../services/homeChefService'

const AddMenuItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    description: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, or WEBP)')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }))
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError('Item name is required')
        setLoading(false)
        return
      }

      if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
        setError('Valid price is required')
        setLoading(false)
        return
      }

      const response = await homeChefService.addMenuItem(
        formData.name,
        parseFloat(formData.basePrice),
        formData.description,
        formData.image
      )

      if (response.status === 'success' && response.data) {
        setSuccess('Menu item added successfully!')
        setFormData({ name: '', basePrice: '', description: '', image: null })
        setImagePreview(null)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || response.result || 'Failed to add menu item')
      }
    } catch (err) {
      setError('Error adding menu item: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='add-menu-item'>
      <h2>Add New Menu Item</h2>

      {error && <div className='error-message'>{error}</div>}
      {success && <div className='success-message'>{success}</div>}

      <form onSubmit={handleSubmit} className='add-form'>
        {/* Item Name */}
        <div className='form-group'>
          <label htmlFor='name'>Item Name *</label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='e.g., Paneer Tikka Masala'
            required
          />
        </div>

        {/* Price */}
        <div className='form-group'>
          <label htmlFor='basePrice'>Price (₹) *</label>
          <input
            type='number'
            id='basePrice'
            name='basePrice'
            value={formData.basePrice}
            onChange={handleChange}
            placeholder='e.g., 299'
            step='0.01'
            min='0'
            required
          />
        </div>

        {/* Image Upload */}
        <div className='form-group'>
          <label htmlFor='image'>Food Image</label>
          <div className='image-upload-container'>
            {!imagePreview ? (
              <div className='image-upload-area'>
                <input
                  type='file'
                  id='image'
                  name='image'
                  onChange={handleImageChange}
                  accept='image/*'
                  className='image-input'
                />
                <div className='upload-prompt'>
                  <p>📷 Click to upload or drag and drop</p>
                  <p className='upload-hint'>PNG, JPG, WEBP up to 5MB</p>
                </div>
              </div>
            ) : (
              <div className='image-preview-container'>
                <img src={imagePreview} alt='Preview' className='image-preview' />
                <button
                  type='button'
                  className='remove-image-btn'
                  onClick={removeImage}
                  title='Remove image'
                >
                  ✕ Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Describe your dish ingredients, preparation style, etc.'
            rows='5'
          ></textarea>
        </div>

        <button type='submit' className='submit-btn' disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  )
}

export default AddMenuItem
