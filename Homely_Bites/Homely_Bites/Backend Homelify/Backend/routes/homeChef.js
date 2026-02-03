const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../utils/db')
const result = require('../utils/result')
const config = require('../utils/config')

const router = express.Router()


// Home Chef Registration
router.post('/signup', (req, res) => {
    const { business_name, email, password, phone_number } = req.body

    const sql = `
        INSERT INTO HomeChefs
        (business_name, email, password_hash, phone_number)
        VALUES (?, ?, ?, ?)
    `

    bcrypt.hash(password, config.SALT_ROUND, (err, hashedPassword) => {
        if (err) {
            return res.send(result.createResult(err))
        }

        pool.query(
            sql,
            [business_name, email, hashedPassword, phone_number],
            (err, data) => {
                res.send(result.createResult(err, data))
            }
        )
    })
})


// Home Chef Login
router.post('/signin', (req, res) => {
    const { email, password } = req.body

    const sql = `SELECT * FROM HomeChefs WHERE email = ?`

    pool.query(sql, [email], (err, data) => {
        if (err) {
            res.send(result.createResult(err))
        }
        else if (data.length === 0) {
            res.send(result.createResult('Invalid Email'))
        }
        else {
            // Chef record exists
            bcrypt.compare(password, data[0].password_hash, (err, passwordStatus) => {

                if (!passwordStatus) {
                    return res.send(result.createResult('Invalid Password'))
                }

                // Block login if admin has not approved chef
                if (!data[0].is_active) {
                    return res.send(result.createResult('Account not approved by admin'))
                }

                const payload = {
                    chef_id: data[0].chef_id
                }

                const token = jwt.sign(payload, config.SECRET)

                const chef = {
                    token: token,
                    chef_id: data[0].chef_id,
                    business_name: data[0].business_name,
                    email: data[0].email,
                    phone_number: data[0].phone_number,
                    average_rating: data[0].average_rating
                }

                res.send(result.createResult(null, chef))
            })
        }
    })
})

//Add serviceAreas

router.post('/service-area', (req, res) => {
  const chef_id = req.user.chef_id
  const { pincode, delivery_fee } = req.body

  const sql = `
    INSERT INTO ServiceAreas (chef_id, pincode, delivery_fee)
    VALUES (?, ?, ?)
  `

  pool.query(sql, [chef_id, pincode, delivery_fee], (err, data) => {
    res.send(result.createResult(err, data))
  })
})


//add food menu item

router.post('/menu', (req, res) => {
  const chef_id = req.user.chef_id
  const { name, base_price, description } = req.body
  let image_url = null

  // Build image URL if file was uploaded
  if (req.file) {
    image_url = `/uploads/${req.file.filename}`
  }

  // Validate required fields
  if (!name || !base_price) {
    return res.send(result.createResult('Name and price are required'))
  }

  const sql = `
    INSERT INTO MenuItems 
    (chef_id, name, base_price, description, image_url)
    VALUES (?, ?, ?, ?, ?)
  `

  pool.query(sql, [chef_id, name, base_price, description || null, image_url], (err, data) => {
    if (err) {
      res.send(result.createResult(err))
    } else {
      res.send(result.createResult(null, { 
        item_id: data.insertId,
        message: 'Menu item added successfully'
      }))
    }
  })
})


//get food items
router.get('/menu', (req, res) => {
  const chef_id = req.user.chef_id

  pool.query(
    `SELECT * FROM MenuItems WHERE chef_id = ?`,
    [chef_id],
    (err, data) => res.send(result.createResult(err, data))
  )
})


//update food menu item

router.put('/menu/:id', (req, res) => {
  const chef_id = req.user.chef_id
  const { name, base_price, is_available } = req.body

  const sql = `
    UPDATE MenuItems
    SET name=?, base_price=?, is_available=?
    WHERE item_id=? AND chef_id=?
  `

  pool.query(
    sql,
    [name, base_price, is_available, req.params.id, chef_id],
    (err, data) => res.send(result.createResult(err, data))
  )
})

