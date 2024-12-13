const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { checkEmailDomain } = require('../utils/emailUtils'); // Utility to check email domain (e.g. university email)

// Send Verification Email
router.post('/signup', async (req, res) => {
  const { email } = req.body;

  // Validate university email
  if (!checkEmailDomain(email)) {
    return res.status(400).json({ message: 'Please provide a valid university email.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Generate verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.decode(token);
    
    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on this link: ${process.env.CLIENT_URL}/verify?token=${token}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Verification email sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Verify Email
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  console.log(token);

  if (!token) {
    return res.status(400).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Check if the email is already verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'Email already verified.' });
    }

    // Create user with the email if it doesn't exist and set email as verified
    const user = new User({
      email,
      isVerified: true
    });

    await user.save();
    res.status(200).json({ message: 'Email successfully verified!' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

// Complete Signup - User sets password
router.post('/complete-signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found or email not verified.' });
    }

    if (user.password) {
      return res.status(400).json({ message: 'User already completed signup.' });
    }

    // Generate a random username
    const username = `user_${Math.floor(Math.random() * 1000000)}`;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.username = username;
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Signup completed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;