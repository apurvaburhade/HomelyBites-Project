# Food Image Upload Feature - Implementation Guide

## Overview
This implementation adds image upload functionality to the Home Chef "Add New Menu Item" feature. Images are uploaded to the backend, stored on the server, and linked to menu items in the database.

## Features Implemented

### Frontend (React)
✅ Image upload field with drag-and-drop support
✅ Image preview before submission
✅ File validation (type: JPEG, PNG, WEBP; size: max 5MB)
✅ Remove/change image functionality
✅ FormData multipart/form-data encoding
✅ Error handling and user feedback
✅ Loading state during upload

### Backend (Node.js + Express)
✅ Multer middleware for file handling
✅ Configurable storage destination (/uploads directory)
✅ Automatic unique filename generation
✅ File type validation (JPEG, PNG, WEBP)
✅ File size limit (5MB)
✅ Static file serving for uploaded images
✅ Comprehensive error handling
✅ Database schema support (image_url column)

### Database
✅ MenuItems table includes `image_url VARCHAR(255)` column
✅ Image paths are stored and linked to menu items
✅ Supports NULL values for items without images

## File Structure

```
Backend/
├── server.js                    # Main server with Multer setup
├── routes/
│   └── homeChef.js             # Updated POST /menu endpoint
├── utils/
│   ├── authuser.js
│   ├── config.js
│   ├── db.js
│   ├── result.js
│   └── errorHandler.js         # NEW: Error handling middleware
├── uploads/                    # NEW: Directory for uploaded images
├── package.json                # Updated with multer dependency
├── .gitignore                  # NEW: Ignore uploads directory
├── Homelibites.sql            # Database schema with image_url
└── MIGRATION_ADD_IMAGE_URL.sql # NEW: Migration script (if needed)

Frontend/
├── src/
│   ├── pages/HomeChefDashboard/
│   │   ├── AddMenuItem.jsx     # Updated with image upload
│   │   └── AddMenuItem.css     # Updated with image styling
│   └── services/
│       └── homeChefService.js  # Updated addMenuItem method
```

## Installation

### 1. Backend Setup

Install Multer dependency:
```bash
cd "Backend Homelify/Backend"
npm install multer@1.4.5-lts.1
```

The server automatically creates the `uploads` directory if it doesn't exist.

### 2. Database

The `image_url` column already exists in MenuItems table. If you're creating a fresh database, the schema includes it.

### 3. Start the Server

```bash
npm start
```

The backend will:
- Create the uploads directory
- Serve static files from `/uploads`
- Handle image uploads to `/homechef/menu`

## API Endpoints

### Add Menu Item with Image
**POST** `/homechef/menu`

**Headers:**
```
Authorization: Bearer {homeChefToken}
Content-Type: multipart/form-data
```

**Body (FormData):**
```
- name (string, required): Item name
- base_price (number, required): Price in rupees
- description (string, optional): Item description
- image (file, optional): Image file (JPEG, PNG, WEBP, max 5MB)
```

**Response (Success):**
```json
{
  "status": "success",
  "data": {
    "item_id": 123,
    "message": "Menu item added successfully"
  }
}
```

**Response (Error):**
```json
{
  "status": "error",
  "error": "File size exceeds 5MB limit"
}
```

## Usage Examples

### Frontend - Adding Item with Image

```javascript
const formData = new FormData()
formData.append('name', 'Paneer Tikka Masala')
formData.append('base_price', 299)
formData.append('description', 'Delicious paneer in creamy tomato sauce')
formData.append('image', imageFile) // File object from input

const response = await homeChefService.addMenuItem(
  'Paneer Tikka Masala',
  299,
  'Delicious paneer in creamy tomato sauce',
  imageFile
)
```

### Accessing Uploaded Images

Once uploaded, images are accessible at:
```
http://localhost:4000/uploads/food-1234567890-abcdef.jpg
```

### Adding Item without Image

If no image is provided, the `image_url` will be `null` in the database:

```javascript
await homeChefService.addMenuItem(
  'Dal Rice',
  150,
  'Simple and healthy dal rice',
  null // No image
)
```

## Validation Rules

