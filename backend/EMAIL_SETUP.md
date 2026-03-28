# Email OTP Setup Guide

## Environment Variables Required

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/xlense-analytics

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration for OTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
```

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Navigate to Security
- Enable 2-Step Verification

### 2. Generate App Password
- Go to Security > 2-Step Verification
- Scroll down to "App passwords"
- Select "Mail" and "Other (Custom name)"
- Enter a name like "Xlense Analytics"
- Copy the generated 16-character password

### 3. Use App Password
- Set `EMAIL_USER` to your Gmail address
- Set `EMAIL_PASS` to the generated app password (not your regular Gmail password)

## API Endpoints

### 1. Send OTP
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
```

### 2. Verify OTP and Reset Password
```
POST /api/auth/verify-otp
Body: { 
  "email": "user@example.com", 
  "otp": "123456", 
  "newPassword": "newpassword123" 
}
```

### 3. Resend OTP
```
POST /api/auth/resend-otp
Body: { "email": "user@example.com" }
```

## Features

- ✅ 6-digit OTP generation
- ✅ 10-minute OTP expiration
- ✅ Professional HTML email templates
- ✅ Secure password reset flow
- ✅ OTP resend functionality
- ✅ Input validation and error handling

## Security Features

- OTP expires after 10 minutes
- OTP is cleared after successful password reset
- Email validation before sending OTP
- Secure password hashing maintained
- Input sanitization and validation
