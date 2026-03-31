import { sequelize, models } from "./database/models/index.js";

const { User } = models;

async function createTestUsers() {
  try {
    console.log("=== CREATING TEST USERS ===");
    
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // Check existing users
    const existingUsers = await User.findAll();
    console.log(`📊 Existing users: ${existingUsers.length}`);

    if (existingUsers.length === 0) {
      // Create test users
      const testUsers = [
        {
          user_role_id: 1,
          email_id: "john.doe@example.com",
          password: "password123",
          user_first_name: "John",
          user_last_name: "Doe",
          mobile_number: "9876543210",
          user_status: 1,
          role: 'customer'
        },
        {
          user_role_id: 1,
          email_id: "jane.smith@example.com",
          password: "password123",
          user_first_name: "Jane",
          user_last_name: "Smith",
          mobile_number: "9876543211",
          user_status: 1,
          role: 'customer'
        },
        {
          user_role_id: 2,
          email_id: "admin@test.com",
          password: "admin123",
          user_first_name: "Admin",
          user_last_name: "User",
          mobile_number: "9876543212",
          user_status: 1,
          role: 'admin'
        }
      ];

      for (const userData of testUsers) {
        try {
          const user = await User.create(userData);
          console.log(`✅ Created user: ${user.email_id} (${user.role})`);
        } catch (error) {
          console.error(`❌ Error creating user ${userData.email_id}:`, error.message);
        }
      }
    } else {
      console.log("📋 Existing users:");
      existingUsers.forEach(user => {
        console.log(`- ${user.email_id} (${user.role})`);
      });
    }

    console.log("=== TEST USERS CREATED SUCCESSFULLY ===");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

createTestUsers();
