// Temporary admin creation using existing server connection
import { User } from './database/models/User.js';
import { sequelize } from './database/models/index.js';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    
    // Get User model from models
    const UserModel = sequelize.models.User;
    
    const existingAdmin = await UserModel.findOne({
      where: { email_id: 'admin@gmail.com' }
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
    } else {
      // Create admin user with simple password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = await UserModel.create({
        user_first_name: 'Admin',
        user_last_name: 'User',
        email_id: 'admin@gmail.com',
        password: hashedPassword,
        mobile_number: '1234567890',
        role: 'admin'
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: admin123');
    }

    console.log('✅ Done - Now login with these credentials');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();
