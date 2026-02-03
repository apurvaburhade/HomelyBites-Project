-- Migration: Add image_url column to MenuItems table
-- This migration adds image support to food menu items
-- Note: The image_url column should already exist in the schema

-- Check if image_url column already exists
-- If it does not exist, uncomment the following line to add it:
-- ALTER TABLE MenuItems ADD COLUMN image_url VARCHAR(255) AFTER description;

-- Verify the column exists
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'MenuItems' AND COLUMN_NAME = 'image_url';
