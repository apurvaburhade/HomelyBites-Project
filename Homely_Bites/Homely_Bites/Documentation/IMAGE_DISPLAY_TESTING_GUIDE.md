# Menu Item Image Display - Testing Guide

## Quick Test Procedure

### Prerequisites
- Backend running: `http://localhost:4000`
- Frontend running: `http://localhost:5173`
- Customer account with valid token in localStorage
- At least one menu item in database with `image_url` populated

---

## Test Scenario 1: Display Image from Database ✅

### Setup
1. Chef uploads menu item with image
2. Backend stores image to `/uploads/food-{timestamp}.jpg`
3. Database records `image_url: "/uploads/food-{timestamp}.jpg"`

### Test Steps
1. Login as customer
2. Navigate to Home page
3. Scroll to "Top dishes near you" section
4. Look for menu items from the chef who uploaded image

### Expected Result
✅ Food image displays in food card
✅ Image is clear and visible
✅ No broken image icon
✅ No console errors

### Troubleshooting
| Issue | Check |
|-------|-------|
| No images appear | Backend `/uploads/` directory exists? |
| Broken image icon | Image file exists in `/uploads/`? |
| API error | Backend running on port 4000? |
| Auth error | Valid token in localStorage? |

---

## Test Scenario 2: Display Placeholder for Missing Image ✅

### Setup
1. Menu item created WITHOUT uploading image
2. Database records `image_url: null`

### Test Steps
1. Login as customer
2. Navigate to Home page
3. Look for menu items without images (created without image)

### Expected Result
✅ Gray box appears instead of image
✅ "No Image" text visible in center
✅ No broken image icon
✅ No console errors
✅ Food card layout not broken

### Troubleshooting
| Issue | Check |
|-------|-------|
| Wrong placeholder shows | `placeholder_image` exported from assets.js? |
| Text not centered | CSS in FoodItem.css correct? |
| Placeholder too large | SVG width/height 200x200px? |

---

## Test Scenario 3: Handle Broken Image Link ✅

### Setup
1. Manually set `image_url` to non-existent file in database
   ```sql
   UPDATE MenuItems SET image_url = '/uploads/missing-file.jpg' WHERE item_id = 1;
   ```

### Test Steps
1. Login as customer
2. Navigate to Home page
3. Find the menu item with modified image_url

### Expected Result
✅ Browser tries to load image
✅ Gets 404 error from server
✅ `onError` handler triggers
✅ Placeholder image appears
✅ No console errors

### Troubleshooting
| Issue | Check |
|-------|-------|
| Broken image icon shows | `onError` handler in FoodItem.jsx? |
| Still shows wrong image | Image state being set correctly? |
| 404 on wrong path | Image URL constructed correctly? |

---

## Test Scenario 4: Fallback When API Fails ✅

### Setup
1. Stop backend server
2. Frontend will fail to fetch from `/customer/dashboard/home`

### Test Steps
1. Ensure backend is stopped
2. Login as customer
3. Navigate to Home page
4. Check what displays

### Expected Result
✅ Hardcoded menu items still show
✅ Users can still browse products
✅ No critical errors
✅ Graceful degradation

### Troubleshooting
| Issue | Check |
|-------|-------|
| App crashes | Fallback to `food_list` in StoreContext? |
| Blank page | Error handling in fetchMenuData()? |
| No items | Hardcoded food_list still exported? |

---

## Test Scenario 5: Unauthenticated User ✅

### Setup
1. Clear localStorage (logout)
2. Frontend will use hardcoded menu

