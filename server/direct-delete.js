// Direct database deletion script
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function deleteAllUsers() {
  try {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.HOST || 'localhost',
      user: process.env.USER || 'root',
      password: process.env.PASS || '',
      database: process.env.NAME || 'ecommerce'
    });

    console.log('Deleting all users...');
    const [result] = await connection.execute('DELETE FROM user_master');
    console.log(`✅ Deleted ${result.affectedRows} users successfully!`);

    // Reset auto-increment
    await connection.execute('ALTER TABLE user_master AUTO_INCREMENT = 1');
    console.log('✅ Auto-increment reset to 1');

    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deleteAllUsers();