### Frontend Validation
- Accepted formats: JPEG, JPG, PNG, WEBP
- Max file size: 5MB
- Required fields: Item name, Price

### Backend Validation
- MIME type check for image files
- File size limit enforced by Multer
- Required fields: name, base_price
- Database constraints: chef_id foreign key

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Only image files are allowed" | Invalid file type | Upload JPEG, PNG, or WEBP |
| "File size exceeds 5MB limit" | File too large | Compress image or use smaller file |
| "Item name is required" | Empty name field | Provide item name |
| "Valid price is required" | Invalid/missing price | Enter valid price > 0 |

### Backend Error Messages

The backend's `errorHandler` middleware handles:
- Multer `LIMIT_FILE_SIZE` errors
- Multer `LIMIT_FILE_COUNT` errors
- Invalid MIME types
- Generic server errors

## File Storage

### Image Naming Convention
```
food-{timestamp}-{randomString}.{extension}
Example: food-1675234567890-123456789.jpg
```

### Storage Location
```
Backend/uploads/
├── food-1675234567890-123456789.jpg
├── food-1675234567891-987654321.png
└── food-1675234567892-555555555.webp
```

### Public Access
Images are served as static files:
```
GET /uploads/food-1675234567890-123456789.jpg
```

## Security Considerations

✅ **File Type Validation**: Only image MIME types allowed
✅ **File Size Limit**: Max 5MB to prevent abuse
✅ **Unique Filenames**: Prevents overwrites using timestamp + random string
✅ **Authorization**: Only authenticated home chefs can upload
✅ **CORS Enabled**: Safe cross-origin requests
✅ **.gitignore**: Upload directory not committed to git

## Database Schema

```sql
CREATE TABLE MenuItems (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    chef_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    description TEXT,
    image_url VARCHAR(255),  -- NEW: Stores image path
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chef_id) REFERENCES HomeChefs(chef_id) ON DELETE CASCADE
);
```

## Future Enhancements

Potential improvements for future releases:
- Image optimization (compression, resizing)
- Multiple images per menu item
- Image deletion endpoint
- CDN integration for faster serving
- Caching headers for images
- Image quality selection (low/medium/high)
- WebP format optimization
- AWS S3 or cloud storage integration

## Troubleshooting

### Issue: "uploads" directory not created
**Solution**: Ensure the backend process has write permissions in the Backend directory.

### Issue: Images not displaying
**Solution**: 
1. Verify `http://localhost:4000/uploads/{filename}` returns the image
2. Check browser console for CORS errors
3. Ensure image file exists in Backend/uploads/

### Issue: "File size exceeds limit"
**Solution**: The 5MB limit is set in server.js. Modify if needed:
```javascript
limits: {
  fileSize: 10 * 1024 * 1024 // Change to 10MB
}
```

### Issue: Multer not working
**Solution**: 
1. Verify Multer is installed: `npm list multer`
2. Check Node.js version (requires v12+)
3. Restart the backend server

## Rollback Instructions

If you need to revert the image upload feature:

1. Remove Multer from package.json
2. Revert server.js to original version
3. Revert homeChef.js route to original version
4. Revert AddMenuItem.jsx component
5. Keep image_url column in database (no harm)
6. Delete uploads/ directory if desired

## Testing Checklist

- [x] Upload image with valid formats (JPEG, PNG, WEBP)
- [x] Upload exceeding file size limit (should fail)
- [x] Upload invalid file type (should fail)
- [x] Add menu item without image (should succeed)
- [x] Add menu item with image (should succeed)
- [x] View uploaded image at `/uploads/{filename}`
- [x] Verify image_url saved in database
- [x] Test image preview in UI
- [x] Test remove image button
- [x] Test error messages display correctly
- [x] Test on mobile/tablet (responsive)

## Support & Maintenance

For issues or questions:
1. Check troubleshooting section above
2. Review error logs in backend console
3. Verify file permissions in uploads directory
4. Check database for image_url values
5. Test with Postman for API-level debugging

---

**Version**: 1.0.0  
**Last Updated**: February 2, 2026  
**Status**: Production Ready ✅
