// Test admin login with new database structure
import { AdminUser } from './database/models/admin-models.js';
import { adminSequelize } from './database/admin-database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function testAdminLogin() {
  try {
    console.log('🔧 Testing admin login with new database structure...');
    
    // Check if admin user exists
    const adminUser = await AdminUser.findOne({
      where: { email_id: 'admin@ecommerce.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Creating...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = await AdminUser.create({
        admin_first_name: 'Super',
        admin_last_name: 'Admin',
        email_id: 'admin@ecommerce.com',
        password: hashedPassword,
        role: 'super_admin',
        permissions: {
          users: ['read', 'write', 'delete'],
          products: ['read', 'write', 'delete'],
          orders: ['read', 'write', 'delete'],
          categories: ['read', 'write', 'delete']
        }
      });

      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user found!');
    }

    // Test login
    const testUser = await AdminUser.findOne({
      where: { email_id: 'admin@ecommerce.com' }
    });

    if (testUser) {
      const isPasswordValid = await bcrypt.compare('admin123', testUser.password);
      
      if (isPasswordValid) {
        const token = jwt.sign(
          { 
            id: testUser.admin_id, 
            role: 'admin',
            permissions: testUser.permissions 
          },
          process.env.ACCESS_TOKEN_SECRET || 'test-secret',
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1d' }
        );

        console.log('✅ Admin login test successful!');
        console.log('🔑 Token:', token);
      } else {
        console.log('❌ Password verification failed');
      }
    }

    await adminSequelize.close();
    console.log('✅ Test completed');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminLogin();
