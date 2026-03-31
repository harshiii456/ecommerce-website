import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

console.log('=== RAZORPAY ENVIRONMENT CHECK ===');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID?.substring(0, 8) + '...' || 'MISSING');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'EXISTS' : 'MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV || 'MISSING');
