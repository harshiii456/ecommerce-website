import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function getOTP() {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.NAME,
  });

  try {
    const [rows] = await connection.execute(
      'SELECT otp_code FROM otp_verification ORDER BY created_at DESC LIMIT 1'
    );
    if (rows.length > 0) {
      console.log('LATEST_OTP:', rows[0].otp_code);
    } else {
      console.log('No OTP found');
    }
  } catch (error) {
    console.error('Error fetching OTP:', error);
  } finally {
    await connection.end();
  }
}

getOTP();
