// Create admin user script
import { User } from './database/models/User.js';
import { sequelize } from './database/models/index.js';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync();
    console.log('✅ Models synced');
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({
      where: { email_id: 'admin@gmail.com' }
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = await User.create({
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

    await sequelize.close();
    console.log('✅ Done');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();