### Test Steps
1. Clear browser localStorage
2. Refresh page (don't login)
3. View home page

### Expected Result
✅ Hardcoded menu items display
✅ No auth errors
✅ Placeholders show (since hardcoded images are null)
✅ Users can still browse

### Troubleshooting
| Issue | Check |
|-------|-------|
| API called when not logged in | Token check in StoreContext? |
| No items show | Hardcoded fallback working? |
| Auth error | Error handling catches JWT errors? |

---

## Test Scenario 6: Image URL Construction ✅

### What to Verify
1. Backend image paths are relative: `/uploads/food-xxx.jpg`
2. Frontend converts to absolute: `http://localhost:4000/uploads/food-xxx.jpg`

### Browser DevTools Check
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Refresh page as customer
4. Look for image requests
5. Check URLs are fully qualified: `http://localhost:4000/uploads/...`

### Expected Result
✅ Image requests show full URL
✅ Status code 200 (file found)
✅ File size > 0 bytes
✅ Content-Type is image/(jpeg|png|webp)

### Troubleshooting
| Issue | Check |
|-------|-------|
| 404 errors | File exists in `/uploads/`? |
| Wrong URL | getImageUrl() function correct? |
| Empty response | Image file not corrupted? |

---

## Test Scenario 7: Cart Operations with Dynamic Menu ✅

### Setup
1. Logged in customer viewing home page
2. Menu loaded from API with real item_ids

### Test Steps
1. Click "+" button on food item
2. Verify item added to cart
3. Check cart count increments
4. Click "-" button
5. Verify item removed
6. Repeat with different items

### Expected Result
✅ Add to cart works
✅ Remove from cart works
✅ Cart counter updates
✅ Item totals calculate correctly
✅ No errors in console

### Troubleshooting
| Issue | Check |
|-------|-------|
| Item not adding | Item ID being passed correctly? |
| Total incorrect | getTotalCartAmount() updated? |
| Item not found | Item exists in dynamicFoodList? |
| Price wrong | parseFloat() applied to base_price? |

---

## Console Testing Commands

### Check if API data loaded
```javascript
// In browser console:
localStorage.getItem('token')  // Should show token
```

### Check StoreContext
```javascript
// Add this to StoreContext.jsx temporarily:
console.log('Dynamic food list:', dynamicFoodList)
console.log('First item:', dynamicFoodList[0])
```

### Check image URLs
```javascript
// In FoodItem.jsx, add:
console.log('Image URL:', displayImage)
console.log('Error state:', imageError)
```

### Check API response
```javascript
// In browser Network tab:
// Filter by '/customer/dashboard/home'
// Check Response tab
// Should show: popularItems array with image_url fields
```

---

## Acceptance Criteria

- [ ] Images from uploaded menu items display correctly
- [ ] Placeholder appears for items without images
- [ ] Broken image links show placeholder
- [ ] No broken image icons in browser
- [ ] No console errors
- [ ] Cart operations work with dynamic menu
- [ ] Fallback works if API fails
- [ ] Unauthenticated users see hardcoded menu
- [ ] Image URLs are properly constructed
- [ ] Food item prices calculate correctly

---

## Success Indicators

✅ **Visual**: Food images appear on home dashboard
✅ **Functional**: Cart add/remove operations work
✅ **Robust**: Missing images handled gracefully
✅ **Performance**: No lag when loading images
✅ **Responsive**: Works on mobile, tablet, desktop
✅ **Professional**: No broken elements or errors
✅ **User Experience**: Clean, polished appearance

---

## Debugging Checklist

If something doesn't work:

1. **Backend Check**
   - [ ] `npm start` running in Backend directory?
   - [ ] Port 4000 accessible?
   - [ ] `/uploads` directory exists?
   - [ ] Image files in `/uploads/`?

2. **Frontend Check**
   - [ ] `npm run dev` running in frontend directory?
   - [ ] Port 5173 accessible?
   - [ ] Valid token in localStorage?
   - [ ] Browser console shows no errors?

3. **Network Check**
   - [ ] Open DevTools Network tab
   - [ ] See `/customer/dashboard/home` request?
   - [ ] Response shows popularItems?
   - [ ] Image URLs in response?

4. **File Check**
   - [ ] FoodItem.jsx has getImageUrl function?
   - [ ] StoreContext.jsx has fetchMenuData function?
   - [ ] assets.js has placeholder_image?
   - [ ] No syntax errors in files?

5. **Database Check**
   - [ ] MenuItems table has image_url column?
   - [ ] Some items have non-null image_url?
   - [ ] item_id values are unique?
   - [ ] chef_id values match HomeChefs?

---

## Performance Tips

1. **Image Optimization**: Compress images before uploading
2. **Caching**: Browser caches images automatically
3. **Lazy Loading**: Consider for many items (future feature)
4. **CDN**: For production, use AWS S3 or CloudFront

---

## Support & Documentation

- **Main Guide**: `IMAGE_UPLOAD_GUIDE.md`
- **Implementation Details**: `IMAGE_DISPLAY_IMPLEMENTATION.md`
- **Quick Reference**: `IMAGE_DISPLAY_QUICK_REFERENCE.md`
- **Testing Guide**: This file

---

**Status**: ✅ **READY FOR TESTING**

Use this guide to verify all image display functionality works correctly.
