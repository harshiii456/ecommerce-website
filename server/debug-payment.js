import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

console.log('=== PAYMENT DEBUG INFO ===');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID?.substring(0, 8) + '...' || 'MISSING');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'EXISTS' : 'MISSING');
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'EXISTS' : 'MISSING');
console.log('PORT:', process.env.PORT || 'MISSING');
