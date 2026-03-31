import { sequelize, models } from "./database/models/index.js";

const { Product } = models;

const fashionProducts = [
  {
    product_name: "Women's Summer Floral Dress",
    price: 45.99,
    discount_price: 35.99,
    description: "Beautiful floral print summer dress made from lightweight cotton blend. Perfect for casual outings and beach vacations.",
    main_image_url: "https://images.unsplash.com/photo-1572804013427-37d680098f2b?w=400&h=500&fit=crop",
    rating: 4.5,
    stock_quantity: 25,
    category_id: 8
  },
  {
    product_name: "Men's Casual Cotton T-Shirt",
    price: 25.99,
    discount_price: 19.99,
    description: "Comfortable cotton t-shirt for everyday wear. Available in multiple colors and sizes.",
    main_image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    rating: 4.3,
    stock_quantity: 50,
    category_id: 8
  },
  {
    product_name: "Women's Elegant Evening Gown",
    price: 129.99,
    discount_price: 99.99,
    description: "Stunning evening gown perfect for formal events and special occasions. Made from premium silk fabric.",
    main_image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    rating: 4.8,
    stock_quantity: 15,
    category_id: 8
  },
  {
    product_name: "Men's Business Suit",
    price: 299.99,
    discount_price: 249.99,
    description: "Professional business suit with modern fit. Includes jacket and trousers. Perfect for office and meetings.",
    main_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    rating: 4.6,
    stock_quantity: 20,
    category_id: 8
  },
  {
    product_name: "Women's Denim Jeans",
    price: 59.99,
    discount_price: 44.99,
    description: "Classic denim jeans with comfortable fit. Durable and stylish for everyday wear.",
    main_image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    rating: 4.4,
    stock_quantity: 40,
    category_id: 8
  },
  {
    product_name: "Men's Leather Jacket",
    price: 189.99,
    discount_price: 149.99,
    description: "Genuine leather jacket with modern design. Warm and stylish for cold weather.",
    main_image_url: "https://images.unsplash.com/photo-1551488831-00ddbc298a1a?w=400&h=500&fit=crop",
    rating: 4.7,
    stock_quantity: 18,
    category_id: 8
  },
  {
    product_name: "Women's Summer Maxi Dress",
    price: 55.99,
    discount_price: 42.99,
    description: "Flowing maxi dress perfect for summer. Lightweight and comfortable with beautiful patterns.",
    main_image_url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
    rating: 4.5,
    stock_quantity: 30,
    category_id: 8
  },
  {
    product_name: "Men's Polo Shirt",
    price: 35.99,
    discount_price: 28.99,
    description: "Classic polo shirt for casual and semi-formal occasions. Made from breathable cotton.",
    main_image_url: "https://images.unsplash.com/photo-1621079499456-28814607496e?w=400&h=500&fit=crop",
    rating: 4.2,
    stock_quantity: 35,
    category_id: 8
  },
  {
    product_name: "Women's Handbag",
    price: 79.99,
    discount_price: 59.99,
    description: "Stylish leather handbag with multiple compartments. Perfect for daily use and special occasions.",
    main_image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
    rating: 4.6,
    stock_quantity: 22,
    category_id: 8
  },
  {
    product_name: "Men's Casual Shorts",
    price: 29.99,
    discount_price: 22.99,
    description: "Comfortable cotton shorts for summer and casual wear. Available in various colors.",
    main_image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    rating: 4.3,
    stock_quantity: 45,
    category_id: 8
  },
  {
    product_name: "Women's Sneakers",
    price: 69.99,
    discount_price: 49.99,
    description: "Comfortable and stylish sneakers perfect for daily wear and light exercise.",
    main_image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    rating: 4.4,
    stock_quantity: 28,
    category_id: 8
  },
  {
    product_name: "Men's Formal Shoes",
    price: 89.99,
    discount_price: 69.99,
    description: "Elegant formal shoes for business meetings and special occasions. Made from genuine leather.",
    main_image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    rating: 4.5,
    stock_quantity: 20,
    category_id: 8
  },
  {
    product_name: "Women's Blouse",
    price: 39.99,
    discount_price: 29.99,
    description: "Elegant blouse suitable for office and casual wear. Made from premium fabric.",
    main_image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    rating: 4.3,
    stock_quantity: 32,
    category_id: 8
  },
  {
    product_name: "Men's Hoodie",
    price: 49.99,
    discount_price: 37.99,
    description: "Comfortable hoodie perfect for casual wear and cold weather. Made from soft cotton blend.",
    main_image_url: "https://images.unsplash.com/photo-1556821840-1a9b972c3f1c?w=400&h=500&fit=crop",
    rating: 4.5,
    stock_quantity: 38,
    category_id: 8
  },
  {
    product_name: "Women's Skirt",
    price: 34.99,
    discount_price: 24.99,
    description: "Stylish skirt perfect for casual and semi-formal occasions. Available in various lengths.",
    main_image_url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
    rating: 4.2,
    stock_quantity: 25,
    category_id: 8
  }
];

async function addFashionProducts() {
  try {
    console.log("=== ADDING FASHION PRODUCTS ===");
    
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    for (const product of fashionProducts) {
      try {
        const existingProduct = await Product.findOne({
          where: { 
            product_name: product.product_name,
            category_id: product.category_id 
          }
        });

        if (!existingProduct) {
          await Product.create(product);
          console.log(`✅ Added: ${product.product_name}`);
        } else {
          console.log(`⚠️  Already exists: ${product.product_name}`);
        }
      } catch (error) {
        console.error(`❌ Error adding ${product.product_name}:`, error.message);
      }
    }

    console.log("=== FASHION PRODUCTS ADDED SUCCESSFULLY ===");
  } catch (error) {
    console.error("❌ Database error:", error);
  } finally {
    await sequelize.close();
  }
}

addFashionProducts();
