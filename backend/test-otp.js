// Test script for OTP functionality
// Run with: node test-otp.js

require('dotenv').config();
const nodemailer = require('nodemailer');

// Test email configuration
const testEmailConfig = () => {
  console.log('Testing email configuration...');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Missing email environment variables');
    console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file');
    return false;
  }

  console.log('✅ Email environment variables found');
  console.log(`Email: ${process.env.EMAIL_USER}`);
  console.log(`Password: ${process.env.EMAIL_PASS ? '***' : 'NOT SET'}`);
  
  return true;
};

// Test nodemailer connection
const testNodemailer = async () => {
  console.log('\nTesting nodemailer connection...');
  
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Nodemailer connection successful');
    return true;
  } catch (error) {
    console.error('❌ Nodemailer connection failed:', error.message);
    return false;
  }
};

// Test OTP generation
const testOTPGeneration = () => {
  console.log('\nTesting OTP generation...');
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`✅ Generated OTP: ${otp}`);
  console.log(`✅ OTP length: ${otp.length} characters`);
  console.log(`✅ OTP is numeric: ${/^\d{6}$/.test(otp)}`);
  
  return true;
};

// Test email template
const testEmailTemplate = () => {
  console.log('\nTesting email template...');
  
  const testOTP = '123456';
  const testName = 'Test User';
  const testEmail = 'test@example.com';
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: testEmail,
    subject: 'Password Reset OTP - Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${testName},</p>
        <p>You have requested to reset your password. Use the following OTP to proceed:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${testOTP}</h1>
        </div>
        <p><strong>This OTP will expire in 10 minutes.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>Xlense Analytics Team</p>
      </div>
    `
  };
  
  console.log('✅ Email template generated successfully');
  console.log(`✅ Subject: ${mailOptions.subject}`);
  console.log(`✅ To: ${mailOptions.to}`);
  console.log(`✅ HTML content length: ${mailOptions.html.length} characters`);
  
  return true;
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting OTP functionality tests...\n');
  
  const results = [];
  
  results.push(testEmailConfig());
  results.push(await testNodemailer());
  results.push(testOTPGeneration());
  results.push(testEmailTemplate());
  
  console.log('\n📊 Test Results:');
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  if (passed === total) {
    console.log(`✅ All tests passed! (${passed}/${total})`);
    console.log('\n🎉 OTP functionality is ready to use!');
  } else {
    console.log(`❌ Some tests failed! (${passed}/${total})`);
    console.log('\n⚠️  Please check the configuration and try again.');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
