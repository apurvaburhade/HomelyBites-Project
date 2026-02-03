const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

// Get all menu items by chef_id
router.get('/chef/:chef_id', (req, res) => {
  const { chef_id } = req.params

  // Validate chef_id
  if (!chef_id || isNaN(chef_id)) {
    return res.status(400).send({
      status: 'error',
      message: 'Invalid chef_id provided'
    })
  }

  const sql = `
    SELECT 
      m.item_id,
      m.name,
      m.base_price,
      m.is_available,
      m.description,
      m.image_url,
      m.created_at,
      m.chef_id,
      h.business_name,
      h.phone_number,
      h.average_rating
    FROM MenuItems m
    JOIN HomeChefs h ON m.chef_id = h.chef_id
    WHERE m.chef_id = ? AND h.is_active = TRUE
    ORDER BY m.created_at DESC
  `

  pool.query(sql, [chef_id], (err, data) => {
    if (err) {
      return res.status(500).send({
        status: 'error',
        message: 'Error fetching menu items: ' + err.message
      })
    }

    if (data.length === 0) {
      return res.status(404).send({
        status: 'success',
        message: 'No menu items found for this chef',
        data: []
      })
    }

    res.status(200).send({
      status: 'success',
      data: data,
      count: data.length
    })
  })
})

// Get menu items by chef_id (alternative route name)
router.get('/chef-menu/:chef_id', (req, res) => {
  const { chef_id } = req.params

  // Validate chef_id
  if (!chef_id || isNaN(chef_id)) {
    return res.status(400).send({
      status: 'error',
      message: 'Invalid chef_id provided'
    })
  }

  const sql = `
    SELECT 
      m.item_id,
      m.name,
      m.base_price,
      m.is_available,
      m.description,
      m.image_url,
      m.created_at,
      m.chef_id,
      h.business_name,
      h.phone_number,
      h.average_rating
    FROM MenuItems m
    JOIN HomeChefs h ON m.chef_id = h.chef_id
    WHERE m.chef_id = ? AND h.is_active = TRUE
    ORDER BY m.created_at DESC
  `

  pool.query(sql, [chef_id], (err, data) => {
    if (err) {
      return res.status(500).send({
        status: 'error',
        message: 'Error fetching menu items: ' + err.message
      })
    }

    if (data.length === 0) {
      return res.status(404).send({
        status: 'success',
        message: 'No menu items found for this chef',
        data: []
      })
    }

    res.status(200).send({
      status: 'success',
      data: data,
      count: data.length
    })
  })
})

module.exports = router









