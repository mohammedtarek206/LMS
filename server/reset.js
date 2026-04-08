const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Atlas for reset...');

    let admin = await User.findOne({ username: 'admin' });

    if (admin) {
      console.log('Found admin, resetting password...');
      admin.password = '123456';
      await admin.save();
    } else {
      console.log('Admin not found, creating new admin...');
      await User.create({
        name: 'DR. HANY KHATAB',
        username: 'admin',
        password: '123456',
        role: 'Admin'
      });

    }

    console.log('Admin password reset to: 123456');
    process.exit();
  } catch (error) {
    console.error('Reset failed:', error);
    process.exit(1);
  }
};

resetAdmin();
