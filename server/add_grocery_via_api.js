import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

// First, let's create the grocery category
const createGroceryCategory = async () => {
    try {
        console.log('Creating grocery category...');
        
        // You'll need to provide admin credentials
        const adminLogin = await axios.post(`${API_BASE}/user/login`, {
            email_id: 'admin@example.com', // Replace with actual admin email
            password: 'admin123' // Replace with actual admin password
        });
        
        const token = adminLogin.data.data.accessToken;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        // Create grocery category
        const categoryResponse = await axios.post(`${API_BASE}/category/admin`, {
            category_name: 'Grocery'
        }, { headers });
        
        console.log('Grocery category created:', categoryResponse.data.data.category_id);
        return categoryResponse.data.data.category_id;
        
    } catch (error) {
        console.error('Error creating category:', error.response?.data || error.message);
        throw error;
    }
};

// Add grocery products
const addGroceryProducts = async (categoryId) => {
    try {
        console.log('Adding grocery products...');
        
        // Login again to get fresh token
        const adminLogin = await axios.post(`${API_BASE}/user/login`, {
            email_id: 'admin@example.com', // Replace with actual admin email
            password: 'admin123' // Replace with actual admin password
        });
        
        const token = adminLogin.data.data.accessToken;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        const groceryProducts = [
            // Fruits & Vegetables
            {
                product_name: "Fresh Apples",
                category_id: categoryId,
                description: "Crisp and sweet red apples, perfect for snacking or baking.",
                price: 120,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Organic Bananas",
                category_id: categoryId,
                description: "Ripe organic bananas, rich in potassium and natural sweetness.",
                price: 60,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1543286986-2eeaea38f5be?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Fresh Tomatoes",
                category_id: categoryId,
                description: "Juicy red tomatoes, perfect for salads and cooking.",
                price: 80,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1546470427-e93b1c429b19?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Organic Spinach",
                category_id: categoryId,
                description: "Fresh organic spinach, rich in iron and vitamins.",
                price: 40,
                stock_quantity: 60,
                main_image_url: "https://images.unsplash.com/photo-1574233323939-0c05321ed5a9?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Fresh Carrots",
                category_id: categoryId,
                description: "Crunchy orange carrots, great for salads and cooking.",
                price: 50,
                stock_quantity: 90,
                main_image_url: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&q=80&w=400"
            },
            
            // Dairy & Eggs
            {
                product_name: "Fresh Milk",
                category_id: categoryId,
                description: "Pure and fresh whole milk, 1 liter pack.",
                price: 55,
                stock_quantity: 200,
                main_image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Greek Yogurt",
                category_id: categoryId,
                description: "Creamy Greek yogurt, high in protein.",
                price: 80,
                stock_quantity: 120,
                main_image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Farm Fresh Eggs",
                category_id: categoryId,
                description: "Free-range eggs, pack of 12.",
                price: 120,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1518569656558-1f25e69edd93?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Cheddar Cheese",
                category_id: categoryId,
                description: "Aged cheddar cheese, rich and flavorful.",
                price: 200,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1486477181946-6428a0291777?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Butter",
                category_id: categoryId,
                description: "Pure unsalted butter, 500g pack.",
                price: 150,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1586201375761-83865002e8c5?auto=format&fit=crop&q=80&w=400"
            },
            
            // Grains & Cereals
            {
                product_name: "Basmati Rice",
                category_id: categoryId,
                description: "Premium quality basmati rice, 5kg pack.",
                price: 350,
                stock_quantity: 120,
                main_image_url: "https://images.unsplash.com/photo-1536304078424-3e1a8c5dc33c?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Whole Wheat Bread",
                category_id: categoryId,
                description: "Fresh whole wheat bread, daily baked.",
                price: 45,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Oats",
                category_id: categoryId,
                description: "Rolled oats, perfect for healthy breakfast.",
                price: 180,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Pasta",
                category_id: categoryId,
                description: "Italian pasta, al dente perfection.",
                price: 90,
                stock_quantity: 140,
                main_image_url: "https://images.unsplash.com/photo-1528645652321-e1e895a5bb8a?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Quinoa",
                category_id: categoryId,
                description: "Organic quinoa, superfood grain.",
                price: 280,
                stock_quantity: 90,
                main_image_url: "https://images.unsplash.com/photo-1544484959-80ea005bee46?auto=format&fit=crop&q=80&w=400"
            },
            
            // Beverages
            {
                product_name: "Orange Juice",
                category_id: categoryId,
                description: "100% fresh orange juice, no additives.",
                price: 120,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Green Tea",
                category_id: categoryId,
                description: "Premium green tea leaves, antioxidant rich.",
                price: 200,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1576092768247-dc3b8ec5c5a7?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Coffee Beans",
                category_id: categoryId,
                description: "Premium arabica coffee beans, medium roast.",
                price: 450,
                stock_quantity: 60,
                main_image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Mineral Water",
                category_id: categoryId,
                description: "Pure mineral water, pack of 12 bottles.",
                price: 60,
                stock_quantity: 200,
                main_image_url: "https://images.unsplash.com/photo-1548839148-1a0b5d5e5d71?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Coconut Water",
                category_id: categoryId,
                description: "Natural coconut water, refreshing and healthy.",
                price: 80,
                stock_quantity: 120,
                main_image_url: "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?auto=format&fit=crop&q=80&w=400"
            },
            
            // Snacks & Spices
            {
                product_name: "Mixed Nuts",
                category_id: categoryId,
                description: "Premium mixed nuts, healthy snack pack.",
                price: 350,
                stock_quantity: 80,
                main_image_url: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb3?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Dark Chocolate",
                category_id: categoryId,
                description: "70% dark chocolate, antioxidant rich.",
                price: 180,
                stock_quantity: 100,
                main_image_url: "https://images.unsplash.com/photo-1548701934-344f0e3efe1c?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Honey",
                category_id: categoryId,
                description: "Pure organic honey, 500g jar.",
                price: 250,
                stock_quantity: 70,
                main_image_url: "https://images.unsplash.com/photo-1558800745-6e78d6f4e6d7?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Olive Oil",
                category_id: categoryId,
                description: "Extra virgin olive oil, cold pressed.",
                price: 420,
                stock_quantity: 60,
                main_image_url: "https://images.unsplash.com/photo-1478369402113-1fd53f17e8b4?auto=format&fit=crop&q=80&w=400"
            },
            {
                product_name: "Sea Salt",
                category_id: categoryId,
                description: "Natural sea salt, fine crystals.",
                price: 80,
                stock_quantity: 150,
                main_image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400"
            }
        ];
        
        let successCount = 0;
        for (const product of groceryProducts) {
            try {
                const response = await axios.post(`${API_BASE}/product/admin`, product, { headers });
                console.log(`✅ Created: ${product.product_name}`);
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to create ${product.product_name}:`, error.response?.data || error.message);
            }
        }
        
        console.log(`\n🎉 SUCCESS: ${successCount}/${groceryProducts.length} grocery products added!`);
        console.log('Grocery category and products have been successfully added to the database.');
        
    } catch (error) {
        console.error('Error adding products:', error.response?.data || error.message);
        throw error;
    }
};

// Main execution
const main = async () => {
    try {
        console.log('🌱 Adding Grocery Products to RShop...\n');
        
        // First create the category
        const categoryId = await createGroceryCategory();
        
        // Then add all products
        await addGroceryProducts(categoryId);
        
        console.log('\n✅ All done! Grocery section is now ready.');
        
    } catch (error) {
        console.error('\n❌ Process failed:', error.message);
        console.log('\n💡 Make sure:');
        console.log('1. Server is running on localhost:8000');
        console.log('2. Update admin credentials in the script');
        console.log('3. Admin user exists in the database');
    }
};

main();
