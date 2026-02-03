# Image Upload Feature - Setup Checklist

## Pre-Installation
- [ ] Node.js v12+ is installed
- [ ] Backend server is running on port 4000
- [ ] Database connection is working
- [ ] React frontend is running on port 5173

## Installation Steps

### Step 1: Install Multer Package
```bash
cd "Backend Homelify/Backend"
npm install multer@1.4.5-lts.1
npm install  # Install all dependencies
```
- [ ] Multer installed successfully
- [ ] package.json updated with multer dependency
- [ ] npm install completed without errors

### Step 2: Backend Configuration
- [ ] `server.js` updated with Multer setup
- [ ] `errorHandler.js` created in utils/
- [ ] `homeChef.js` route updated for image handling
- [ ] `.gitignore` created/updated to exclude uploads/
- [ ] `uploads/` directory will be auto-created on first run

### Step 3: Database
- [ ] MenuItems table has `image_url VARCHAR(255)` column
- [ ] If not present, run: `ALTER TABLE MenuItems ADD COLUMN image_url VARCHAR(255);`
- [ ] Database connection verified

### Step 4: Frontend Updates
- [ ] `AddMenuItem.jsx` updated with image upload form
- [ ] `AddMenuItem.css` updated with image upload styles
- [ ] `homeChefService.js` updated with FormData handling
- [ ] No npm packages needed for frontend

### Step 5: Start Services
```bash
# Terminal 1: Backend
cd "Backend Homelify/Backend"
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```
- [ ] Backend server running on http://localhost:4000
- [ ] Frontend running on http://localhost:5173
- [ ] No console errors in either terminal

### Step 6: Test the Feature

#### Test Adding Menu Item WITHOUT Image
1. [ ] Navigate to Home Chef Dashboard
2. [ ] Click "Add New Menu Item"
3. [ ] Fill in: Name, Price, Description
4. [ ] Click "Add Item" without uploading image
5. [ ] Success message appears
6. [ ] Item saved in database (image_url = NULL)

#### Test Adding Menu Item WITH Image
1. [ ] Navigate to Home Chef Dashboard
2. [ ] Click "Add New Menu Item"
3. [ ] Fill in: Name, Price, Description
4. [ ] Click image upload area
5. [ ] Select a valid image (JPEG, PNG, WEBP)
6. [ ] Image preview appears
7. [ ] Click "Add Item"
8. [ ] Success message appears
9. [ ] Item saved with image_url in database
10. [ ] Image accessible at `/uploads/{filename}`

#### Test Image Upload Validation
1. [ ] Try uploading image > 5MB
   - [ ] Error message displays: "Image size must be less than 5MB"
2. [ ] Try uploading non-image file (PDF, .txt, etc.)
   - [ ] Error message displays: "Please upload a valid image file"
3. [ ] Try without filling required fields
   - [ ] Validation errors show for missing data

#### Test Image Preview & Removal
1. [ ] Upload image - preview shows
2. [ ] Click "✕ Remove Image" button
3. [ ] Preview disappears, upload area reappears
4. [ ] Can upload different image

#### Test Image Display
1. [ ] Verify uploaded image at: `http://localhost:4000/uploads/{filename}`
2. [ ] Image displays correctly in browser
3. [ ] Check image URL in database MenuItems.image_url

## Verification Checklist

### Backend Files
- [ ] `server.js` - Contains Multer configuration and setup
- [ ] `routes/homeChef.js` - POST /menu route handles image
- [ ] `utils/errorHandler.js` - Error handling middleware exists
- [ ] `package.json` - Contains "multer": "^1.4.5-lts.1"
- [ ] `.gitignore` - Contains uploads/ directory
- [ ] `uploads/` - Directory created and writable

### Frontend Files
- [ ] `AddMenuItem.jsx` - Image upload and preview logic
- [ ] `AddMenuItem.css` - Styling for upload area
- [ ] `homeChefService.js` - FormData handling in addMenuItem method

### Database
- [ ] `MenuItems` table has `image_url` column
- [ ] Sample record shows image_url with path or NULL

### Error Handling
- [ ] Backend logs show upload middleware active
- [ ] Error messages display in UI for validation failures
- [ ] No console errors in browser developer tools

## Common Issues & Solutions

### Issue: "uploads" directory not created
```
Solution: Ensure backend has write permissions
Run: chmod -R 755 "Backend Homelify/Backend"
Then restart backend
```

### Issue: Multer "Cannot find module"
```
Solution: Install dependencies
Run: cd "Backend Homelify/Backend" && npm install multer
```

### Issue: CORS error when uploading
```
Solution: Backend CORS is enabled, but verify:
app.use(cors()) is before app.use(authorizeUser)
```

### Issue: Images not serving from /uploads
```
Solution: Verify static middleware
Check: app.use('/uploads', express.static(uploadsDir))
is in server.js before routes
```

## Performance Optimization (Optional)

Add to server.js for better image serving:
```javascript
// Cache headers for images
app.use('/uploads', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
  next()
}, express.static(uploadsDir))
```

## Backup Important Files

Before deployment, backup these files:
- [ ] Backend MenuItems table (export SQL)
- [ ] database connection credentials
- [ ] Backend .env file (if exists)
- [ ] Current uploads directory (after testing)

## Post-Installation

After successful setup:
1. [ ] Test all upload scenarios
2. [ ] Verify database for image_url values
3. [ ] Check file permissions on uploads/
4. [ ] Monitor server logs for any errors
5. [ ] Prepare for production deployment
6. [ ] Document any custom configurations

## Rollback Plan

If issues occur, rollback is simple:
1. Revert server.js to original
2. Revert homeChef.js route
3. Revert AddMenuItem.jsx and CSS
4. Remove multer from package.json
5. Restart backend

Database schema change is safe to keep (image_url column is harmless).

## Final Verification

Run these tests before declaring complete:

### Test 1: Simple Upload
```
✓ Upload item with image
✓ Item appears in menu
✓ Image shows in database
```

### Test 2: Validation
```
✓ Reject file > 5MB
✓ Reject non-image files
✓ Require item name and price
```

### Test 3: Database
```
✓ SELECT * FROM MenuItems WHERE image_url IS NOT NULL
✓ Verify path format: /uploads/food-{timestamp}.{ext}
```

---

**Setup Status**: [ ] Complete  
**Date Completed**: _______________  
**Tested By**: _______________  
**Notes**: 

---

If you encounter any issues not listed above, check:
1. Server console for error messages
2. Browser DevTools (F12) > Console for errors
3. Browser Network tab to see upload request/response
4. Database for image_url values
5. File system for uploads/ directory

**All tests passing? Congratulations! 🎉 Image upload is ready for production!**
