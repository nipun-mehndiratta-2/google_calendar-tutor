// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

// Fetch user details
router.get('/',authenticateToken, async (req, res) => {
    try {
      const userId = req.userData.userId
      // Fetch user details from database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ email: user.email });
    } catch (error) {
      console.error('Error fetching user details', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

// Login
router.post('/login', async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
          // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    const userData = await user.save();
    const token = jwt.sign({ userId: userData._id,userEmail: userData.email }, "SECRE8", { expiresIn: '1h' });
    return res.status(200).json({ token });
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id,userEmail: user.email }, "SECRE8", { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
