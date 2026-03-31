import { sequelize } from "./database/database.js";
import dotenv from "dotenv";
import { QueryTypes } from "sequelize";

dotenv.config({ path: "./.env" });

const addGroceryProducts = async () => {
    try {
        await sequelize.authenticate();
        console.log("Adding grocery products...");

        // 1. Add Grocery Category
        console.log("Adding grocery category...");
        await sequelize.query(
            "INSERT INTO categories (category_name) VALUES (?) ON DUPLICATE KEY UPDATE category_id=LAST_INSERT_ID(category_id)",
            { replacements: ["Grocery"], type: QueryTypes.INSERT }
        );
        
        const [results] = await sequelize.query(
            "SELECT category_id FROM categories WHERE category_name = ?",
            { replacements: ["Grocery"], type: QueryTypes.SELECT }
        );
        const groceryCategoryId = results.category_id;
        console.log("Grocery category ID:", groceryCategoryId);

        // 2. Define Grocery Products
        const groceryProducts = [
            // Fruits & Vegetables
            ["Fresh Apples", "Crisp and sweet red apples, perfect for snacking or baking.", 120, 100, 100, "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&q=80&w=400"],
            ["Organic Bananas", "Ripe organic bananas, rich in potassium and natural sweetness.", 60, 50, 150, "https://images.unsplash.com/photo-1543286986-2eeaea38f5be?auto=format&fit=crop&q=80&w=400"],
            ["Fresh Tomatoes", "Juicy red tomatoes, perfect for salads and cooking.", 80, 70, 80, "https://images.unsplash.com/photo-1546470427-e93b1c429b19?auto=format&fit=crop&q=80&w=400"],
            ["Organic Spinach", "Fresh organic spinach, rich in iron and vitamins.", 40, 35, 60, "https://images.unsplash.com/photo-1574233323939-0c05321ed5a9?auto=format&fit=crop&q=80&w=400"],
            ["Fresh Carrots", "Crunchy orange carrots, great for salads and cooking.", 50, 45, 90, "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&q=80&w=400"],
            
            // Dairy & Eggs
            ["Fresh Milk", "Pure and fresh whole milk, 1 liter pack.", 55, 50, 200, "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400"],
            ["Greek Yogurt", "Creamy Greek yogurt, high in protein.", 80, 70, 120, "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400"],
            ["Farm Fresh Eggs", "Free-range eggs, pack of 12.", 120, 110, 150, "https://images.unsplash.com/photo-1518569656558-1f25e69edd93?auto=format&fit=crop&q=80&w=400"],
            ["Cheddar Cheese", "Aged cheddar cheese, rich and flavorful.", 200, 180, 80, "https://images.unsplash.com/photo-1486477181946-6428a0291777?auto=format&fit=crop&q=80&w=400"],
            ["Butter", "Pure unsalted butter, 500g pack.", 150, 140, 100, "https://images.unsplash.com/photo-1586201375761-83865002e8c5?auto=format&fit=crop&q=80&w=400"],
            
            // Grains & Cereals
            ["Basmati Rice", "Premium quality basmati rice, 5kg pack.", 350, 320, 120, "https://images.unsplash.com/photo-1536304078424-3e1a8c5dc33c?auto=format&fit=crop&q=80&w=400"],
            ["Whole Wheat Bread", "Fresh whole wheat bread, daily baked.", 45, 40, 80, "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400"],
            ["Oats", "Rolled oats, perfect for healthy breakfast.", 180, 160, 150, "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=400"],
            ["Pasta", "Italian pasta, al dente perfection.", 90, 80, 140, "https://images.unsplash.com/photo-1528645652321-e1e895a5bb8a?auto=format&fit=crop&q=80&w=400"],
            ["Quinoa", "Organic quinoa, superfood grain.", 280, 250, 90, "https://images.unsplash.com/photo-1544484959-80ea005bee46?auto=format&fit=crop&q=80&w=400"],
            
            // Beverages
            ["Orange Juice", "100% fresh orange juice, no additives.", 120, 100, 100, "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400"],
            ["Green Tea", "Premium green tea leaves, antioxidant rich.", 200, 180, 80, "https://images.unsplash.com/photo-1576092768247-dc3b8ec5c5a7?auto=format&fit=crop&q=80&w=400"],
            ["Coffee Beans", "Premium arabica coffee beans, medium roast.", 450, 400, 60, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400"],
            ["Mineral Water", "Pure mineral water, pack of 12 bottles.", 60, 55, 200, "https://images.unsplash.com/photo-1548839148-1a0b5d5e5d71?auto=format&fit=crop&q=80&w=400"],
            ["Coconut Water", "Natural coconut water, refreshing and healthy.", 80, 70, 120, "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?auto=format&fit=crop&q=80&w=400"],
            
            // Snacks & Spices
            ["Mixed Nuts", "Premium mixed nuts, healthy snack pack.", 350, 320, 80, "https://images.unsplash.com/photo-1528722828814-77b9b83aafb3?auto=format&fit=crop&q=80&w=400"],
            ["Dark Chocolate", "70% dark chocolate, antioxidant rich.", 180, 160, 100, "https://images.unsplash.com/photo-1548701934-344f0e3efe1c?auto=format&fit=crop&q=80&w=400"],
            ["Honey", "Pure organic honey, 500g jar.", 250, 220, 70, "https://images.unsplash.com/photo-1558800745-6e78d6f4e6d7?auto=format&fit=crop&q=80&w=400"],
            ["Olive Oil", "Extra virgin olive oil, cold pressed.", 420, 380, 60, "https://images.unsplash.com/photo-1478369402113-1fd53f17e8b4?auto=format&fit=crop&q=80&w=400"],
            ["Sea Salt", "Natural sea salt, fine crystals.", 80, 70, 150, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400"]
        ];

        // 3. Insert Grocery Products
        console.log("Adding grocery products...");
        for (const product of groceryProducts) {
            await sequelize.query(
                "INSERT INTO products (category_id, product_name, description, price, discount_price, stock_quantity, main_image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                { 
                    replacements: [
                        groceryCategoryId, 
                        product[0], // product_name
                        product[1], // description
                        product[2], // price
                        product[3], // discount_price
                        product[4], // stock_quantity
                        product[5], // main_image_url
                        1 // is_active
                    ], 
                    type: QueryTypes.INSERT 
                }
            );
        }

        console.log(`SUCCESS: ${groceryProducts.length} grocery products added!`);
        console.log("Grocery category and products have been successfully added to the database.");
        
    } catch (error) {
        console.error("Adding grocery products FAILED:", error.message);
        console.error("Full error:", error);
    } finally {
        await sequelize.close();
    }
};

addGroceryProducts();
