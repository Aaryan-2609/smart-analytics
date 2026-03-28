const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const makeAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set. Ensure backend/.env has MONGO_URI and JWT_SECRET');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Default admin credentials
    const defaultAdmin = {
      email: 'aaryankamdar7999@gmail.com',
      password: 'Aaryan@12345',
      role: 'Admin'
    };

    // Use email from command line or default
    const userEmail = process.argv[2] || defaultAdmin.email;
    const userPassword = process.argv[3] || defaultAdmin.password;

    // Check if user exists
    let user = await User.findOne({ email: userEmail });

    if (user) {
      // Update existing user to admin
      user = await User.findOneAndUpdate(
        { email: userEmail },
        { role: 'Admin' },
        { new: true }
      );
      console.log(`✅ User ${userEmail} is now an admin`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      
      user = new User({
        email: userEmail,
        password: hashedPassword,
        role: 'Admin',
        name: userEmail.split('@')[0], // Default name from email
        createdAt: new Date()
      });
      
      await user.save();
      console.log(`✅ Admin user created successfully!`);
      console.log(`   Email: ${userEmail}`);
      console.log(`   Password: ${userPassword}`);
      console.log(`   Role: Admin`);
    }
    
    console.log('\n📝 You can now login with these credentials');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();