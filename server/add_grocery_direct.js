import { sequelize } from "./database/database.js";
import dotenv from "dotenv";
import { QueryTypes } from "sequelize";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './.env' });

const addGroceryDirectly = async () => {
    try {
        await sequelize.authenticate();
        console.log("🌱 Adding Grocery Products Directly to Database...");

        // Get grocery category ID
        const [groceryCategory] = await sequelize.query(
            "SELECT category_id FROM categories WHERE category_name = 'Grocery'", 
            { type: QueryTypes.SELECT }
        );
        
        if (!groceryCategory) {
            console.log("❌ Grocery category not found!");
            return;
        }
        
        const categoryId = groceryCategory.category_id;
        console.log(`✅ Using grocery category ID: ${categoryId}`);

        // Grocery products to add
        const groceryProducts = [
            {
                product_name: "Fresh Apples",
                description: "Crisp and sweet red apples, perfect for snacking or baking.",
                price: 120,
                discount_price: 100,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Organic Bananas",
                description: "Ripe organic bananas, rich in potassium and natural sweetness.",
                price: 60,
                discount_price: 50,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1543286986-2eeaea38f5be?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Fresh Tomatoes",
                description: "Juicy red tomatoes, perfect for salads and cooking.",
                price: 80,
                discount_price: 70,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1546470427-e93b1c429b19?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Organic Spinach",
                description: "Fresh organic spinach, rich in iron and vitamins.",
                price: 40,
                discount_price: 35,
                stock_quantity: 60,
                main_image_url: "https://images.unsplash.com/photo-1574233323939-0c05321ed5a9?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Fresh Carrots",
                description: "Crunchy orange carrots, great for salads and cooking.",
                price: 50,
                discount_price: 45,
                stock_quantity: 90,
                main_image_url: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Fresh Milk",
                description: "Pure and fresh whole milk, 1 liter pack.",
                price: 55,
                discount_price: 50,
                stock_quantity: 200,
                main_image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Greek Yogurt",
                description: "Creamy Greek yogurt, high in protein.",
                price: 80,
                discount_price: 70,
                stock_quantity: 120,
                main_image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Farm Fresh Eggs",
                description: "Free-range eggs, pack of 12.",
                price: 120,
                discount_price: 110,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1518569656558-1f25e69edd93?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Cheddar Cheese",
                description: "Aged cheddar cheese, rich and flavorful.",
                price: 200,
                discount_price: 180,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1486477181946-6428a0291777?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Butter",
                description: "Pure unsalted butter, 500g pack.",
                price: 150,
                discount_price: 140,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1586201375761-83865002e8c5?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Basmati Rice",
                description: "Premium quality basmati rice, 5kg pack.",
                price: 350,
                discount_price: 320,
                stock_quantity: 120,
                main_image_url: "https://images.unsplash.com/photo-1536304078424-3e1a8c5dc33c?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Whole Wheat Bread",
                description: "Fresh whole wheat bread, daily baked.",
                price: 45,
                discount_price: 40,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Oats",
                description: "Rolled oats, perfect for healthy breakfast.",
                price: 180,
                discount_price: 160,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Pasta",
                description: "Italian pasta, al dente perfection.",
                price: 90,
                discount_price: 80,
                stock_quantity: 140,
                main_image_url: "https://images.unsplash.com/photo-1528645652321-e1e895a5bb8a?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Quinoa",
                description: "Organic quinoa, superfood grain.",
                price: 280,
                discount_price: 250,
                stock_quantity: 90,
                main_image_url: "https://images.unsplash.com/photo-1544484959-80ea005bee46?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Orange Juice",
                description: "100% fresh orange juice, no additives.",
                price: 120,
                discount_price: 100,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Green Tea",
                description: "Premium green tea leaves, antioxidant rich.",
                price: 200,
                discount_price: 180,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1576092768247-dc3b8ec5c5a7?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Coffee Beans",
                description: "Premium arabica coffee beans, medium roast.",
                price: 450,
                discount_price: 400,
                stock_quantity: 60,
                main_image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Mineral Water",
                description: "Pure mineral water, pack of 12 bottles.",
                price: 60,
                discount_price: 55,
                stock_quantity: 200,
                main_image_url: "https://images.unsplash.com/photo-1548839148-1a0b5d5e5d71?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Coconut Water",
                description: "Natural coconut water, refreshing and healthy.",
                price: 80,
                discount_price: 70,
                stock_quantity: 120,
                main_image_url: "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Mixed Nuts",
                description: "Premium mixed nuts, healthy snack pack.",
                price: 350,
                discount_price: 320,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb3?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Dark Chocolate",
                description: "70% dark chocolate, antioxidant rich.",
                price: 180,
                discount_price: 160,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1548701934-344f0e3efe1c?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Honey",
                description: "Pure organic honey, 500g jar.",
                price: 250,
                discount_price: 220,
                stock_quantity: 70,
                main_image_url: "https://images.unsplash.com/photo-1558800745-6e78d6f4e6d7?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Olive Oil",
                description: "Extra virgin olive oil, cold pressed.",
                price: 420,
                discount_price: 380,
                stock_quantity: 60,
                main_image_url: "https://images.unsplash.com/photo-1478369402113-1fd53f17e8b4?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Sea Salt",
                description: "Natural sea salt, fine crystals.",
                price: 80,
                discount_price: 70,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400"
            }
        ];

        // Insert all products
        let successCount = 0;
        for (const product of groceryProducts) {
            try {
                await sequelize.query(
                    `INSERT INTO products (category_id, product_name, description, price, discount_price, stock_quantity, main_image_url, is_active) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
                    {
                        replacements: [
                            categoryId,
                            product.product_name,
                            product.description,
                            product.price,
                            product.discount_price,
                            product.stock_quantity,
                            product.main_image_url
                        ],
                        type: QueryTypes.INSERT
                    }
                );
                console.log(`✅ Added: ${product.product_name}`);
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to add ${product.product_name}:`, error.message);
            }
        }

        console.log(`\n🎉 SUCCESS: ${successCount}/${groceryProducts.length} grocery products added!`);
        
        // Verify insertion
        const [count] = await sequelize.query(
            "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
            { replacements: [categoryId], type: QueryTypes.SELECT }
        );
        console.log(`📦 Total grocery products in database: ${count.count}`);
        
        console.log('\n✅ Grocery section is now ready! Refresh your website to see the products.');
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await sequelize.close();
    }
};

addGroceryDirectly();
