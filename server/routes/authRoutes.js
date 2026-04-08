const express = require('express');
const { authUser, registerUser, updateUserProfile } = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;
