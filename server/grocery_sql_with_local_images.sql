-- ========================================
-- ADD GROCERY CATEGORY AND PRODUCTS WITH LOCAL IMAGES
-- ========================================

-- 1. Add Grocery Category
INSERT INTO categories (category_name) VALUES ('Grocery');

-- Get the category ID (run this after the insert above)
SELECT category_id FROM categories WHERE category_name = 'Grocery';

-- 2. Add Grocery Products with LOCAL IMAGES (replace CATEGORY_ID with the actual ID from above)
-- Fruits & Vegetables
INSERT INTO products (category_id, product_name, description, price, discount_price, stock_quantity, main_image_url, is_active) VALUES 
(1, 'Fresh Apples', 'Crisp and sweet red apples, perfect for snacking or baking.', 120, 100, 100, '/images/grocery/fresh_apples.jpg', 1),
(1, 'Organic Bananas', 'Ripe organic bananas, rich in potassium and natural sweetness.', 60, 50, 150, '/images/grocery/organic_bananas.jpg', 1),
(1, 'Fresh Tomatoes', 'Juicy red tomatoes, perfect for salads and cooking.', 80, 70, 80, '/images/grocery/fresh_tomatoes.jpg', 1),
(1, 'Organic Spinach', 'Fresh organic spinach, rich in iron and vitamins.', 40, 35, 60, '/images/grocery/organic_spinach.jpg', 1),
(1, 'Fresh Carrots', 'Crunchy orange carrots, great for salads and cooking.', 50, 45, 90, '/images/grocery/fresh_carrots.jpg', 1),

-- Dairy & Eggs
(1, 'Fresh Milk', 'Pure and fresh whole milk, 1 liter pack.', 55, 50, 200, '/images/grocery/fresh_milk.jpg', 1),
(1, 'Greek Yogurt', 'Creamy Greek yogurt, high in protein.', 80, 70, 120, '/images/grocery/greek_yogurt.jpg', 1),
(1, 'Farm Fresh Eggs', 'Free-range eggs, pack of 12.', 120, 110, 150, '/images/grocery/farm_fresh_eggs.jpg', 1),
(1, 'Cheddar Cheese', 'Aged cheddar cheese, rich and flavorful.', 200, 180, 80, '/images/grocery/cheddar_cheese.jpg', 1),
(1, 'Butter', 'Pure unsalted butter, 500g pack.', 150, 140, 100, '/images/grocery/butter.jpg', 1),

-- Grains & Cereals
(1, 'Basmati Rice', 'Premium quality basmati rice, 5kg pack.', 350, 320, 120, '/images/grocery/basmati_rice.jpg', 1),
(1, 'Whole Wheat Bread', 'Fresh whole wheat bread, daily baked.', 45, 40, 80, '/images/grocery/whole_wheat_bread.jpg', 1),
(1, 'Oats', 'Rolled oats, perfect for healthy breakfast.', 180, 160, 150, '/images/grocery/oats.jpg', 1),
(1, 'Pasta', 'Italian pasta, al dente perfection.', 90, 80, 140, '/images/grocery/pasta.jpg', 1),
(1, 'Quinoa', 'Organic quinoa, superfood grain.', 280, 250, 90, '/images/grocery/quinoa.jpg', 1),

-- Beverages
(1, 'Orange Juice', '100% fresh orange juice, no additives.', 120, 100, 100, '/images/grocery/orange_juice.jpg', 1),
(1, 'Green Tea', 'Premium green tea leaves, antioxidant rich.', 200, 180, 80, '/images/grocery/green_tea.jpg', 1),
(1, 'Coffee Beans', 'Premium arabica coffee beans, medium roast.', 450, 400, 60, '/images/grocery/coffee_beans.jpg', 1),
(1, 'Mineral Water', 'Pure mineral water, pack of 12 bottles.', 60, 55, 200, '/images/grocery/mineral_water.jpg', 1),
(1, 'Coconut Water', 'Natural coconut water, refreshing and healthy.', 80, 70, 120, '/images/grocery/coconut_water.jpg', 1),

-- Snacks & Spices
(1, 'Mixed Nuts', 'Premium mixed nuts, healthy snack pack.', 350, 320, 80, '/images/grocery/mixed_nuts.jpg', 1),
(1, 'Dark Chocolate', '70% dark chocolate, antioxidant rich.', 180, 160, 100, '/images/grocery/dark_chocolate.jpg', 1),
(1, 'Honey', 'Pure organic honey, 500g jar.', 250, 220, 70, '/images/grocery/honey.jpg', 1),
(1, 'Olive Oil', 'Extra virgin olive oil, cold pressed.', 420, 380, 60, '/images/grocery/olive_oil.jpg', 1),
(1, 'Sea Salt', 'Natural sea salt, fine crystals.', 80, 70, 150, '/images/grocery/sea_salt.jpg', 1);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check grocery category
SELECT * FROM categories WHERE category_name = 'Grocery';

-- Count grocery products
SELECT COUNT(*) as grocery_product_count FROM products p 
JOIN categories c ON p.category_id = c.category_id 
WHERE c.category_name = 'Grocery';

-- List all grocery products with image paths
SELECT p.product_name, p.price, p.stock_quantity, p.main_image_url FROM products p 
JOIN categories c ON p.category_id = c.category_id 
WHERE c.category_name = 'Grocery' 
ORDER BY p.product_name;
