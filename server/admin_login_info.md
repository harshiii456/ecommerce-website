# Admin Login Instructions

## Admin Credentials
- **Email**: admin@gmail.com
- **Password**: Use OTP verification (no password needed)

## Steps to Access Admin Users Page:

1. **Go to Login Page**: http://localhost:5173/login
2. **Enter Email**: admin@gmail.com
3. **Click "Send OTP"**
4. **Check Console for OTP** (or check email if SMTP is configured)
5. **Enter OTP** and login
6. **Go to Admin Dashboard**: http://localhost:5173/admin/dashboard
7. **Click "Manage Users"** card

## Test Users Created:
- john.doe@example.com (customer)
- jane.smith@example.com (customer)  
- admin@test.com (admin)

## API Endpoint:
- GET /api/v1/user/admin/all-users
- Requires: JWT token + Admin role
- Returns: List of all users with details
