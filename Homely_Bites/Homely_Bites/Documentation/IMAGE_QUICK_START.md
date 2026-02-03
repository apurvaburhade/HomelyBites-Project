# Image Display Troubleshooting - Quick Start

## 🚀 Quick Test (2 minutes)

### Step 1: Check Backend Console
```
Terminal running "npm start"
Look for this pattern:
[IMAGE REQUEST] File: food-*.jpg, Exists: true
[DASHBOARD/HOME] Retrieved menu items:
  [1] Greek Salad: image_url="/uploads/food-*.jpg" -> http://localhost:4000/uploads/food-*.jpg
```

### Step 2: Check Frontend Console (F12)
```
[StoreContext] Found 20 popular items
[FoodItem] Item: "Greek Salad", Image Path: "/uploads/food-*.jpg"
  └─ Relative path converted: /uploads/food-*.jpg -> http://localhost:4000/uploads/food-*.jpg
```

### Step 3: View Homepage
- Items WITH images should show images
- Items WITHOUT images should show gray placeholder
- No broken image icons

**If all above works**: ✅ Images are working!

---

## 🔧 If Images Not Showing

### Check #1: Backend Logging
```bash
# Look in backend terminal for:
[IMAGE REQUEST] File: food-*.jpg, Exists: true

# If you see "Exists: false"
# → Image file missing from /uploads/
# → Check: Does /uploads/ directory have files?
```

### Check #2: API Response
```bash
# In Frontend Console (F12):
# Look for: [StoreContext] API Response: {status: 'success', ...}
# If you see "API Response: error"
# → API call failed
# → Check: Is backend running?
```

### Check #3: URL Construction
```bash
# In Frontend Console (F12):
# Look for: [FoodItem] Item: "Greek Salad", Image Path: "/uploads/food-*.jpg"
#   └─ Relative path converted: /uploads/food-*.jpg -> http://localhost:4000/uploads/food-*.jpg
# If you see "No image path, using placeholder"
# → Database has NULL image_url
# → Check: Did chef upload image?
```

### Check #4: Network Request
```bash
# In DevTools Network tab (F12):
# Look for: http://localhost:4000/uploads/food-*.jpg
# Status should be: 200
# If status is: 404
# → File not found on server
# → Check: Does file exist in /uploads/?
```

---

## 📋 Common Issues & Fixes

### "Images show placeholder"
**Logs to check**:
```
Backend: [IMAGE REQUEST] File: food-*.jpg, Exists: false
Fix: Check if image file exists in /uploads/
```

### "Placeholder shows but image exists"
**Logs to check**:
```
Frontend: [FoodItem] Image failed to load for "Greek Salad": http://...
Network: GET /uploads/food-*.jpg → 404
Fix: Check file path is correct in database
```

### "No API response"
**Logs to check**:
```
Backend: [DASHBOARD/HOME] logs missing
Frontend: [StoreContext] API Response: error
Fix: Verify backend is running and `/customer/dashboard/home` endpoint works
```

### "API returns null image_url"
**Logs to check**:
```
Backend: [DASHBOARD/HOME] image_url="null" -> NO_IMAGE
Frontend: [Transform] image_url: "null"
Fix: Chef hasn't uploaded image yet, or upload failed
```

---

## ✅ Success Indicators

✅ Backend logs show image files exist
✅ API logs show image_url for each item  
✅ Frontend logs show URL transformation
✅ Network shows 200 for image requests
✅ Images display on dashboard
✅ Placeholder shows for missing images
✅ No console errors

---

## 📞 Full Debugging Guide

See: `IMAGE_DEBUGGING_GUIDE.md` for detailed troubleshooting

## 📋 Implementation Details

See: `IMAGE_FIX_SUMMARY.md` for technical details
