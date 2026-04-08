const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const nuclearReset = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- Database Audit ---');
    
    const users = await User.find({}, 'username role password');
    console.log('Current Users in DB:', users.map(u => ({ username: u.username, role: u.role })));

    console.log('Deleting all existing admin users...');
    await User.deleteMany({ username: 'admin' });

    console.log('Creating fresh admin user...');
    const admin = await User.create({
      name: 'DR. HANY KHATAB',
      username: 'admin',
      password: '123456',
      role: 'Admin'
    });


    console.log('Verification: New Admin created with ID:', admin._id);
    
    // Check if password hashes correctly
    const isMatch = await admin.matchPassword('123456');
    console.log('Password Match Check (123456):', isMatch);

    console.log('CRITICAL: Reset Completed. Username: admin | Password: 123456');
    process.exit();
  } catch (error) {
    console.error('Nuclear reset failed:', error);
    process.exit(1);
  }
};

nuclearReset();
