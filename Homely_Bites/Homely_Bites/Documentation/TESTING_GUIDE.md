# Testing Guide - HomeChef Business Name Search

## Quick Start Testing

### 1. Prepare Your Environment
```bash
# Ensure backend is running on port 4000
cd "Backend Homelify/Backend"
npm start
# Should see: "server started at port 4000"

# Ensure frontend is running on port 5173
cd frontend
npm run dev
# Should see: Vite development server running
```

### 2. Open Application
- Navigate to: `http://localhost:5173`
- If redirected to auth, log in with customer account
- Should see home page with header and search bar

---

## Test Scenarios

### Test 1: Basic Search
**Objective:** Verify search returns matching kitchens

**Steps:**
1. On Home page, locate search input with placeholder "Search by chef name or kitchen"
2. Type: `john`
3. Wait 300ms (debounce)
4. Should see: HomeChef cards appear if any kitchen names contain "john"
5. Clear search box

**Expected Result:**
- ✅ Search input updates immediately
- ✅ API called after 300ms pause
- ✅ Cards display with business name, rating, phone
- ✅ "View Menu →" button visible

**Failure Signs:**
- ❌ Cards don't appear (API not called)
- ❌ "No kitchens found" when data exists
- ❌ API called on every keystroke (no debounce)

---

### Test 2: Search Result Navigation
**Objective:** Verify clicking cards navigates to kitchen page

**Steps:**
1. Search for a kitchen (see Test 1)
2. Click on any HomeChef card
3. Should navigate to `/customer/kitchen/:chef_id`
4. Kitchen page should load with:
   - Kitchen name as heading
   - Rating and phone number
   - Grid of menu items

**Expected Result:**
- ✅ URL changes to `/customer/kitchen/X` (where X is chef_id)
- ✅ Kitchen header displays correctly
- ✅ Menu items load in grid
- ✅ Back button visible

**Failure Signs:**
- ❌ No navigation occurs
- ❌ Wrong URL displayed
- ❌ Kitchen page shows error
- ❌ Menu items don't load

---

### Test 3: Kitchen Page Details
**Objective:** Verify all kitchen information displays correctly

**Steps:**
1. Navigate to a kitchen page (see Test 2)
2. Check header displays:
   - Business name
   - Rating (with star emoji ⭐)
   - Phone number (with phone emoji 📞)
3. Check menu items:
   - Display in grid format
   - Show item name, price, image
   - Click item works

**Expected Result:**
- ✅ Business name shows as heading
- ✅ Rating shows: "⭐ 4.5 rating" format
- ✅ Phone shows: "📞 1234567890" format
- ✅ Menu items show in 3-4 column grid (desktop)
- ✅ Items are clickable

**Failure Signs:**
- ❌ Header information missing
- ❌ Rating shows as "undefined"
- ❌ Items from other chefs displayed
- ❌ Menu items don't show

---

### Test 4: No Results Scenario
**Objective:** Verify proper handling when no results found

**Steps:**
1. Search for: `xyznonexistentkitchen123`
2. Wait for API response

**Expected Result:**
- ✅ Shows message: "No kitchens found matching your search"
- ✅ Message has red/warning styling
- ✅ No cards displayed
- ✅ Can clear search and try again

**Failure Signs:**
- ❌ No error message shown
- ❌ Blank space with no feedback
- ❌ Shows cards for unrelated results

---

### Test 5: Search Clear Functionality
**Objective:** Verify search can be cleared and reset

**Steps:**
1. Search for a kitchen
2. Click "Clear" button
3. Should return to normal view

**Expected Result:**
- ✅ Search input clears
- ✅ Returns to ExploreMenu (categories) view
- ✅ Shows FoodDisplay (top dishes)
- ✅ Search results hidden

**Failure Signs:**
- ❌ Clear button doesn't work
- ❌ Still shows search results
- ❌ Search input doesn't clear

---

### Test 6: Back Button Navigation
**Objective:** Verify back button returns to home

**Steps:**
1. Navigate to a kitchen page
2. Click "Back" button (← Back to Home)
3. Should return to home page

**Expected Result:**
- ✅ URL changes to `/customer/dashboard`
- ✅ Home page loads with categories
- ✅ Can search again or browse normally

**Failure Signs:**
- ❌ No back button visible
- ❌ Back button doesn't navigate
- ❌ Page shows error after back

---

### Test 7: Case-Insensitive Search
**Objective:** Verify search works with different cases

**Steps:**
1. Search: `John`
2. Clear and search: `JOHN`
3. Clear and search: `john`
4. All should return same results

**Expected Result:**
- ✅ Same results for all three searches
- ✅ Results display correctly each time
- ✅ No errors or warnings

**Failure Signs:**
- ❌ Different results for different cases
- ❌ One case returns results, another doesn't
- ❌ Error messages

---

### Test 8: Debounce Optimization
**Objective:** Verify API is not called on every keystroke

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Search box, type: `k-i-t-c-h-e-n` (slowly, letter by letter)
4. Observe network requests

**Expected Result:**
- ✅ Only 1 API call made (not 8 calls)
- ✅ API called 300ms after last keystroke
- ✅ Network tab shows single GET request to `/homechef/search/business?query=kitchen`

**Failure Signs:**
- ❌ Multiple API calls per search (6+ calls)
- ❌ API called on every keystroke
- ❌ Server overload (400+ requests)

---

### Test 9: Mobile Responsiveness
**Objective:** Verify search works on mobile devices

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set to mobile size (320px width)
4. Search for a kitchen
5. Click on card
6. Check kitchen page layout

