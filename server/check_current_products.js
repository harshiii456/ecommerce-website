import { sequelize } from "./database/database.js";
import dotenv from "dotenv";
import { QueryTypes } from "sequelize";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './.env' });

const checkCurrentProducts = async () => {
    try {
        await sequelize.authenticate();
        console.log("=== CURRENT DATABASE STATUS ===");

        // Check categories
        const categories = await sequelize.query("SELECT * FROM categories", { type: QueryTypes.SELECT });
        console.log("\n📂 Categories:");
        categories.forEach(cat => {
            console.log(`  ${cat.category_id}: ${cat.category_name}`);
        });

        // Check if grocery category exists
        const groceryCategory = await sequelize.query(
            "SELECT * FROM categories WHERE category_name = 'Grocery'", 
            { type: QueryTypes.SELECT }
        );
        
        if (groceryCategory.length > 0) {
            console.log(`\n✅ Grocery category exists with ID: ${groceryCategory[0].category_id}`);
            
            // Check grocery products
            const groceryProducts = await sequelize.query(
                "SELECT COUNT(*) as count FROM products WHERE category_id = ?", 
                { replacements: [groceryCategory[0].category_id], type: QueryTypes.SELECT }
            );
            console.log(`📦 Grocery products count: ${groceryProducts[0].count}`);
            
            if (groceryProducts[0].count === 0) {
                console.log("❌ No grocery products found in database!");
                console.log("💡 You need to run the SQL queries to add grocery products.");
            }
        } else {
            console.log("\n❌ Grocery category does NOT exist!");
            console.log("💡 You need to create the grocery category first.");
        }

        // Check total products by category
        const productsByCategory = await sequelize.query(`
            SELECT c.category_name, COUNT(p.product_id) as product_count 
            FROM categories c 
            LEFT JOIN products p ON c.category_id = p.category_id 
            GROUP BY c.category_id, c.category_name 
            ORDER BY product_count DESC
        `, { type: QueryTypes.SELECT });
        
        console.log("\n📊 Products by Category:");
        productsByCategory.forEach(cat => {
            console.log(`  ${cat.category_name}: ${cat.product_count} products`);
        });

    } catch (error) {
        console.error("❌ Database check failed:", error.message);
    } finally {
        await sequelize.close();
    }
};

checkCurrentProducts();
