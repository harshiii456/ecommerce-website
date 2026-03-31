import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

// First create grocery category
const createGroceryCategory = async () => {
    try {
        console.log('📂 Creating grocery category...');
        
        // Create category directly (no auth needed for this)
        const categoryResponse = await axios.post(`${API_BASE}/category/admin`, {
            category_name: 'Grocery'
        });
        
        console.log('✅ Grocery category created:', categoryResponse.data.data.category_id);
        return categoryResponse.data.data.category_id;
        
    } catch (error) {
        console.log('⚠️ Category might already exist, checking...');
        // Try to get existing category
        try {
            const categories = await axios.get(`${API_BASE}/category`);
            const grocery = categories.data.data.find(cat => cat.category_name === 'Grocery');
            if (grocery) {
                console.log('✅ Found existing grocery category:', grocery.category_id);
                return grocery.category_id;
            }
        } catch (err) {
            console.error('Error finding category:', err.message);
        }
        throw error;
    }
};

// Add grocery products
const addGroceryProducts = async (categoryId) => {
    try {
        console.log('🛒 Adding grocery products...');
        
        const groceryProducts = [
            {
                product_name: "Fresh Apples",
                category_id: categoryId,
                description: "Crisp and sweet red apples, perfect for snacking or baking.",
                price: 120,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&q=80&w=400",
                discount_price: 100
            },
            {
                product_name: "Organic Bananas",
                category_id: categoryId,
                description: "Ripe organic bananas, rich in potassium and natural sweetness.",
                price: 60,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1543286986-2eeaea38f5be?auto=format&fit=crop&q=80&w=400",
                discount_price: 50
            },
            {
                product_name: "Fresh Tomatoes",
                category_id: categoryId,
                description: "Juicy red tomatoes, perfect for salads and cooking.",
                price: 80,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1546470427-e93b1c429b19?auto=format&fit=crop&q=80&w=400",
                discount_price: 70
            },
            {
                product_name: "Organic Spinach",
                category_id: categoryId,
                description: "Fresh organic spinach, rich in iron and vitamins.",
                price: 40,
                stock_quantity: 60,
                main_image_url: "https://images.unsplash.com/photo-1574233323939-0c05321ed5a9?auto=format&fit=crop&q=80&w=400",
                discount_price: 35
            },
            {
                product_name: "Fresh Carrots",
                category_id: categoryId,
                description: "Crunchy orange carrots, great for salads and cooking.",
                price: 50,
                stock_quantity: 90,
                main_image_url: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&q=80&w=400",
                discount_price: 45
            },
            {
                product_name: "Fresh Milk",
                category_id: categoryId,
                description: "Pure and fresh whole milk, 1 liter pack.",
                price: 55,
                stock_quantity: 200,
                main_image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400",
                discount_price: 50
            },
            {
                product_name: "Greek Yogurt",
                category_id: categoryId,
                description: "Creamy Greek yogurt, high in protein.",
                price: 80,
                stock_quantity: 120,
                main_image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
                discount_price: 70
            },
            {
                product_name: "Farm Fresh Eggs",
                category_id: categoryId,
                description: "Free-range eggs, pack of 12.",
                price: 120,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1518569656558-1f25e69edd93?auto=format&fit=crop&q=80&w=400",
                discount_price: 110
            },
            {
                product_name: "Cheddar Cheese",
                category_id: categoryId,
                description: "Aged cheddar cheese, rich and flavorful.",
                price: 200,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1486477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
                discount_price: 180
            },
            {
                product_name: "Butter",
                category_id: categoryId,
                description: "Pure unsalted butter, 500g pack.",
                price: 150,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1586201375761-83865002e8c5?auto=format&fit=crop&q=80&w=400",
                discount_price: 140
            }
        ];
        
        let successCount = 0;
        for (const product of groceryProducts) {
            try {
                const response = await axios.post(`${API_BASE}/product/admin`, product);
                console.log(`✅ Created: ${product.product_name}`);
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to create ${product.product_name}:`, error.response?.data?.message || error.message);
            }
        }
        
        console.log(`\n🎉 SUCCESS: ${successCount}/${groceryProducts.length} grocery products added!`);
        console.log('🛒 Grocery section is now ready with products and images!');
        
    } catch (error) {
        console.error('Error adding products:', error.response?.data || error.message);
        throw error;
    }
};

// Main execution
const main = async () => {
    try {
        console.log('🌱 Adding Grocery Products to RShop...\n');
        
        // First create/get category
        const categoryId = await createGroceryCategory();
        
        // Then add products
        await addGroceryProducts(categoryId);
        
        console.log('\n✅ Done! Refresh your website to see grocery products.');
        
    } catch (error) {
        console.error('\n❌ Process failed:', error.message);
        console.log('\n💡 Make sure server is running on localhost:8000');
    }
};

main();
