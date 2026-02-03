# Image Display Debugging & Testing Guide

## 🔍 What Was Enhanced

### Backend Logging
1. **server.js**: Added logging for all image requests
   - Logs when images are requested
   - Confirms file existence on disk
   - Shows file path being served

2. **customer.js**: Added API logging
   - Logs retrieved menu items with image URLs
   - Shows image path transformation to absolute URL
   - Displays what the frontend will receive

### Frontend Logging
1. **FoodItem.jsx**: Added detailed image URL logging
   - Logs incoming image path from props
   - Shows URL transformation logic
   - Logs when images fail to load
   - Helps identify image path issues

2. **StoreContext.jsx**: Added API response logging
   - Logs API call start/response
   - Logs transformation of each menu item
   - Shows which items have image_url values
   - Confirms state update

---

## 🐛 How to Debug

### Step 1: Open Browser Developer Tools
```
Press F12 to open DevTools
Go to Console tab
Keep it open while testing
```

### Step 2: Start Fresh
```
1. Clear localStorage
2. Clear browser cache
3. Reload page
4. Login as customer
```

### Step 3: Check Backend Console
```
Terminal running backend should show:
[IMAGE REQUEST] File: food-xxx.jpg, Exists: true
[DASHBOARD/HOME] Retrieved menu items:
  [1] Greek Salad: image_url="/uploads/food-xxx.jpg" -> http://localhost:4000/uploads/food-xxx.jpg
  [2] Chicken Salad: image_url="null" -> NO_IMAGE
```

### Step 4: Check Frontend Console (DevTools Console Tab)
```
[StoreContext] useEffect initializing...
[StoreContext] User authenticated, fetching menu data
[StoreContext] Fetching menu data from API...
[StoreContext] API Response: {status: 'success', data: {...}}
[StoreContext] Found 20 popular items
  [Transform] "Greek Salad" - image_url: "/uploads/food-xxx.jpg"
  [Transform] "Chicken Salad" - image_url: "null"
[StoreContext] Successfully transformed items, updating state...

[FoodItem] Item: "Greek Salad", Image Path: "/uploads/food-xxx.jpg"
  └─ Relative path converted: /uploads/food-xxx.jpg -> http://localhost:4000/uploads/food-xxx.jpg

[FoodItem] Item: "Chicken Salad", Image Path: "null"
  └─ No image path, using placeholder
```

---

## 📊 Testing Checklist

### Backend Verification
- [ ] Backend running: `npm start` in Backend directory
- [ ] Terminal shows: `server started at port 4000`
- [ ] Check `/uploads` directory exists: `Backend/uploads/`
- [ ] Image files present in `/uploads/` directory
- [ ] Can access images via URL: `http://localhost:4000/uploads/food-xxx.jpg`

### Database Verification
```sql
SELECT item_id, name, image_url FROM MenuItems LIMIT 10;
```
- [ ] Some items have non-NULL image_url
- [ ] Some items have NULL image_url (for testing fallback)
- [ ] image_url values start with `/uploads/`
- [ ] Format is: `/uploads/food-timestamp-random.jpg`

### Frontend Verification
- [ ] Frontend running: `npm run dev` in frontend directory
- [ ] Can login as customer
- [ ] Console shows StoreContext logs (see above)
- [ ] Console shows FoodItem logs for each item
- [ ] No errors in console

### Image Display Verification
- [ ] Items WITH images show images on dashboard
- [ ] Items WITHOUT images show placeholder (gray box)
- [ ] No broken image icons
- [ ] Images are clear and visible
- [ ] Placeholder is visible and properly styled

### Network Request Verification
1. Open DevTools Network tab
2. Filter by "fetch/xhr"
3. Check:
   - [ ] `/customer/dashboard/home` request successful (status 200)
   - [ ] Response contains `popularItems` array
   - [ ] Each item has `image_url` field
   - Image requests show:
     - [ ] Full URL: `http://localhost:4000/uploads/food-xxx.jpg`
     - [ ] Status 200 (found)
     - [ ] Content-Type: `image/jpeg` or `image/png`

---

## 🔧 Troubleshooting

### Issue: Images Not Loading
**Symptoms**: Placeholder shows for items that should have images

**Debug Steps:**
1. Check backend console for `[IMAGE REQUEST]` logs
2. If file exists shows `false`: Check image files in `/uploads/`
3. If file exists shows `true`: Check frontend console for URL
4. Verify URL construction: `http://localhost:4000/uploads/food-xxx.jpg`

**Fixes:**
```bash
# Check uploads directory exists and has files
ls -la Backend/uploads/

# Check file permissions
chmod 755 Backend/uploads/
chmod 644 Backend/uploads/*

# Verify database has image_url values
mysql> SELECT image_url FROM MenuItems LIMIT 10;
```

---

### Issue: Placeholder Shows When Image Exists
**Symptoms**: File exists on disk, but placeholder shows

