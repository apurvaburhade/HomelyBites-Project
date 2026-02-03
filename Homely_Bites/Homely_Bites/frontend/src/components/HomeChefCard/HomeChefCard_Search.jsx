import React from 'react'
import './HomeChefCard.css'

const HomeChefCard = ({ chef, onViewMenu }) => {
  const handleClick = () => {
    onViewMenu(chef.chef_id)
  }

  return (
    <div className='home-chef-card' onClick={handleClick}>
      <div className='chef-card-header'>
        <h3 className='business-name'>{chef.business_name}</h3>
        {chef.average_rating && (
          <div className='rating-badge'>
            <span className='star'>⭐</span>
            <span className='rating-value'>{chef.average_rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className='chef-card-body'>
        {chef.phone_number && (
          <div className='phone-info'>
            <span className='icon'>📞</span>
            <span className='phone-number'>{chef.phone_number}</span>
          </div>
        )}
        {chef.email && (
          <div className='email-info'>
            <span className='icon'>✉️</span>
            <span className='email'>{chef.email}</span>
          </div>
        )}
      </div>

      <div className='chef-card-footer'>
        <button className='view-menu-btn'>
          View Menu →
        </button>
      </div>
    </div>
  )
}

export default HomeChefCard
