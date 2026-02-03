-- Test Data for HomelyBites Application
-- Run this script to populate test data for development

USE HomelyBites_Simplified;

-- Insert test chefs (IMPORTANT: is_active must be TRUE to show in browse)
INSERT INTO HomeChefs (business_name, is_active, email, password_hash, phone_number, average_rating) VALUES
('Chef Raj Kitchen', TRUE, 'raj@homely.com', '$2b$10$JL9XTR9AByVyKHVKkN0CVu0tnZS6GFNGJVpF0R5LN0rFKXuJ7Tjn.', '9876543210', 4.5),
('John''s Kitchen', TRUE, 'john@homely.com', '$2b$10$JL9XTR9AByVyKHVKkN0CVu0tnZS6GFNGJVpF0R5LN0rFKXuJ7Tjn.', '9876543299', 4.8),
('Nisha''s Kitchen', TRUE, 'nisha@homely.com', '$2b$10$JL9XTR9AByVyKHVKkN0CVu0tnZS6GFNGJVpF0R5LN0rFKXuJ7Tjn.', '9876543300', 4.9),
('Spice House Delights', TRUE, 'spice@homely.com', '$2b$10$JL9XTR9AByVyKHVKkN0CVu0tnZS6GFNGJVpF0R5LN0rFKXuJ7Tjn.', '9876543211', 4.3),
('Homestyle Cooking', TRUE, 'homestyle@homely.com', '$2b$10$JL9XTR9AByVyKHVKkN0CVu0tnZS6GFNGJVpF0R5LN0rFKXuJ7Tjn.', '9876543212', 4.7),
('Sweet Treats Bakery', TRUE, 'bakery@homely.com', '$2b$10$JL9XTR9AByVyKHVKkN0CVu0tnZS6GFNGJVpF0R5LN0rFKXuJ7Tjn.', '9876543213', 4.2),
('Desi DabaWala', TRUE, 'desi@homely.com', '$2b$10$JL9XTR9AByVyKHVKkN0CVu0tnZS6GFNGJVpF0R5LN0rFKXuJ7Tjn.', '9876543214', 4.6);

-- Insert menu items for Chef Raj Kitchen (chef_id = 1)
INSERT INTO MenuItems (chef_id, name, description, base_price, image_url, is_available) VALUES
(1, 'Butter Chicken', 'Creamy butter chicken with rice', 280, 'https://via.placeholder.com/200?text=Butter+Chicken', TRUE),
(1, 'Palak Paneer', 'Spinach and cottage cheese curry', 250, 'https://via.placeholder.com/200?text=Palak+Paneer', TRUE),
(1, 'Biryani', 'Fragrant basmati rice with meat', 300, 'https://via.placeholder.com/200?text=Biryani', TRUE),
(1, 'Naan Bread', 'Fresh baked traditional naan', 50, 'https://via.placeholder.com/200?text=Naan', TRUE),
(1, 'Chole Bhature', 'Spicy chickpea curry with fried bread', 180, 'https://via.placeholder.com/200?text=Chole+Bhature', TRUE);

-- Insert menu items for John's Kitchen (chef_id = 2)
INSERT INTO MenuItems (chef_id, name, description, base_price, image_url, is_available) VALUES
(2, 'Grilled Salmon', 'Fresh grilled salmon with lemon', 450, 'https://via.placeholder.com/200?text=Grilled+Salmon', TRUE),
(2, 'Pasta Carbonara', 'Classic Italian pasta with bacon', 380, 'https://via.placeholder.com/200?text=Pasta+Carbonara', TRUE),
(2, 'Risotto', 'Creamy arborio rice with mushrooms', 420, 'https://via.placeholder.com/200?text=Risotto', TRUE),
(2, 'Bruschetta', 'Toasted bread with tomato and basil', 200, 'https://via.placeholder.com/200?text=Bruschetta', TRUE),
(2, 'Tiramisu', 'Italian dessert with mascarpone', 280, 'https://via.placeholder.com/200?text=Tiramisu', TRUE);

-- Insert menu items for Nisha's Kitchen (chef_id = 3)
INSERT INTO MenuItems (chef_id, name, description, base_price, image_url, is_available) VALUES
(3, 'Chicken Tikka Masala', 'Tender chicken in creamy tomato sauce', 380, 'https://via.placeholder.com/200?text=Chicken+Tikka+Masala', TRUE),
(3, 'Garlic Naan', 'Fresh naan bread with garlic butter', 70, 'https://via.placeholder.com/200?text=Garlic+Naan', TRUE),
(3, 'Lamb Biryani', 'Fragrant biryani with tender lamb', 420, 'https://via.placeholder.com/200?text=Lamb+Biryani', TRUE),
(3, 'Paneer Kulcha', 'Stuffed bread with cottage cheese', 150, 'https://via.placeholder.com/200?text=Paneer+Kulcha', TRUE),
(3, 'Mango Lassi', 'Sweet yogurt drink with mango', 80, 'https://via.placeholder.com/200?text=Mango+Lassi', TRUE);

