import { ApiResponse } from "./utils/ApiResponse.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { ErrorHandler } from "./utils/ErrorHandler.js";
import { sequelize, models } from "./database/models/index.js";

const { User } = models;

const createTestCustomer = asyncHandler(async (req, res) => {
  try {
    console.log("=== CREATING TEST CUSTOMER ===");
    
    // Check if customer already exists
    const existingCustomer = await User.findOne({
      where: { email_id: "test.customer@example.com" }
    });

    if (existingCustomer) {
      return res.status(200).json(
        new ApiResponse(200, existingCustomer, "Test customer already exists")
      );
    }

    // Create test customer
    const customerData = {
      user_role_id: 1,
      email_id: "test.customer@example.com",
      password: "password123",
      user_first_name: "Test",
      user_last_name: "Customer",
      mobile_number: "9876543299",
      user_status: 1,
      role: 'customer'
    };

    const newCustomer = await User.create(customerData);
    
    // Remove password from response
    const customerResponse = { ...newCustomer.toJSON() };
    delete customerResponse.password;

    console.log("✅ Test customer created successfully");
    
    res.status(201).json(
      new ApiResponse(201, customerResponse, "Test customer created successfully")
    );
    
  } catch (error) {
    console.error("❌ Error creating test customer:", error);
    throw new ErrorHandler(500, "Failed to create test customer: " + error.message);
  }
});

export { createTestCustomer };
