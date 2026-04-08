const User = require('../models/User');

const seedUsers = async () => {
  try {
    // Admin Account
    let admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.log('Seed: Admin not found, creating...');
      await User.create({
        name: 'DR. HANY KHATAB',
        username: 'admin',
        password: '123456',
        role: 'Admin'
      });
    } else {
      admin.name = 'DR. HANY KHATAB';
      admin.password = '123456';
      await admin.save();
    }

    // Doctor Account
    let doctor = await User.findOne({ username: 'doctor' });
    if (!doctor) {
      console.log('Seed: Doctor not found, creating...');
      await User.create({
        name: 'MAYA EL SERAFI',
        username: 'doctor',
        password: '123456',
        role: 'Doctor'
      });
    } else {
      doctor.name = 'MAYA EL SERAFI';
      doctor.password = '123456';
      await doctor.save();
    }
    
    console.log('Seed: Users verified and updated (admin / doctor).');
  } catch (error) {
    console.error('Seed Error:', error.message);
  }
};


module.exports = seedUsers;

