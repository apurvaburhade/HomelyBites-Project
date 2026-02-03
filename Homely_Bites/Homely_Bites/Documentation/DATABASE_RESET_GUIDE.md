# Database Reset & Test Data Guide

## 🔧 How to Add "John's Kitchen" Test Data

The test data has been updated to include **"John's Kitchen"** (chef_id = 2) so you can test the search functionality.

### Option 1: Quick Reset (Recommended)

If you haven't made any important database changes:

```bash
# 1. Connect to MySQL
mysql -u root -p

# 2. In MySQL command line:
USE HomelyBites_Simplified;
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS MenuItems;
DROP TABLE IF EXISTS ServiceAreas;
DROP TABLE IF EXISTS Addresses;
DROP TABLE IF EXISTS DeliveryPersonnel;
DROP TABLE IF EXISTS HomeChefs;
DROP TABLE IF EXISTS Customers;

# 3. Exit MySQL
exit
```

```bash
# 4. Reinitialize database from SQL file
mysql -u root -p HomelyBites_Simplified < Homelibites.sql
mysql -u root -p HomelyBites_Simplified < TestData.sql
```

### Option 2: Manual Insert (If you have existing data)

If you want to keep existing data and just add John's Kitchen:

```sql
-- Add John's Kitchen chef
INSERT INTO HomeChefs (business_name, is_active, email, password_hash, phone_number, average_rating) 
VALUES ('John''s Kitchen', TRUE, 'john@homely.com', '$2b$10$JL9XTR9AByVyKHVKkN0CVu0tnZS6GFNGJVpF0R5LN0rFKXuJ7Tjn.', '9876543299', 4.8);

-- Add menu items for John's Kitchen (assuming chef_id = 2)
INSERT INTO MenuItems (chef_id, name, description, base_price, image_url, is_available) VALUES
(2, 'Grilled Salmon', 'Fresh grilled salmon with lemon', 450, 'https://via.placeholder.com/200?text=Grilled+Salmon', TRUE),
(2, 'Pasta Carbonara', 'Classic Italian pasta with bacon', 380, 'https://via.placeholder.com/200?text=Pasta+Carbonara', TRUE),
(2, 'Risotto', 'Creamy arborio rice with mushrooms', 420, 'https://via.placeholder.com/200?text=Risotto', TRUE),
(2, 'Bruschetta', 'Toasted bread with tomato and basil', 200, 'https://via.placeholder.com/200?text=Bruschetta', TRUE),
(2, 'Tiramisu', 'Italian dessert with mascarpone', 280, 'https://via.placeholder.com/200?text=Tiramisu', TRUE);

-- Add service area for John's Kitchen
INSERT INTO ServiceAreas (chef_id, pincode) VALUES (2, '560001');
```

### Verify Data Was Added

```sql
-- Check if John's Kitchen exists
SELECT chef_id, business_name, average_rating, is_active FROM HomeChefs WHERE business_name LIKE '%john%';

-- Check menu items for John's Kitchen (chef_id = 2)
SELECT item_id, name, base_price FROM MenuItems WHERE chef_id = 2;
```

**Expected Output:**
```
chef_id | business_name     | average_rating | is_active
--------|-------------------|----------------|----------
2       | John's Kitchen    | 4.8            | 1
```

---

## 🧪 Test the Search Now

### 1. Restart Backend
```bash
cd "Backend Homelify/Backend"
npm start
```

### 2. Test Search in Terminal (Optional)

```bash
# Replace <token> with your actual auth token
curl -X GET "http://localhost:4000/homechef/search/business?query=john" \
  -H "Authorization: Bearer <token>"
```

**Expected Response:**
```json
{
  "status": "success",
  "data": [
    {
      "chef_id": 2,
      "business_name": "John's Kitchen",
      "email": "john@homely.com",
      "phone_number": "9876543299",
      "average_rating": 4.8,
      "is_active": true,
      "created_at": "2025-02-02T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 3. Test in Browser

1. Open browser and go to: `http://localhost:5173`
2. Log in as customer
3. In home page search box, type: **john**
4. Wait 300ms
5. Should see: **"John's Kitchen"** card with:
   - ⭐ 4.8 rating
   - 📞 9876543299
   - ✅ "View Menu →" button

---

## 🔍 What Changed in TestData.sql

1. **Added John's Kitchen as chef_id = 2**
   - Previous chef_id = 2 → Spice House Delights (now chef_id = 3)
   - All other chefs shifted down by 1

2. **Chef ID Mapping (After Update):**
   - chef_id = 1: Chef Raj Kitchen
   - chef_id = 2: **John's Kitchen** ← NEW
   - chef_id = 3: Spice House Delights
   - chef_id = 4: Homestyle Cooking
   - chef_id = 5: Sweet Treats Bakery
   - chef_id = 6: Desi DabaWala

3. **John's Kitchen Menu Items:**
   - Grilled Salmon (₹450)
   - Pasta Carbonara (₹380)
   - Risotto (₹420)
   - Bruschetta (₹200)
   - Tiramisu (₹280)

---

## 📋 Checklist After Reset

- [ ] Database reset successfully
- [ ] No MySQL errors
- [ ] John's Kitchen visible in database
- [ ] Backend restarted
- [ ] Frontend can search "john"
- [ ] Search returns "John's Kitchen"
- [ ] Can click card to view menu
- [ ] Menu items display correctly

---

## 🆘 Troubleshooting

### Issue: "John's Kitchen" still not showing in search

**Solution:**
1. Verify chef is active:
   ```sql
   SELECT is_active FROM HomeChefs WHERE business_name = "John's Kitchen";
   ```
   Must return: `1` (TRUE)

2. Check database was updated:
   ```sql
   SELECT COUNT(*) FROM HomeChefs;
   ```
   Should return: `6` (not 5)

3. Verify search endpoint working:
   - Check Backend terminal for logs
   - Should see SQL query execution

### Issue: Menu items not showing for John's Kitchen

**Solution:**
1. Verify items exist:
   ```sql
   SELECT COUNT(*) FROM MenuItems WHERE chef_id = 2;
   ```
   Should return: `5`

2. Check items are available:
   ```sql
   SELECT * FROM MenuItems WHERE chef_id = 2 AND is_available = TRUE;
   ```
   Should return 5 rows

### Issue: Wrong chef IDs after reset

**Solution:**
1. Check all service areas:
   ```sql
   SELECT * FROM ServiceAreas ORDER BY chef_id;
   ```

2. If chef_ids are mismatched, update:
   ```sql
   UPDATE ServiceAreas SET chef_id = 2 WHERE chef_id = 99;
   ```

---

## 📚 Files Modified

- ✅ `TestData.sql` - Added John's Kitchen + updated chef IDs

---

**Status:** ✅ Ready to Test  
**Date:** February 2, 2026  
**Action:** Reset database and run TestData.sql script
