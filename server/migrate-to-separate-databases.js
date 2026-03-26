// Migration script to move data to separate databases
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function migrateData() {
  try {
    console.log('🔄 Starting migration to separate databases...');
    
    // Connect to all databases
    const mainConnection = await mysql.createConnection({
      host: process.env.HOST || 'localhost',
      user: process.env.USER || 'root',
      password: process.env.PASS || '',
      database: process.env.NAME || 'ecommerce'
    });

    const adminConnection = await mysql.createConnection({
      host: process.env.ADMIN_DB_HOST || process.env.HOST || 'localhost',
      user: process.env.ADMIN_DB_USER || process.env.USER || 'root',
      password: process.env.ADMIN_DB_PASS || process.env.PASS || '',
      database: process.env.ADMIN_DB_NAME || 'ecommerce_admin'
    });

    const userConnection = await mysql.createConnection({
      host: process.env.USER_DB_HOST || process.env.HOST || 'localhost',
      user: process.env.USER_DB_USER || process.env.USER || 'root',
      password: process.env.USER_DB_PASS || process.env.PASS || '',
      database: process.env.USER_DB_NAME || 'ecommerce_users'
    });

    console.log('✅ Connected to all databases');

    // Create admin users table
    await adminConnection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        admin_first_name VARCHAR(100),
        admin_last_name VARCHAR(100),
        email_id VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(20),
        refresh_token TEXT,
        reset_password_token VARCHAR(255),
        reset_password_expire DATE,
        role ENUM('super_admin', 'admin') DEFAULT 'admin',
        permissions JSON,
        INDEX idx_admin_email (email_id)
      )
    `);

    // Create customer users table
    await userConnection.execute(`
      CREATE TABLE IF NOT EXISTS customer_users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        user_first_name VARCHAR(100),
        user_last_name VARCHAR(100),
        email_id VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(20),
        refresh_token TEXT,
        reset_password_token VARCHAR(255),
        reset_password_expire DATE,
        role ENUM('customer') DEFAULT 'customer',
        customer_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        email_verified BOOLEAN DEFAULT FALSE,
        INDEX idx_customer_email (email_id)
      )
    `);

    console.log('✅ Created new user tables');

    // Check if there's existing data to migrate
    const [existingUsers] = await mainConnection.execute('SELECT * FROM user_master WHERE 1=0');
    
    if (existingUsers.length === 0) {
      console.log('ℹ️ No existing user data found. Creating fresh admin user...');
      
      // Create a default admin user
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await adminConnection.execute(`
        INSERT INTO admin_users (admin_first_name, admin_last_name, email_id, password, role, permissions) 
        VALUES ('Super', 'Admin', 'admin@ecommerce.com', ?, 'super_admin', ?)
      `, [
        hashedPassword,
        JSON.stringify({
          users: ['read', 'write', 'delete'],
          products: ['read', 'write', 'delete'],
          orders: ['read', 'write', 'delete'],
          categories: ['read', 'write', 'delete']
        })
      ]);
      
      console.log('✅ Created default admin user: admin@ecommerce.com / admin123');
    }

    await mainConnection.end();
    await adminConnection.end();
    await userConnection.end();

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Database Structure:');
    console.log('   📁 ecommerce (main) - Products, Orders, Categories, Reviews');
    console.log('   👤 ecommerce_admin - Admin users, Admin OTPs');
    console.log('   🛍️ ecommerce_users - Customer users, Customer OTPs');
    console.log('\n🔑 Default Admin Login:');
    console.log('   Email: admin@ecommerce.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

migrateData();
