# Database Reset Guide - Phase 3 (Nisha's Kitchen Addition)

## Overview
This guide explains how to reset your MySQL database and reload the updated test data that now includes "Nisha's Kitchen" in addition to the previously added "John's Kitchen".

## What's New in This Update?
- ✅ Added "Nisha's Kitchen" (chef_id = 3) with 5 menu items
- ✅ Shifted all subsequent chefs and their menu items:
  - Spice House Delights: chef_id 3 → 4
  - Homestyle Cooking: chef_id 4 → 5
  - Sweet Treats Bakery: chef_id 5 → 6
  - Desi DabaWala: chef_id 6 → 7
- ✅ Updated all ServiceAreas mappings with new chef_ids

## Chef Directory (Updated)
| ID | Kitchen Name | Rating | Email | Phone |
|----|---|---|---|---|
| 1 | Chef Raj Kitchen | 4.5 | raj@homely.com | 9876543298 |
| 2 | John's Kitchen | 4.8 | john@homely.com | 9876543299 |
| 3 | Nisha's Kitchen | 4.9 | nisha@homely.com | 9876543300 |
| 4 | Spice House Delights | 4.3 | spice@homely.com | 9876543301 |
| 5 | Homestyle Cooking | 4.6 | homestyle@homely.com | 9876543302 |
| 6 | Sweet Treats Bakery | 4.7 | bakery@homely.com | 9876543303 |
| 7 | Desi DabaWala | 4.4 | desi@homely.com | 9876543304 |

## Reset Steps

### Option 1: Complete Database Reset (Recommended)

#### Step 1: Open MySQL Command Line
```bash
mysql -u root -p
```

#### Step 2: Drop and Recreate the Database
```sql
DROP DATABASE IF EXISTS HomelyBites_Simplified;
CREATE DATABASE HomelyBites_Simplified;
USE HomelyBites_Simplified;
```

#### Step 3: Load the Schema
```bash
mysql -u root -p HomelyBites_Simplified < Backend/Homelibites.sql
```

#### Step 4: Load the Updated Test Data
```bash
mysql -u root -p HomelyBites_Simplified < Backend/TestData.sql
```

#### Step 5: Verify the Data
```sql
SELECT * FROM HomeChefs;
SELECT * FROM MenuItems WHERE chef_id = 3;
SELECT COUNT(*) as menu_count FROM MenuItems;
```

---

### Option 2: Using GUI Tool (MySQL Workbench/DBeaver)

1. **Create New Database**
   - Right-click "Databases" → "Create New Database"
   - Name: `HomelyBites_Simplified`
   - Click "Apply"

2. **Load Schema**
   - File → Open SQL Script
   - Select: `Backend/Homelibites.sql`
   - Execute all (Ctrl+Shift+Enter)
   - Confirm tables are created

3. **Load Test Data**
   - File → Open SQL Script
   - Select: `Backend/TestData.sql`
   - Execute all (Ctrl+Shift+Enter)
   - Verify data is loaded

4. **Verify Data**
   - Open HomeChefs table → Should see 7 chefs
   - Query: `SELECT * FROM MenuItems WHERE chef_id = 3` → Should show 5 items for Nisha

---

## Testing the Update

### 1. Verify Nisha's Kitchen in Database
```sql
SELECT * FROM HomeChefs WHERE business_name LIKE '%Nisha%';
-- Expected: 1 row with chef_id = 3, rating = 4.9
```

### 2. Verify Nisha's Menu Items
```sql
SELECT * FROM MenuItems WHERE chef_id = 3;
-- Expected: 5 rows:
-- - Chicken Tikka Masala
-- - Garlic Naan
-- - Lamb Biryani
-- - Paneer Kulcha
-- - Mango Lassi
```

### 3. Test Search in Frontend
1. Start your server: `node server.js`
2. Go to: `http://localhost:3000` (or your frontend URL)
3. Search for "nisha"
4. Expected: "Nisha's Kitchen" card appears with rating 4.9
5. Click on the card → Should navigate to Kitchen page
6. Expected: Kitchen page loads with 5 menu items

### 4. Verify All Chefs Still Work
```sql
SELECT COUNT(*) FROM HomeChefs;
-- Expected: 7

SELECT COUNT(*) FROM MenuItems;
-- Expected: 35 (7 chefs × 5 items each)

SELECT COUNT(*) FROM ServiceAreas;
-- Expected: 14 (each chef has 2 service areas)
```

---

## Test Queries

### Check All Chefs and Menu Count
```sql
SELECT 
    h.chef_id,
    h.business_name,
    h.rating,
    COUNT(m.id) as menu_items
FROM HomeChefs h
LEFT JOIN MenuItems m ON h.chef_id = m.chef_id
GROUP BY h.chef_id, h.business_name, h.rating
ORDER BY h.chef_id;
```

**Expected Output:**
```
chef_id | business_name              | rating | menu_items
--------|----------------------------|--------|------------
1       | Chef Raj Kitchen           | 4.5    | 5
2       | John's Kitchen             | 4.8    | 5
3       | Nisha's Kitchen            | 4.9    | 5
4       | Spice House Delights       | 4.3    | 5
5       | Homestyle Cooking          | 4.6    | 5
6       | Sweet Treats Bakery        | 4.7    | 5
7       | Desi DabaWala              | 4.4    | 5
```

---

## Troubleshooting

### Error: "Chef not found" or "No menu items"
- Verify database reset completed successfully
- Run the verification queries above
- Check that TestData.sql loaded without errors

### Error: "Unexpected token '<', '<!DOCTYPE ...'"
- This means the API returned HTML instead of JSON
- Usually indicates chef_id doesn't exist
- Verify chef_id values match between HomeChefs and MenuItems tables

### Error: "Connection refused" when testing
- Verify MySQL server is running
- Check database connection in `Backend/utils/config.js`
- Verify credentials match your MySQL setup

### Search returns result but menu doesn't load
- The chef exists in HomeChefs but has no menu items
- Run: `SELECT * FROM MenuItems WHERE chef_id = 3;`
- Should return 5 rows for Nisha's Kitchen
- If empty, TestData.sql didn't load properly

---

## Rollback (If Needed)

If you need to revert to the previous version without Nisha's Kitchen:

1. Use `git checkout Backend/TestData.sql` (if using Git)
2. Or restore from backup
3. Re-run the reset steps with the old TestData.sql

---

## Next Steps

After successful reset:
1. ✅ Test search for "nisha" in frontend
2. ✅ Test clicking to view Nisha's Kitchen menu
3. ✅ Test other chefs still work (search for "john", "raj", etc.)
4. ✅ Test all 7 chefs appear when browsing kitchens

---

**File Modified:** `Backend/TestData.sql`
**Date Updated:** [Current Session]
**Status:** Ready for production testing
