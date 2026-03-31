import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const debugGroceryProducts = async () => {
    try {
        console.log('🔍 Debugging Grocery Products...\n');
        
        // 1. Check all categories
        console.log('📂 All Categories:');
        const catResponse = await axios.get(`${API_BASE}/category`);
        const categories = catResponse.data.data;
        
        categories.forEach(cat => {
            console.log(`  ID ${cat.category_id}: ${cat.category_name}`);
        });
        
        // 2. Check grocery category specifically
        const grocery = categories.find(cat => cat.category_name === 'Grocery');
        if (!grocery) {
            console.log('\n❌ Grocery category not found!');
            return;
        }
        
        console.log(`\n✅ Grocery Category: ID ${grocery.category_id}`);
        
        // 3. Check products in grocery category
        console.log(`\n🛒 Products in Grocery Category (ID: ${grocery.category_id}):`);
        const productsResponse = await axios.get(`${API_BASE}/product?category_id=${grocery.category_id}`);
        const products = productsResponse.data.data;
        
        if (products.length === 0) {
            console.log('❌ No products found in grocery category!');
            console.log('💡 You need to run the SQL queries to add grocery products.');
        } else {
            console.log(`✅ Found ${products.length} products:`);
            products.forEach((product, index) => {
                console.log(`  ${index + 1}. ${product.product_name} - ₹${product.price}`);
                console.log(`     Image: ${product.main_image_url ? '✅' : '❌ Missing'}`);
            });
        }
        
        // 4. Check if products are actually grocery items
        const nonGroceryProducts = products.filter(p => 
            !p.product_name.toLowerCase().includes('apple') &&
            !p.product_name.toLowerCase().includes('banana') &&
            !p.product_name.toLowerCase().includes('milk') &&
            !p.product_name.toLowerCase().includes('bread') &&
            !p.product_name.toLowerCase().includes('rice') &&
            !p.product_name.toLowerCase().includes('egg')
        );
        
        if (nonGroceryProducts.length > 0) {
            console.log(`\n⚠️  Found ${nonGroceryProducts.length} non-grocery products in grocery category:`);
            nonGroceryProducts.forEach(p => {
                console.log(`  - ${p.product_name}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

debugGroceryProducts();
