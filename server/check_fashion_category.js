import { sequelize, models } from "./database/models/index.js";

const { Category, Product } = models;

async function checkFashionCategory() {
  try {
    console.log("=== CHECKING FASHION CATEGORY AND PRODUCTS ===");
    
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // Check all categories
    const categories = await Category.findAll();
    console.log("\n📋 ALL CATEGORIES:");
    categories.forEach(cat => {
      console.log(`ID: ${cat.category_id} - Name: ${cat.category_name}`);
    });

    // Find Fashion category
    const fashionCategory = await Category.findOne({
      where: { category_name: "Fashion" }
    });

    if (fashionCategory) {
      console.log(`\n✅ Fashion Category Found - ID: ${fashionCategory.category_id}`);
      
      // Check fashion products
      const fashionProducts = await Product.findAll({
        where: { category_id: fashionCategory.category_id }
      });
      
      console.log(`\n🛒 Fashion Products Count: ${fashionProducts.length}`);
      if (fashionProducts.length > 0) {
        console.log("First 5 Fashion Products:");
        fashionProducts.slice(0, 5).forEach((product, index) => {
          console.log(`${index + 1}. ${product.product_name} - $${product.price}`);
        });
      }
    } else {
      console.log("\n❌ Fashion Category NOT FOUND!");
    }

    // Also check what category_id 8 contains
    const category8Products = await Product.findAll({
      where: { category_id: 8 }
    });
    
    console.log(`\n📦 Products in Category ID 8: ${category8Products.length}`);
    if (category8Products.length > 0) {
      console.log("First 3 Products in Category 8:");
      category8Products.slice(0, 3).forEach((product, index) => {
        console.log(`${index + 1}. ${product.product_name} - $${product.price}`);
      });
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

checkFashionCategory();
