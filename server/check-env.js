import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

console.log('=== ENVIRONMENT VARIABLES CHECK ===');
console.log('NAME:', process.env.NAME || 'MISSING');
console.log('USER:', process.env.USER || 'MISSING');
console.log('PASS:', process.env.PASS ? 'EXISTS' : 'MISSING');
console.log('HOST:', process.env.HOST || 'MISSING');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID?.substring(0, 8) + '...' || 'MISSING');
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'EXISTS' : 'MISSING');
