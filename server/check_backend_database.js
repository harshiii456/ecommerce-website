import { sequelize } from "./database/database.js";

async function checkBackendDatabase() {
  try {
    console.log("=== CHECKING BACKEND DATABASE CONNECTION ===");
    
    await sequelize.authenticate();
    console.log("✅ Backend database connected successfully!");
    
    // Check database name
    const [results] = await sequelize.query("SELECT DATABASE() as db_name");
    console.log(`📊 Database Name: ${results[0].db_name}`);
    
    // Check categories in this database
    const [categories] = await sequelize.query("SELECT category_id, category_name FROM categories");
    console.log("\n📋 Categories in Backend Database:");
    categories.forEach(cat => {
      console.log(`ID: ${cat.category_id} - Name: ${cat.category_name}`);
    });
    
    // Check products in category_id=1
    const [products] = await sequelize.query("SELECT product_id, product_name, category_id FROM products WHERE category_id = 1 LIMIT 5");
    console.log(`\n📦 Products in Category ID 1 (Backend Database):`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.product_name} - Category: ${product.category_id}`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

checkBackendDatabase();
