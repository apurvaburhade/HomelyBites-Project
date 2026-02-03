const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const authorizeUser = require('./utils/authuser')
const errorHandler = require('./utils/errorHandler')
const customerRouter = require('./routes/customer')
const homechefRouter = require('./routes/homeChef')
const feedbackRouter = require('./routes/feedback')
const deliveryRouter = require('./routes/deliveryperson')
const adminRouter = require('./routes/admin')
const chefRouter = require('./routes/chef')
const menuRouter = require('./routes/menu')
const app = express()

app.use(cors())
app.use(express.json())

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'food-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  // Allow only image files
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// Serve uploaded files as static (BEFORE authorization so images are accessible)
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=86400')
  }
}))

// Log all image requests for debugging
app.get('/uploads/:filename', (req, res, next) => {
  const filePath = require('path').join(uploadsDir, req.params.filename)
  const exists = require('fs').existsSync(filePath)
  console.log(`[IMAGE REQUEST] File: ${req.params.filename}, Exists: ${exists}`)
  next()
})

// Apply authorization middleware
app.use(authorizeUser)

// Mount all routers with upload middleware for homechef
app.use('/customer', customerRouter)
app.use('/api/customer', customerRouter)
app.use('/menu', menuRouter)
app.use('/api/menu', menuRouter)
app.use('/homechef', (req, res, next) => {
  // Only apply upload middleware to POST /menu
  if (req.method === 'POST' && req.path === '/menu') {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return errorHandler(err, req, res, next)
      }
      next()
    })
  } else {
    next()
  }
}, homechefRouter)
app.use('/feedback', feedbackRouter)
app.use('/delivery-personnel', deliveryRouter)
app.use('/admin', adminRouter)
app.use('/api/chef', chefRouter)

// Error handling middleware
app.use(errorHandler)

app.listen(4000,'localhost',()=>{
    console.log('server started at port 4000')
})