**Expected Result:**
- ✅ Search input fits on mobile screen
- ✅ Cards stack vertically (single column)
- ✅ Buttons readable and tappable
- ✅ Text doesn't overflow
- ✅ Kitchen page shows single column menu items
- ✅ All information visible without scrolling excessive

**Failure Signs:**
- ❌ Text truncated or overlapping
- ❌ Buttons too small to tap
- ❌ Grid doesn't adjust to mobile
- ❌ Horizontal scrolling needed

---

### Test 10: Error Handling
**Objective:** Verify graceful error handling

**Steps:**
1. Stop backend server (Ctrl+C)
2. Try to search on frontend
3. Should show error message
4. Restart backend
5. Search should work again

**Expected Result:**
- ✅ Shows: "Failed to search kitchens. Please try again."
- ✅ Can clear search
- ✅ Works again after backend restarts
- ✅ No console errors (red messages)

**Failure Signs:**
- ❌ Blank error or no error message
- ❌ App crashes
- ❌ Console shows JavaScript error
- ❌ Search doesn't work after server restart

---

## Browser Console Testing

### Check for Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Perform all tests above
4. Should see NO red error messages
5. May see blue info logs (that's fine)

### Expected Console Logs
You might see logs like:
```
[StoreContext] Fetching menu data from API...
[Search Results] Found 5 kitchens
[Navigation] Navigating to /customer/kitchen/1
[Kitchen Page] Loading menu items...
```

---

## Network Tab Testing

### Monitor API Calls
1. Open DevTools (F12)
2. Go to Network tab
3. Perform searches
4. Should see requests like:
   - `GET /homechef/search/business?query=...` (Status 200)
   - `GET /menu/chef/...` (Status 200)

### Verify Response Format
Click on API request → Response tab
Should see JSON like:
```json
{
  "status": "success",
  "data": [
    {
      "chef_id": 1,
      "business_name": "John's Kitchen",
      "average_rating": 4.5,
      "phone_number": "1234567890"
    }
  ],
  "count": 1
}
```

---

## Verification Checklist

### Core Functionality
- [ ] Search input accepts text
- [ ] Debounce works (API called after 300ms pause)
- [ ] Results display in card format
- [ ] Cards show business name, rating, phone
- [ ] Clicking card navigates to kitchen page
- [ ] Kitchen page shows menu items
- [ ] Back button returns to home

### Search Features
- [ ] Case-insensitive search (john = JOHN)
- [ ] Trim spaces (` john ` = `john`)
- [ ] "No kitchens found" message when empty
- [ ] Clear button works
- [ ] Multiple searches in sequence work

### UI/UX
- [ ] Cards have hover effects
- [ ] Rating badge is yellow with star
- [ ] Phone number has phone emoji
- [ ] "View Menu →" button visible
- [ ] Back button clearly visible
- [ ] Loading state shows while fetching

### Responsive Design
- [ ] Desktop: Grid layout looks good
- [ ] Tablet: Columns adjust (2-3)
- [ ] Mobile: Single column, readable
- [ ] All buttons tappable on mobile
- [ ] Text readable on all sizes

### Error Handling
- [ ] No API call with empty search
- [ ] Proper error messages
- [ ] No JavaScript errors in console
- [ ] Network errors handled gracefully

### Performance
- [ ] Search responds quickly
- [ ] No slow loading (< 2 seconds)
- [ ] No multiple API calls (debounce works)
- [ ] Images load properly

---

## Troubleshooting Common Issues

### Issue: "No kitchens found" always shows

**Solution:**
1. Check backend is running: `curl http://localhost:4000/`
2. Check database has active chefs: `SELECT * FROM HomeChefs WHERE is_active = TRUE`
3. Check search query matches business_name exactly
4. Restart both backend and frontend

### Issue: Cards don't appear after search

**Solution:**
1. Open Network tab (F12)
2. Search and check if API is called
3. If yes → Check response in Response tab
4. If no → Check if debounce is working (wait 300ms after typing)
5. Check browser console for errors (F12 → Console)

### Issue: Kitchen page shows error

**Solution:**
1. Check URL is correct: `/customer/kitchen/:chef_id`
2. Check chef_id is numeric
3. Check that chef exists in database
4. Check menu items exist for that chef
5. Check backend logs for database error

### Issue: Images not showing on kitchen page

**Solution:**
1. Check image_url is full path (starts with `http://`)
2. Check `/Backend/uploads/` directory has images
3. Restart backend to reload static files
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Search very slow or no results

**Solution:**
1. Check backend performance: `console.log()` in search endpoint
2. Check database query: Run LIKE query directly
3. Check for large result sets (1000+ rows)
4. Add pagination if needed
5. Check network latency (Network tab)

---

## Performance Benchmarks

### Expected Response Times
- **Search API:** < 500ms
- **Menu API:** < 500ms
- **Page Navigation:** Instant
- **Debounce:** 300ms after typing stops

### Network Requests
- **Search:** 1 API call per search
- **Kitchen load:** 1 API call for menu items
- **Total:** ~2 calls per navigation flow

---

## Success Criteria

✅ **All tests pass** without errors
✅ **Console is clean** (no red errors)
✅ **Network requests succeed** (200 status)
✅ **UI renders correctly** on all devices
✅ **Navigation works smoothly** between pages
✅ **Error messages are helpful** and clear

---

**Ready to Test?**

1. Start backend: `npm start` in Backend directory
2. Start frontend: `npm run dev` in frontend directory
3. Follow tests above in order
4. Document any issues
5. Report results in GitHub issues

Good luck! 🚀
