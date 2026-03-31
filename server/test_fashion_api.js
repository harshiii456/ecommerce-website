import { sequelize, models } from "./database/models/index.js";

const { Product, Category } = models;

async function testFashionAPI() {
  try {
    console.log("=== TESTING FASHION API DATA ===");
    
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // Get Fashion category
    const fashionCategory = await Category.findOne({
      where: { category_name: "Fashion" }
    });

    if (fashionCategory) {
      console.log(`✅ Fashion Category ID: ${fashionCategory.category_id}`);
      
      // Get fashion products
      const fashionProducts = await Product.findAll({
        where: { category_id: fashionCategory.category_id },
        attributes: ['product_id', 'product_name', 'price', 'discount_price', 'main_image_url', 'description', 'stock_quantity']
      });
      
      console.log(`\n🛒 Fashion Products Found: ${fashionProducts.length}`);
      
      if (fashionProducts.length > 0) {
        console.log("\n📋 Fashion Products (API Format):");
        fashionProducts.forEach((product, index) => {
          console.log(`${index + 1}. ${JSON.stringify({
            product_id: product.product_id,
            product_name: product.product_name,
            price: product.price,
            discount_price: product.discount_price,
            main_image_url: product.main_image_url,
            category_id: product.category_id
          }, null, 2)}`);
        });
      }
    } else {
      console.log("❌ Fashion category not found");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

testFashionAPI();
