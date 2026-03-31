import { sequelize, models } from "./database/models/index.js";

const { User, Category, Product, Order, OrderItem, Cart, CartItem, Wishlist, Review, OTPVerification } = models;

async function setupCompleteDatabase() {
  try {
    console.log("=== SETTING UP COMPLETE MYSQL DATABASE ===");
    
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // 1. Check if tables exist
    console.log("\n📋 CHECKING TABLES...");
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log("Existing tables:", tables);

    // 2. Sync all tables (create if not exists)
    console.log("\n🔄 SYNCING TABLES...");
    await sequelize.sync({ alter: true });
    console.log("✅ All tables synced successfully!");

    // 3. Check and create categories if needed
    console.log("\n📂 CHECKING CATEGORIES...");
    const categories = await Category.findAll();
    console.log(`Found ${categories.length} categories:`);
    
    if (categories.length === 0) {
      console.log("Creating default categories...");
      const defaultCategories = [
        { category_name: "Fashion" },
        { category_name: "Electronics" },
        { category_name: "Grocery" },
        { category_name: "Home & Garden" },
        { category_name: "Sports" },
        { category_name: "Books" }
      ];
      
      for (const cat of defaultCategories) {
        await Category.create(cat);
        console.log(`✅ Created category: ${cat.category_name}`);
      }
    } else {
      categories.forEach(cat => {
        console.log(`- ${cat.category_name} (ID: ${cat.category_id})`);
      });
    }

    // 4. Check and create users if needed
    console.log("\n👥 CHECKING USERS...");
    const users = await User.findAll();
    console.log(`Found ${users.length} users:`);
    
    if (users.length === 0) {
      console.log("Creating test users...");
      const bcrypt = require("bcryptjs");
      
      const testUsers = [
        {
          user_role_id: 1,
          email_id: "customer@example.com",
          password: await bcrypt.hash("password123", 10),
          user_first_name: "Test",
          user_last_name: "Customer",
          mobile_number: "9876543210",
          user_status: 1,
          role: 'customer'
        },
        {
          user_role_id: 2,
          email_id: "admin@example.com",
          password: await bcrypt.hash("admin123", 10),
          user_first_name: "Admin",
          user_last_name: "User",
          mobile_number: "9876543211",
          user_status: 1,
          role: 'admin'
        }
      ];
      
      for (const user of testUsers) {
        await User.create(user);
        console.log(`✅ Created user: ${user.email_id} (${user.role})`);
      }
    } else {
      users.forEach(user => {
        console.log(`- ${user.email_id} (${user.role})`);
      });
    }

    // 5. Check products
    console.log("\n🛍️ CHECKING PRODUCTS...");
    const products = await Product.findAll();
    console.log(`Found ${products.length} products:`);
    
    if (products.length === 0) {
      console.log("Creating sample products...");
      
      const fashionCategory = await Category.findOne({ where: { category_name: "Fashion" } });
      const electronicsCategory = await Category.findOne({ where: { category_name: "Electronics" } });
      
      const sampleProducts = [
        {
          product_name: "Women's Summer Dress",
          description: "Beautiful summer dress for women",
          price: "45.99",
          discount_price: "35.99",
          stock_quantity: 50,
          category_id: fashionCategory.category_id,
          is_active: 1,
          main_image_url: "https://images.unsplash.com/photo-1572804013427-37d680098f2b?w=400&h=500&fit=crop"
        },
        {
          product_name: "Men's T-Shirt",
          description: "Comfortable cotton t-shirt",
          price: "25.99",
          discount_price: "19.99",
          stock_quantity: 100,
          category_id: fashionCategory.category_id,
          is_active: 1,
          main_image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"
        },
        {
          product_name: "Smartphone",
          description: "Latest smartphone with amazing features",
          price: "699.99",
          discount_price: "599.99",
          stock_quantity: 30,
          category_id: electronicsCategory.category_id,
          is_active: 1,
          main_image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=500&fit=crop"
        }
      ];
      
      for (const product of sampleProducts) {
        await Product.create(product);
        console.log(`✅ Created product: ${product.product_name}`);
      }
    } else {
      products.slice(0, 5).forEach(product => {
        console.log(`- ${product.product_name} ($${product.price})`);
      });
      if (products.length > 5) {
        console.log(`... and ${products.length - 5} more products`);
      }
    }

    // 6. Summary
    console.log("\n📊 DATABASE SUMMARY:");
    console.log(`- Categories: ${(await Category.findAll()).length}`);
    console.log(`- Users: ${(await User.findAll()).length}`);
    console.log(`- Products: ${(await Product.findAll()).length}`);
    console.log(`- Orders: ${(await Order.findAll()).length}`);
    console.log(`- Cart Items: ${(await CartItem.findAll()).length}`);

    console.log("\n🎉 COMPLETE DATABASE SETUP SUCCESSFUL!");
    console.log("\n🔑 LOGIN CREDENTIALS:");
    console.log("Customer: customer@example.com / password123");
    console.log("Admin: admin@example.com / admin123");

  } catch (error) {
    console.error("❌ Error setting up database:", error);
  } finally {
    await sequelize.close();
  }
}

setupCompleteDatabase();
