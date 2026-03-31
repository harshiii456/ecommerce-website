import { sequelize, models } from "./database/models/index.js";

const { Product, Category } = models;

async function clearOldProducts() {
  try {
    console.log("=== CLEARING OLD ELECTRONICS PRODUCTS ===");
    
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // Check all products first
    const allProducts = await Product.findAll({
      attributes: ['product_id', 'product_name', 'category_id']
    });
    
    console.log(`\n📦 Total Products in Database: ${allProducts.length}`);
    
    // Group by category
    const productsByCategory = {};
    allProducts.forEach(product => {
      if (!productsByCategory[product.category_id]) {
        productsByCategory[product.category_id] = [];
      }
      productsByCategory[product.category_id].push(product);
    });
    
    console.log("\n📋 Products by Category:");
    Object.keys(productsByCategory).forEach(categoryId => {
      console.log(`Category ${categoryId}: ${productsByCategory[categoryId].length} products`);
      productsByCategory[categoryId].slice(0, 3).forEach(product => {
        console.log(`  - ${product.product_name}`);
      });
      if (productsByCategory[categoryId].length > 3) {
        console.log(`  ... and ${productsByCategory[categoryId].length - 3} more`);
      }
    });

    // Check if there are electronics products in category_id=1
    const category1Products = await Product.findAll({
      where: { category_id: 1 },
      attributes: ['product_id', 'product_name', 'category_id']
    });
    
    console.log(`\n🔍 Category 1 Products (${category1Products.length}):`);
    category1Products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.product_name}`);
    });

    // If category 1 has electronics instead of fashion, clear it
    const hasElectronics = category1Products.some(product => 
      product.product_name.toLowerCase().includes('iphone') ||
      product.product_name.toLowerCase().includes('samsung') ||
      product.product_name.toLowerCase().includes('phone') ||
      product.product_name.toLowerCase().includes('galaxy')
    );

    if (hasElectronics) {
      console.log("\n🧹 Found electronics products in category 1. Clearing them...");
      
      // Delete all products in category 1
      await Product.destroy({
        where: { category_id: 1 }
      });
      
      console.log("✅ Cleared all products from category 1");
      console.log("🔄 Fashion products should now appear correctly");
    } else {
      console.log("\n✅ Category 1 contains correct fashion products");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

clearOldProducts();
