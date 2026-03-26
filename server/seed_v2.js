import { sequelize } from "./database/database.js";
import dotenv from "dotenv";
import { QueryTypes } from "sequelize";

dotenv.config({ path: "./.env" });

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log("Seeding extensive sample data...");

        // 1. Define Categories
        const categories = [
            "Mobiles", "Laptops", "Fashion", "Electronics", "Home & Furniture", "Beauty & Health"
        ];

        console.log("Adding categories...");
        const categoryIds = {};
        for (const catName of categories) {
            await sequelize.query(
                "INSERT INTO categories (category_name) VALUES (?) ON DUPLICATE KEY UPDATE category_id=LAST_INSERT_ID(category_id)",
                { replacements: [catName], type: QueryTypes.INSERT }
            );
            const [results] = await sequelize.query(
                "SELECT category_id FROM categories WHERE category_name = ?",
                { replacements: [catName], type: QueryTypes.SELECT }
            );
            categoryIds[catName] = results.category_id;
        }

        // 2. Add Products (20 for each)
        console.log("Adding 20 products per category...");
        
        const productsToInsert = [];

        // Helper to generate products
        const generateProducts = (catId, catName, count, basePrice, imgBase) => {
            for (let i = 1; i <= count; i++) {
                productsToInsert.push([
                    catId,
                    `${catName} SKU #${i}`,
                    `Premium quality ${catName} - Model ${2024 + i}. High performance and durable.`,
                    basePrice + (i * 10),
                    basePrice + (i * 10) - 20,
                    50 + i,
                    `${imgBase}&sig=${catName.replace(/\s/g, '')}${i}`
                ]);
            }
        };

        generateProducts(categoryIds["Mobiles"], "Smartphone", 20, 500, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400");
        generateProducts(categoryIds["Laptops"], "Laptop", 20, 800, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400");
        generateProducts(categoryIds["Fashion"], "Fashion Wear", 20, 50, "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=400");
        generateProducts(categoryIds["Electronics"], "Gadget", 20, 150, "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400");
        generateProducts(categoryIds["Home & Furniture"], "Furniture", 20, 300, "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400");
        generateProducts(categoryIds["Beauty & Health"], "Beauty Product", 20, 30, "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400");

        for (const p of productsToInsert) {
            await sequelize.query(
                "INSERT INTO products (category_id, product_name, description, price, discount_price, stock_quantity, main_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                { replacements: p, type: QueryTypes.INSERT }
            );
        }

        console.log(`SUCCESS: ${productsToInsert.length} products seeded.`);
    } catch (error) {
        console.error("Seeding FAILED:", error.message);
    } finally {
        await sequelize.close();
    }
};

seed();
