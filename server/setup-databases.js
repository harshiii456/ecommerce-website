// Database setup script to create separate databases
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function setupDatabases() {
  try {
    console.log('🔧 Setting up databases...');
    
    // Connect to MySQL server (without specifying database)
    const connection = await mysql.createConnection({
      host: process.env.HOST || 'localhost',
      user: process.env.USER || 'root',
      password: process.env.PASS || ''
    });

    console.log('✅ Connected to MySQL server');

    // Create databases if they don't exist
    const databases = [
      process.env.NAME || 'ecommerce',           // Main database
      process.env.ADMIN_DB_NAME || 'ecommerce_admin', // Admin database
      process.env.USER_DB_NAME || 'ecommerce_users'   // User database
    ];

    for (const db of databases) {
      try {
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`✅ Database '${db}' created or already exists`);
      } catch (error) {
        console.error(`❌ Error creating database '${db}':`, error.message);
      }
    }

    // Show all databases
    const [databasesList] = await connection.execute('SHOW DATABASES');
    console.log('\n📋 Available databases:');
    databasesList.forEach(db => {
      if (db.Database !== 'information_schema' && db.Database !== 'mysql' && db.Database !== 'performance_schema' && db.Database !== 'sys') {
        console.log(`   - ${db.Database}`);
      }
    });

    await connection.end();
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update your .env file with database names:');
    console.log(`      NAME=${process.env.NAME || 'ecommerce'}`);
    console.log(`      ADMIN_DB_NAME=${process.env.ADMIN_DB_NAME || 'ecommerce_admin'}`);
    console.log(`      USER_DB_NAME=${process.env.USER_DB_NAME || 'ecommerce_users'}`);
    console.log('   2. Restart your server');
    console.log('   3. The server will create the tables automatically');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  }
}

setupDatabases();
