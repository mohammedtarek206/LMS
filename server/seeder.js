const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        name: 'DR. HANY KHATAB',
        username: 'admin',
        password: '123456',
        role: 'Admin'
      },
      {
        name: 'MAYA EL SERAFI',
        username: 'doctor',
        password: '123456',
        role: 'Doctor'
      }
    ];


    await User.create(users);

    console.log('Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // Add destroy logic if needed
} else {
  importData();
}
