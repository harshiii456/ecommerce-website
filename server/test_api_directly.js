import { getAllProducts } from "./modals/product.modal.sequelize.js";

async function testAPIDirectly() {
  try {
    console.log("=== TESTING API DIRECTLY ===");
    
    // Test with category_id=1 (Fashion)
    const fashionProducts = await getAllProducts({ category_id: "1" });
    
    console.log(`\n🛒 Fashion Products from API: ${fashionProducts.length}`);
    if (fashionProducts.length > 0) {
      console.log("First 5 products:");
      fashionProducts.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.product_name} - Category: ${product.category_id}`);
      });
    }

    // Test without category filter
    const allProducts = await getAllProducts({});
    console.log(`\n📦 Total Products: ${allProducts.length}`);
    
    // Check first few products to see what categories they belong to
    const sampleProducts = allProducts.slice(0, 5);
    console.log("\nSample products from all products:");
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.product_name} - Category: ${product.category_id}`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testAPIDirectly();
