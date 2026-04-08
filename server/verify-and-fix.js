const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');

dotenv.config();

const run = async () => {
  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, 
    });
    console.log('CONNECTED successfully.');

    const adminUsername = 'admin';
    const adminPassword = '123456';

    console.log(`Checking for user: ${adminUsername}`);
    let user = await User.findOne({ username: adminUsername });

    if (user) {
      console.log('Admin found. Resetting password...');
      // Re-hashing is handled by pre-save hook in User model
      user.password = adminPassword;
      await user.save();
      console.log('Password updated.');
    } else {
      console.log('Admin NOT found. Creating new admin user...');
      await User.create({
        name: 'المدير العام',
        username: adminUsername,
        password: adminPassword,
        role: 'Admin'
      });
      console.log('Admin created.');
    }

    // Final verification test
    const verifyUser = await User.findOne({ username: adminUsername });
    const isMatch = await verifyUser.matchPassword(adminPassword);
    console.log(`Verification - Password Match: ${isMatch}`);

    if (isMatch) {
      console.log('SUCCESS: Credentials are now admin / 123456');
    } else {
      console.log('FAILURE: Password verification failed after update.');
    }

    process.exit(0);
  } catch (err) {
    console.error('CRITICAL ERROR:', err.message);
    process.exit(1);
  }
};

run();
