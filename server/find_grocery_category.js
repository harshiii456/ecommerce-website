import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const findGroceryCategory = async () => {
    try {
        console.log('🔍 Finding grocery category...');
        
        const response = await axios.get(`${API_BASE}/category`);
        const categories = response.data.data;
        
        console.log('\n📂 All Categories:');
        categories.forEach(cat => {
            console.log(`  ID ${cat.category_id}: ${cat.category_name}`);
        });
        
        const grocery = categories.find(cat => cat.category_name === 'Grocery');
        
        if (grocery) {
            console.log(`\n✅ Found Grocery Category:`);
            console.log(`  ID: ${grocery.category_id}`);
            console.log(`  Name: ${grocery.category_name}`);
            console.log(`\n🌐 URL to view grocery products:`);
            console.log(`  http://localhost:5173/product-list?category_id=${grocery.category_id}`);
        } else {
            console.log('\n❌ Grocery category not found!');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
};

findGroceryCategory();