// Get all orders for a chef
router.get('/orders', (req, res) => {
  const chef_id = req.user?.chef_id

  // Log for debugging
  console.log('[HomeChef Orders] Fetching orders for chef_id:', chef_id)
  console.log('[HomeChef Orders] req.user:', req.user)

  if (!chef_id) {
    console.error('[HomeChef Orders] No chef_id found in request')
    return res.status(400).send({
      status: 'error',
      message: 'Chef ID not found in authentication'
    })
  }

  const sql = `
    SELECT o.order_id, o.customer_id, o.total_amount, o.order_status, o.created_at,
           c.first_name, c.last_name, c.phone_number,
           COUNT(oi.item_id) as item_count
    FROM Orders o
    JOIN Customers c ON o.customer_id = c.customer_id
    LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
    WHERE o.chef_id = ?
    GROUP BY o.order_id
    ORDER BY o.created_at DESC
  `

  pool.query(sql, [chef_id], (err, data) => {
    if (err) {
      console.error('[HomeChef Orders] Database error:', err.message)
    } else {
      console.log('[HomeChef Orders] Found', data?.length || 0, 'orders')
    }
    res.send(result.createResult(err, data))
  })
})

// Get order details
router.get('/orders/:order_id', (req, res) => {
  const chef_id = req.user.chef_id
  const order_id = req.params.order_id

  const sql = `
    SELECT o.*, oi.item_id, oi.quantity, oi.price,
           m.name as item_name,
           c.first_name, c.last_name, c.phone_number,
           a.street, a.city, a.pincode, a.house_no
    FROM Orders o
    JOIN OrderItems oi ON o.order_id = oi.order_id
    JOIN MenuItems m ON oi.item_id = m.item_id
    JOIN Customers c ON o.customer_id = c.customer_id
    JOIN Addresses a ON o.delivery_address_id = a.address_id
    WHERE o.order_id = ? AND o.chef_id = ?
  `

  pool.query(sql, [order_id, chef_id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Update order status
router.put('/orders/:order_id/status', (req, res) => {
  const chef_id = req.user.chef_id
  const order_id = req.params.order_id
  const { order_status } = req.body

  const sql = `
    UPDATE Orders
    SET order_status = ?
    WHERE order_id = ? AND chef_id = ?
  `

  pool.query(sql, [order_status, order_id, chef_id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Get service areas for a chef
router.get('/service-areas', (req, res) => {
  const chef_id = req.user.chef_id

  const sql = `SELECT * FROM ServiceAreas WHERE chef_id = ?`

  pool.query(sql, [chef_id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Delete service area
router.delete('/service-areas/:area_id', (req, res) => {
  const chef_id = req.user.chef_id
  const area_id = req.params.area_id

  const sql = `DELETE FROM ServiceAreas WHERE area_id = ? AND chef_id = ?`

  pool.query(sql, [area_id, chef_id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Get earnings summary
router.get('/earnings', (req, res) => {
  const chef_id = req.user.chef_id

  const sql = `
    SELECT 
      SUM(o.total_amount) as total_earnings,
      COUNT(CASE WHEN DATE(o.created_at) = CURDATE() THEN 1 END) as today_orders,
      SUM(CASE WHEN DATE(o.created_at) = CURDATE() THEN o.total_amount ELSE 0 END) as today_earnings,
      COUNT(CASE WHEN YEARWEEK(o.created_at) = YEARWEEK(CURDATE()) THEN 1 END) as week_orders,
      SUM(CASE WHEN YEARWEEK(o.created_at) = YEARWEEK(CURDATE()) THEN o.total_amount ELSE 0 END) as week_earnings,
      COUNT(CASE WHEN MONTH(o.created_at) = MONTH(CURDATE()) AND YEAR(o.created_at) = YEAR(CURDATE()) THEN 1 END) as month_orders,
      SUM(CASE WHEN MONTH(o.created_at) = MONTH(CURDATE()) AND YEAR(o.created_at) = YEAR(CURDATE()) THEN o.total_amount ELSE 0 END) as month_earnings
    FROM Orders o
    WHERE o.chef_id = ? AND o.order_status = 'completed'
  `

  pool.query(sql, [chef_id], (err, data) => {
    if (err) {
      res.send(result.createResult(err))
    } else {
      res.send(result.createResult(null, data[0]))
    }
  })
})

// Get chef profile
router.get('/profile', (req, res) => {
  const chef_id = req.user.chef_id

  const sql = `SELECT chef_id, business_name, email, phone_number, average_rating, is_active, created_at FROM HomeChefs WHERE chef_id = ?`

  pool.query(sql, [chef_id], (err, data) => {
    if (err) {
      res.send(result.createResult(err))
    } else if (data.length === 0) {
      res.send(result.createResult('Chef not found'))
    } else {
      res.send(result.createResult(null, data[0]))
    }
  })
})

// Update chef profile
router.put('/profile', (req, res) => {
  const chef_id = req.user.chef_id
  const { business_name, phone_number } = req.body

  const sql = `
    UPDATE HomeChefs
    SET business_name = ?, phone_number = ?
    WHERE chef_id = ?
  `

  pool.query(sql, [business_name, phone_number, chef_id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Get all active home chefs
router.get('/all', (req, res) => {
  const sql = `
    SELECT chef_id, business_name, email, phone_number, average_rating, created_at
    FROM HomeChefs
    WHERE is_active = TRUE
    ORDER BY average_rating DESC
  `

  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Get home chef menu items by chef_id
router.get('/:chef_id/menu', (req, res) => {
  const { chef_id } = req.params

  const sql = `
    SELECT item_id, name, base_price, description, is_available, image_url
    FROM MenuItems
    WHERE chef_id = ? AND is_available = TRUE
    ORDER BY created_at DESC
  `

  pool.query(sql, [chef_id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Search home chefs by business name
router.get('/search/:business_name', (req, res) => {
  const { business_name } = req.params

  const sql = `
    SELECT chef_id, business_name, email, phone_number, average_rating, created_at
    FROM HomeChefs
    WHERE is_active = TRUE AND business_name LIKE ?
    ORDER BY average_rating DESC
  `

  pool.query(sql, [`%${business_name}%`], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Search HomeChefs by business_name (case-insensitive)
router.get('/search/business', (req, res) => {
  const { query } = req.query

  // Validate query parameter
  if (!query || query.trim() === '') {
    return res.status(400).send({
      status: 'error',
      message: 'Search query is required'
    })
  }

  const cleanQuery = query.trim()
  const searchQuery = `%${cleanQuery}%`
  
  // Log incoming query for debugging
  console.log(`[HomeChef Search] Incoming query: "${cleanQuery}"`)
  
  const sql = `
    SELECT chef_id, business_name, email, phone_number, average_rating
    FROM HomeChefs
    WHERE is_active = TRUE
    AND LOWER(business_name) LIKE LOWER(?)
    ORDER BY average_rating DESC
  `

  pool.query(sql, [searchQuery], (err, data) => {
    if (err) {
      console.error(`[HomeChef Search] Database error: ${err.message}`)
      return res.status(500).send({
        status: 'error',
        message: 'Error searching chefs: ' + err.message
      })
    }
    
    // Log results for debugging
    console.log(`[HomeChef Search] Query: "${cleanQuery}" | Results: ${data.length} chefs found`)
    if (data.length > 0) {
      console.log(`[HomeChef Search] Results:`, data.map(c => c.business_name))
    }
    
    res.status(200).send({
      status: 'success',
      data: data || [],
      count: data ? data.length : 0
    })
  })
})

// Get home chef profile by chef_id (for customer view)
router.get('/:chef_id/profile', (req, res) => {
  const { chef_id } = req.params

  const sql = `
    SELECT chef_id, business_name, email, phone_number, average_rating, created_at
    FROM HomeChefs
    WHERE chef_id = ? AND is_active = TRUE
  `

  pool.query(sql, [chef_id], (err, data) => {
    if (err) {
      res.send(result.createResult(err))
    } else if (data.length === 0) {
      res.send(result.createResult('Chef not found'))
    } else {
      res.send(result.createResult(null, data[0]))
    }
  })
})

module.exports = router