**Debug Steps:**
1. Check frontend console URL transformation
2. Verify `http://localhost:4000/uploads/food-xxx.jpg` is accessible
3. Check if CORS is blocking the request
4. Check DevTools Network tab for image request status

**Fixes:**
```javascript
// In FoodItem.jsx, check URL format:
console.log('displayImage URL:', displayImage)  // Should be http://localhost:4000/uploads/...

// In DevTools Network tab, check response headers:
// Should see:
// Content-Type: image/jpeg (or png, webp)
// Content-Length: (bytes)
// Status: 200
```

---

### Issue: API Not Returning image_url
**Symptoms**: Console shows `image_url: "null"` for all items

**Debug Steps:**
1. Check database: Do items have image_url values?
2. Check backend logs: Is image_url being returned?
3. Check API response in Network tab: Does response include image_url?

**Fixes:**
```bash
# Verify database schema has image_url column
mysql> DESCRIBE MenuItems;

# Check if MenuItems have image_url data
mysql> SELECT item_id, name, image_url FROM MenuItems WHERE image_url IS NOT NULL LIMIT 5;

# If no images, upload one first using the "Add Menu Item" form
```

---

### Issue: CORS Error
**Symptoms**: Console shows CORS error when accessing images

**Debug Steps:**
1. Check server.js has `app.use(cors())`
2. Check static file serving is before auth middleware
3. Check `/uploads` is served before `authorizeUser` middleware

**Fix**: Verify server.js line 56 has static middleware before auth middleware

---

## 🧪 Manual Testing Scenarios

### Scenario 1: Fresh Home Chef Upload
1. Login as home chef
2. Go to "Add Menu Item"
3. Upload image (JPEG, PNG, or WEBP)
4. Submit
5. Backend should log: `[FILE UPLOAD] Saving food-xxx.jpg`
6. Database should show image_url in MenuItems

### Scenario 2: View Uploaded Image
1. Login as customer
2. Go to Home page
3. Frontend console should show:
   - API call to `/customer/dashboard/home`
   - Items with image_url values
   - URL transformation to absolute URL
4. Image should display on card

### Scenario 3: Item Without Image
1. Ensure some items have NULL image_url
2. Login as customer
3. View Home page
4. Placeholder should show for items without images
5. Frontend console should show:
   - `image_url: "null"`
   - "No image path, using placeholder"

### Scenario 4: Image Not Found (Broken Link)
1. Edit database to set image_url to non-existent file:
   ```sql
   UPDATE MenuItems SET image_url = '/uploads/missing-file.jpg' WHERE item_id = 1;
   ```
2. Refresh dashboard
3. Image should fail to load → onError triggers → placeholder shows
4. Frontend console should show:
   - `Image failed to load for "Item Name": http://localhost:4000/uploads/missing-file.jpg`

---

## 📋 Console Log Reference

### Expected Backend Logs
```
[IMAGE REQUEST] File: food-1675234567890-123456789.jpg, Exists: true
[DASHBOARD/HOME] Retrieved menu items:
  [1] Greek Salad: image_url="/uploads/food-1675234567890-123456789.jpg" -> http://localhost:4000/uploads/food-1675234567890-123456789.jpg
  [2] Chicken Salad: image_url="null" -> NO_IMAGE
```

### Expected Frontend Logs
```
[StoreContext] useEffect initializing...
[StoreContext] User authenticated, fetching menu data
[StoreContext] Fetching menu data from API...
[StoreContext] API Response: {status: 'success', data: {featuredChefs: Array(10), popularItems: Array(20)}}
[StoreContext] Found 20 popular items
  [Transform] "Greek Salad" - image_url: "/uploads/food-1675234567890-123456789.jpg"
  [Transform] "Chicken Salad" - image_url: "null"
[StoreContext] Successfully transformed items, updating state...

[FoodItem] Item: "Greek Salad", Image Path: "/uploads/food-1675234567890-123456789.jpg"
  └─ Relative path converted: /uploads/food-1675234567890-123456789.jpg -> http://localhost:4000/uploads/food-1675234567890-123456789.jpg

[FoodItem] Item: "Chicken Salad", Image Path: "null"
  └─ No image path, using placeholder
```

---

## ✅ Success Criteria

- [ ] Backend logs show image requests with file existence
- [ ] API returns menu items with correct image_url values
- [ ] Frontend logs show API response with popularItems
- [ ] Frontend logs show URL transformation to absolute URLs
- [ ] Images display on customer dashboard
- [ ] Placeholder shows for items without images
- [ ] No broken image icons
- [ ] No console errors
- [ ] Network tab shows successful image requests (200 status)

---

## 🎯 Next Steps After Debugging

1. **If images display correctly**:
   - Remove console.log statements (optional)
   - Commit changes to git
   - Deploy to production
   - Monitor logs for errors

2. **If issues remain**:
   - Check specific logs in console
   - Verify file structure and permissions
   - Check database data
   - Compare with this debugging guide
   - Restart backend and frontend

---

**Debug Status**: ✅ Comprehensive logging added
**Ready for**: Immediate testing and troubleshooting
