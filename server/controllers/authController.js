const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const authUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for: ${username}`);

    // Case-insensitive search
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } 
    });

    if (user) {
      console.log(`User found: ${user.username}, Role: ${user.role}`);
      const isMatch = await user.matchPassword(password);
      console.log(`Password match: ${isMatch}`);

      if (isMatch) {
        return res.json({
          _id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
          token: generateToken(user._id),
        });
      }
    } else {
      console.log('User NOT found in database');
    }

    res.status(401);
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, username, password, role } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      username,
      password,
      role: role || 'Doctor',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    const user = await User.findById(req.user._id);

    if (user) {
      const { name, oldPassword, newPassword } = req.body;
      
      user.name = name || user.name;

      if (newPassword) {
        if (!oldPassword) {
          res.status(400);
          throw new Error('Please provide old password to set a new one');
        }
        
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
          res.status(401);
          throw new Error('Old password is incorrect');
        }
        user.password = newPassword;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authUser, registerUser, updateUserProfile };
