import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const addProducts = async () => {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.NAME,
        password: process.env.PASS,
    });

    try {
        console.log("Adding custom products...");

        const categories = [
            { name: 'Grocery', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400' },
            { name: 'Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400' },
            { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400' },
            { name: 'TV', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400' },
            { name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=400' }
        ];

        const categoryMap = {};

        for (const cat of categories) {
            await connection.query(
                "INSERT INTO categories (category_name) VALUES (?) ON DUPLICATE KEY UPDATE category_id=LAST_INSERT_ID(category_id)",
                [cat.name]
            );
            const [rows] = await connection.query("SELECT category_id FROM categories WHERE category_name = ?", [cat.name]);
            categoryMap[cat.name] = rows[0].category_id;
        }

        const productsData = {
            'Grocery': [
                ['Organic Almonds', 'Healthy organic almonds, 500g pack', 15.99, 12.99, 100, 'https://images.unsplash.com/photo-1508061253366-f7da158b6846?auto=format&fit=crop&q=80&w=400'],
                ['Whole Wheat Bread', 'Freshly baked whole wheat bread', 3.49, 2.99, 50, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'],
                ['Fresh Milk 1L', 'Farm fresh cow milk', 2.49, 1.99, 80, 'https://images.unsplash.com/photo-1550583724-125581fe2ffb?auto=format&fit=crop&q=80&w=400'],
                ['Extra Virgin Olive Oil', 'Cold pressed olive oil, 500ml', 12.99, 10.99, 60, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400'],
                ['Greek Yogurt', 'Protein-rich thick greek yogurt', 4.99, 3.99, 40, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400'],
                ['Basmati Rice 5kg', 'Long grain aromatic basmati rice', 25.00, 22.00, 30, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400'],
                ['Pure Honey', 'Natural raw honey, 250g', 8.50, 7.50, 70, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400'],
                ['Sea Salt', 'Fine grain mineral sea salt', 2.99, 2.49, 150, 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=400'],
                ['Black Peppercorns', 'Whole black peppercorns, 100g', 5.99, 4.99, 90, 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=400'],
                ['Avocados', 'Ripe Hass avocados, pack of 2', 4.50, 3.99, 25, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400'],
                ['Fresh Blueberries', 'Sweet organic blueberries, 125g', 3.99, 3.49, 35, 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&q=80&w=400'],
                ['Organic Spinach', 'Fresh pre-washed spinach leaves', 2.99, 2.49, 45, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400'],
                ['Quinoa', 'White organic quinoa, 500g', 7.99, 6.99, 55, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400'],
                ['Coconut Water', 'Pure coconut water no added sugar', 3.50, 2.99, 100, 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=400'],
                ['Dark Chocolate 70%', 'Rich dark chocolate bar', 4.50, 3.99, 120, 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&q=80&w=400'],
                ['Peanut Butter', 'Creamy roasted peanut butter', 5.99, 4.99, 65, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=400'],
                ['Oatmeal', 'Steel cut rolled oats, 1kg', 8.99, 7.49, 75, 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=400'],
                ['Cage-Free Eggs', 'Fresh jumbo cage-free eggs, dozen', 5.50, 4.99, 40, 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400'],
                ['Balsamic Vinegar', 'Aged balsamic vinegar from Modena', 14.99, 12.99, 20, 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400'],
                ['Green Tea Bags', 'Antioxidant rich green tea, 20 bags', 6.50, 5.50, 110, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=400']
            ],
            'Mobiles': [
                ['Pixel 8 Pro', 'Google flagship with superior AI camera', 999.00, 899.00, 40, 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400'],
                ['OnePlus 12', 'Smooth performance and fast charging', 799.00, 749.00, 35, 'https://images.unsplash.com/photo-1707038162238-d63fa289650b?auto=format&fit=crop&q=80&w=400'],
                ['iPhone 15', 'Powerful and sleek Apple smartphone', 799.00, 759.00, 50, 'https://images.unsplash.com/photo-1695048133142-1a73905dd30d?auto=format&fit=crop&q=80&w=400'],
                ['Galaxy S24', 'Compact flagship with AI features', 799.00, 729.00, 45, 'https://images.unsplash.com/photo-1707038162238-d63fa289650b?auto=format&fit=crop&q=80&w=400'],
                ['Xiaomi 14', 'Leica co-engineered camera system', 849.00, 799.00, 20, 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&q=80&w=400'],
                ['Redmi Note 13 Pro', 'Versatile mid-range with 200MP camera', 399.00, 349.00, 100, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=400'],
                ['Moto Edge 40', 'Sleek design and clean Android', 449.00, 399.00, 60, 'https://images.unsplash.com/photo-1556656793-062ff98782ee?auto=format&fit=crop&q=80&w=400'],
                ['Galaxy Z Flip 5', 'Interactive cover screen foldable', 999.00, 899.00, 15, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400'],
                ['Nothing Phone 2', 'Unique glyph interface and premium build', 599.00, 549.00, 40, 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=400'],
                ['Sony Xperia 1 V', 'Professional 4K display and camera', 1299.00, 1199.00, 10, 'https://images.unsplash.com/photo-1580910051074-3eb0f4bd8a0d?auto=format&fit=crop&q=80&w=400'],
                ['Realme 12 Pro+', 'Curved display and periscope lens', 499.00, 449.00, 80, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
                ['Vivo X100 Pro', 'Zeiss optics for photography', 949.00, 899.00, 25, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
                ['Asus ROG Phone 8', 'Ultimate gaming powerhouse', 1099.00, 999.00, 15, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
                ['Poco X6 Pro', 'Flagship performance on a budget', 349.00, 299.00, 120, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
                ['OPPO Reno 11', 'Expert portrait photography', 499.00, 459.00, 70, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
                ['Honor Magic 6 Pro', 'Advanced silicon-carbon battery', 1099.00, 999.00, 20, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
                ['ZTE Nubia Z60 Ultra', 'Under-display camera innovation', 799.00, 749.00, 10, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
                ['Nokia XR21', 'Rugged durability and security', 499.00, 449.00, 30, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
                ['Fairphone 5', 'Sustainable and repairable modular design', 699.00, 649.00, 15, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
                ['Redmi A3', 'Affordable basic smartphone', 129.00, 99.00, 200, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400']
            ],
            'Electronics': [
                ['Sony WH-1000XM5', 'Industry leading noise cancelling headphones', 399.00, 349.00, 100, 'https://images.unsplash.com/photo-1628202926206-c63a34b1618f?auto=format&fit=crop&q=80&w=400'],
                ['Logitech MX Master 3S', 'Advanced ergonomic wireless mouse', 99.00, 89.00, 150, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400'],
                ['Samsung T7 SSD 1TB', 'Portable high speed storage', 129.00, 109.00, 200, 'https://images.unsplash.com/photo-1597740985671-2a8a3b80f017?auto=format&fit=crop&q=80&w=400'],
                ['GoPro HERO12', 'Versatile action camera for adventure', 399.00, 349.00, 50, 'https://images.unsplash.com/photo-1500646953400-045056a916d7?auto=format&fit=crop&q=80&w=400'],
                ['DJI Mini 4 Pro', 'Lightweight drone with 4K HDR video', 759.00, 699.00, 30, 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400'],
                ['Apple Watch Series 9', 'Advanced health tracking smartwatch', 399.00, 369.00, 75, 'https://images.unsplash.com/photo-1544117518-30df578096a4?auto=format&fit=crop&q=80&w=400'],
                ['Kindle Paperwhite', 'Adjustable warm light e-reader', 139.00, 119.00, 120, 'https://images.unsplash.com/photo-1594980596271-e33bc238299b?auto=format&fit=crop&q=80&w=400'],
                ['Bose SoundLink Flex', 'Portable waterproof bluetooth speaker', 149.00, 129.00, 90, 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=400'],
                ['Canon EOS R10', 'Compact mirrorless creator camera', 979.00, 899.00, 20, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400'],
                ['SteelSeries Arctis Nova 7', 'Wireless multi-platform gaming headset', 179.00, 159.00, 60, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400'],
                ['WD Black SN850X 2TB', 'High performance Gen4 gaming SSD', 189.00, 169.00, 100, 'https://images.unsplash.com/photo-1597740985671-2a8a3b80f017?auto=format&fit=crop&q=80&w=400'],
                ['Anker 737 Power Bank', 'Ultra-powerful 140W charging', 149.00, 129.00, 85, 'https://images.unsplash.com/photo-1619131652150-104928b7e283?auto=format&fit=crop&q=80&w=400'],
                ['HyperX QuadCast S', 'USB condenser microphone with RGB', 159.00, 139.00, 45, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400'],
                ['ASUS ZenScreen MB16AC', 'Portable 15.6 inch USB monitor', 229.00, 199.00, 35, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400'],
                ['Razer DeathAdder V3', 'Lightweight professional gaming mouse', 69.00, 59.00, 180, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400'],
                ['Elgato Stream Deck MK.2', 'Customizable controller for streaming', 149.00, 139.00, 40, 'https://images.unsplash.com/photo-1616421450201-92582859b40d?auto=format&fit=crop&q=80&w=400'],
                ['Wacom Intuos Pro', 'Professional creative pen tablet', 249.00, 229.00, 25, 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400'],
                ['Netgear Nighthawk M6', 'Unlocked mobile hotspot with 5G', 799.00, 749.00, 15, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400'],
                ['TP-Link Deco XE75', 'Whole home mesh WiFi 6E system', 349.00, 299.00, 55, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400'],
                ['Lacie Rugged Mini 2TB', 'Durable and drop resistant external HDD', 109.00, 99.00, 90, 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=400']
            ],
            'TV': [
                ['LG C3 OLED 55"', 'Perfect black levels and stunning colors', 1499.00, 1299.00, 20, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Samsung QN90C Neo QLED', 'Brilliant highlights and deep contrast', 1699.00, 1499.00, 15, 'https://images.unsplash.com/photo-1593784991095-a205039470b6?auto=format&fit=crop&q=80&w=400'],
                ['Sony X90L Bravia XR', 'Cognitive intelligence for realism', 1199.00, 1099.00, 25, 'https://images.unsplash.com/photo-1461151304267-38535e770d76?auto=format&fit=crop&q=80&w=400'],
                ['TCL 6-Series Mini-LED', 'Great performance at an amazing value', 699.00, 649.00, 40, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Hisense U8K QLED', 'Incredible brightness and color gamut', 799.00, 749.00, 35, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Vizio MQX Series', 'Responsive gaming with high refresh rate', 629.00, 599.00, 50, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Amazon Fire TV Omni QLED', 'Smooth 4K performance with Alexa', 549.00, 499.00, 60, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Philips Ambilight 4K', 'Immersive viewing with backlighting', 899.00, 849.00, 10, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Panasonic JZ2000 OLED', 'Cinema-grade picture quality', 2499.00, 2299.00, 5, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Sharp Aquos 4K', 'Clean design and vibrant display', 499.00, 449.00, 30, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Toshiba M550 Fire TV', 'Budget friendly 4K smart TV', 399.00, 349.00, 80, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Skyworth QLED TV', 'Advanced quantum dot technology', 599.00, 549.00, 45, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Xiaomi TV S Pro', 'Sleek bezels and fluid Android TV', 649.00, 599.00, 55, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Sceptre 4K Ultra HD', 'Utilitarian 4K for home and office', 329.00, 299.00, 100, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Element Roku TV', 'Simplified streaming experience', 279.00, 249.00, 120, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Insignia F30 LED', 'Value oriented LED smart TV', 249.00, 199.00, 150, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['JVC Fire Edition TV', 'Balanced sound and picture', 349.00, 299.00, 70, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Sanyo Smart TV', 'Dependable performance for every room', 299.00, 269.00, 90, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Grundig 4K Smart TV', 'Modern design from Germany', 459.00, 419.00, 20, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
                ['Loewe bild v. OLED', 'Exquisite luxury design and panel', 3999.00, 3699.00, 3, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400']
            ],
            'Fashion': [
                ['Classic Denim Jacket', 'Timeless blue denim jacket', 65.00, 55.00, 100, 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=400'],
                ['Slim Fit Chinos', 'Versatile cotton chinos for every day', 45.00, 39.00, 150, 'https://images.unsplash.com/photo-1473966968600-fa804b868926?auto=format&fit=crop&q=80&w=400'],
                ['Leather Chelsea Boots', 'Stylish and durable leather boots', 120.00, 99.00, 60, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'],
                ['Silk Wrap Dress', 'Elegant silk dress for special occasions', 95.00, 79.00, 40, 'https://images.unsplash.com/photo-1539008835270-aa6467406a4a?auto=format&fit=crop&q=80&w=400'],
                ['Cashmere Sweater', 'Ultra soft premium cashmere knit', 150.00, 129.00, 30, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400'],
                ['Wool Blend Overcoat', 'Structured wool coat for winter', 199.00, 169.00, 25, 'https://images.unsplash.com/photo-1539533113208-f6df84525883?auto=format&fit=crop&q=80&w=400'],
                ['Canvas High-Top Sneakers', 'Comfortable classic sneakers', 55.00, 45.00, 200, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'],
                ['Linen Button-Down Shirt', 'Breathable linen for summer comfort', 49.00, 39.00, 120, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400'],
                ['Graphic T-Shirt', 'Soft cotton tee with unique print', 25.00, 19.00, 300, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400'],
                ['Straight Leg Jeans', 'Classic fit denim for all day wear', 59.00, 49.00, 180, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400'],
                ['Yoga Leggings', 'High-waist performance leggings', 40.00, 34.00, 140, 'https://images.unsplash.com/photo-1506629082925-ef3114d9b4b0?auto=format&fit=crop&q=80&w=400'],
                ['Running Shorts', 'Lightweight moisture-wicking shorts', 30.00, 25.00, 250, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400'],
                ['Puffer Vest', 'Insulated vest for layering', 79.00, 69.00, 85, 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=400'],
                ['Sunglasses Aviator', 'Classic aviator style sunglasses', 15.00, 12.00, 500, 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=400'],
                ['Leather Belt', 'Top grain leather belt, brown', 35.00, 29.00, 220, 'https://images.unsplash.com/photo-1524380365264-3e9903b12634?auto=format&fit=crop&q=80&w=400'],
                ['Beanie Hat', 'Warm ribbed knit beanie', 19.00, 15.00, 400, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=400'],
                ['Tote Bag', 'Durable canvas tote for essentials', 29.00, 24.00, 160, 'https://images.unsplash.com/photo-1544816155-12df96cc27d4?auto=format&fit=crop&q=80&w=400'],
                ['Crossbody Purse', 'Compact leather crossbody bag', 55.00, 49.00, 95, 'https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?auto=format&fit=crop&q=80&w=400'],
                ['Wristwatch Chronograph', 'Classic design with leather strap', 129.00, 99.00, 50, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400'],
                ['Scarf Plaid', 'Soft wool plaid scarf', 35.00, 25.00, 110, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=400']
            ]
        };

        const insertQuery = "INSERT INTO products (category_id, product_name, description, price, discount_price, stock_quantity, main_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";

        for (const catName in productsData) {
            const catId = categoryMap[catName];
            console.log(`Inserting products for category: ${catName} (ID: ${catId})`);
            for (const p of productsData[catName]) {
                await connection.query(insertQuery, [catId, ...p]);
            }
        }

        console.log("SUCCESS: Custom products added.");
    } catch (error) {
        console.error("Seeding FAILED:", error.message);
    } finally {
        await connection.end();
    }
};

addProducts();