-- Insert menu items for Spice House Delights (chef_id = 4)
INSERT INTO MenuItems (chef_id, name, description, base_price, image_url, is_available) VALUES
(4, 'Tandoori Chicken', 'Grilled marinated chicken', 320, 'https://via.placeholder.com/200?text=Tandoori+Chicken', TRUE),
(4, 'Biryani Special', 'Premium biryani with vegetables', 350, 'https://via.placeholder.com/200?text=Biryani+Special', TRUE),
(4, 'Paneer Tikka', 'Grilled cottage cheese cubes', 280, 'https://via.placeholder.com/200?text=Paneer+Tikka', TRUE),
(4, 'Samosa', 'Crispy fried pastry with filling', 80, 'https://via.placeholder.com/200?text=Samosa', TRUE),
(4, 'Raita', 'Yogurt and cucumber sauce', 60, 'https://via.placeholder.com/200?text=Raita', TRUE);

-- Insert menu items for Homestyle Cooking (chef_id = 5)
INSERT INTO MenuItems (chef_id, name, description, base_price, image_url, is_available) VALUES
(5, 'Dal Makhani', 'Creamy lentil curry', 220, 'https://via.placeholder.com/200?text=Dal+Makhani', TRUE),
(5, 'Rajma Rice', 'Red kidney beans with rice', 200, 'https://via.placeholder.com/200?text=Rajma+Rice', TRUE),
(5, 'Aloo Gobi', 'Potato and cauliflower curry', 180, 'https://via.placeholder.com/200?text=Aloo+Gobi', TRUE),
(5, 'Roti', 'Whole wheat flatbread', 15, 'https://via.placeholder.com/200?text=Roti', TRUE),
(5, 'Sabzi Pulao', 'Rice with vegetables', 240, 'https://via.placeholder.com/200?text=Sabzi+Pulao', TRUE);

-- Insert menu items for Sweet Treats Bakery (chef_id = 6)
INSERT INTO MenuItems (chef_id, name, description, base_price, image_url, is_available) VALUES
(6, 'Chocolate Cake', 'Moist chocolate cake slice', 150, 'https://via.placeholder.com/200?text=Chocolate+Cake', TRUE),
(6, 'Gulab Jamun', 'Traditional milk solid dumplings', 120, 'https://via.placeholder.com/200?text=Gulab+Jamun', TRUE),
(6, 'Cupcakes', 'Assorted flavored cupcakes', 100, 'https://via.placeholder.com/200?text=Cupcakes', TRUE),
(6, 'Brownie', 'Fudgy chocolate brownie', 80, 'https://via.placeholder.com/200?text=Brownie', TRUE),
(6, 'Cookies', 'Chocolate chip cookies', 60, 'https://via.placeholder.com/200?text=Cookies', TRUE);

-- Insert menu items for Desi DabaWala (chef_id = 7)
INSERT INTO MenuItems (chef_id, name, description, base_price, image_url, is_available) VALUES
(7, 'Lunch Box Special', 'Complete meal with curry and rice', 350, 'https://via.placeholder.com/200?text=Lunch+Box+Special', TRUE),
(7, 'Simple Rice & Dal', 'Basic but delicious comfort food', 150, 'https://via.placeholder.com/200?text=Rice+and+Dal', TRUE),
(7, 'Vegetable Curry', 'Mixed vegetables in gravy', 180, 'https://via.placeholder.com/200?text=Vegetable+Curry', TRUE),
(7, 'Pickle & Papad', 'Homemade pickle and fried papad', 40, 'https://via.placeholder.com/200?text=Pickle+and+Papad', TRUE),
(7, 'Khichdi', 'Light and nutritious rice-lentil dish', 160, 'https://via.placeholder.com/200?text=Khichdi', TRUE);

-- Insert sample customer
INSERT INTO Customers (first_name, last_name, email, password_hash, phone_number) VALUES
('John', 'Doe', 'john@example.com', '$2b$10$JL9XTR9AByVyKHVKkN0CVu0tnZS6GFNGJVpF0R5LN0rFKXuJ7Tjn.', '9999999999');

-- Insert service areas for chefs (pincode 560001 is Bangalore)
INSERT INTO ServiceAreas (chef_id, pincode) VALUES
(1, '560001'),
(1, '560002'),
(2, '560001'),
(2, '560003'),
(3, '560001'),
(3, '560002'),
(4, '560001'),
(4, '560003'),
(5, '560001'),
(5, '560002'),
(6, '560001'),
(6, '560003'),
(7, '560001'),
(7, '560002');

-- Insert sample address for customer (pincode 560001)
INSERT INTO Addresses (entity_type, entity_id, street, city, pincode, house_no, label) VALUES
('Customer', 1, '123 Main Street', 'Bangalore', '560001', '42', 'Home');

-- Note: Password hash above is for password 'password123' using bcrypt
-- You can use this password to test login with email: john@example.com
