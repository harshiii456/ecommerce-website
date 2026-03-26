// Add temporary endpoint to create customer user
import { User } from './database/models/User.js';
import { sequelize } from './database/models/index.js';
import bcrypt from 'bcryptjs';
import { ApiResponse } from './utils/ApiResponse.js';
import { asyncHandler } from './utils/asyncHandler.js';

const createTestCustomer = asyncHandler(async (req, res, next) => {
  try {
    console.log('🔧 Creating test customer user...');
    
    const UserModel = sequelize.models.User;
    
    // Check if customer user already exists
    const existingCustomer = await UserModel.findOne({
      where: { email_id: 'customer@test.com' }
    });
    
    if (existingCustomer) {
      return res.status(400).json(new ApiResponse(400, null, "Customer user already exists"));
    }
    
    // Create test customer user
    const hashedPassword = await bcrypt.hash('customer123', 10);
    const testCustomer = await UserModel.create({
      user_first_name: 'Test',
      user_last_name: 'Customer',
      email_id: 'customer@test.com',
      password: hashedPassword,
      mobile_number: '9876543210',
      role: 'customer'
    });
    
    console.log('✅ Test customer created successfully!');
    
    return res.status(201).json(new ApiResponse(201, {
      email: 'customer@test.com',
      password: 'customer123'
    }, "Test customer created successfully"));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json(new ApiResponse(500, null, "Error creating customer"));
  }
});

export { createTestCustomer };
