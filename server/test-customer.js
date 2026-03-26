// Test customer login flow
import { User } from './database/models/User.js';
import { sequelize } from './database/models/index.js';
import bcrypt from 'bcryptjs';

async function testCustomerLogin() {
  try {
    console.log('🔧 Testing customer login flow...');
    
    const UserModel = sequelize.models.User;
    
    // Check if any customer users exist
    const customerUsers = await UserModel.findAll({
      where: { 
        role: 'customer'
      }
    });
    
    console.log(`✅ Found ${customerUsers.length} customer users`);
    
    if (customerUsers.length === 0) {
      console.log('❌ No customer users found. Creating test customer...');
      
      // Create a test customer user
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
      console.log('📧 Email: customer@test.com');
      console.log('🔑 Password: customer123');
    } else {
      console.log('✅ Customer users already exist');
      customerUsers.forEach(user => {
        console.log(`   - ${user.email_id} (${user.role})`);
      });
    }

    console.log('✅ Test completed - Try customer login with:');
    console.log('   Email: customer@test.com');
    console.log('   Password: customer123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCustomerLogin();
