import { sequelize, models } from "./database/models/index.js";

const { Category, Product } = models;

async function checkCategoryConflict() {
  try {
    console.log("=== CHECKING CATEGORY CONFLICT ===");
    
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // Check all categories
    const categories = await Category.findAll();
    console.log("\n📋 ALL CATEGORIES:");
    categories.forEach(cat => {
      console.log(`ID: ${cat.category_id} - Name: ${cat.category_name}`);
    });

    // Check what's in category_id=1
    const category1Products = await Product.findAll({
      where: { category_id: 1 },
      limit: 10,
      attributes: ['product_id', 'product_name', 'category_id']
    });
    
    console.log(`\n📦 Products in Category ID 1 (First 10):`);
    category1Products.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.product_id} - Name: ${product.product_name} - Category: ${product.category_id}`);
    });

    // Check Fashion category specifically
    const fashionCategory = await Category.findOne({
      where: { category_name: "Fashion" }
    });

    if (fashionCategory) {
      console.log(`\n✅ Fashion Category - ID: ${fashionCategory.category_id}`);
      
      const fashionProducts = await Product.findAll({
        where: { category_id: fashionCategory.category_id },
        limit: 5,
        attributes: ['product_id', 'product_name', 'category_id']
      });
      
      console.log(`\n🛒 Fashion Products (First 5):`);
      fashionProducts.forEach((product, index) => {
        console.log(`${index + 1}. ID: ${product.product_id} - Name: ${product.product_name} - Category: ${product.category_id}`);
      });
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

checkCategoryConflict();
