const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { checkEmailDomain } = require('../utils/emailUtils'); // Utility to check email domain (e.g. university email)
const crypto = require('crypto'); // Add this line to import the crypto module

// Function to hash email
function hashEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

// Send Verification Email
router.post('/signup', async (req, res) => {
  const { email } = req.body;

  // Validate university email
  const university = checkEmailDomain(email);
  if (!checkEmailDomain(email)) {
    return res.status(400).json({ message: 'Please provide a valid university email.' });
  }

  try {
    // Hash the email
    const hashedEmail = hashEmail(email);

    // Check if the user already exists
    const existingUser = await User.findOne({ email: hashedEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'Email already registered and verified.' });
      }

      // If user is not verified, resend verification email
      const token = jwt.sign({ email: hashedEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
        subject: 'Resend Email Verification',
        text: `Your email was already registered but not verified. Please verify your email by clicking on this link: ${process.env.CLIENT_URL}/verify?token=${token}`
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: 'Verification email resent!' });
    }

    // Create a new user with isVerified as false
    const newUser = new User({
      email: hashedEmail,
      university: university,
      isVerified: false
    });

    await newUser.save();

    // Generate verification token
    const token = jwt.sign({ email: hashedEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

  if (!token) {
    return res.status(400).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email: hashedEmail } = decoded;

    // Check if the user exists
    const existingUser = await User.findOne({ email: hashedEmail });
    if (!existingUser) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if the user is already verified
    if (existingUser.isVerified) {
      return res.status(400).json({ message: 'Email already verified.' });
    }

    // Update the user's verification status
    existingUser.isVerified = true;
    await existingUser.save();

    res.status(200).json({ message: 'Email successfully verified! Redirecting to set your password.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

router.post('/complete-signup', async (req, res) => {
  const { email, password } = req.body;  // Receive email and password

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Hash the email
    const hashedEmail = hashEmail(email);

    // Find the user by hashed email
    const user = await User.findOne({ email: hashedEmail });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Email not verified.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Generate random user ID and assign it
    const randomUserId = 'user_' + Math.random().toString(36).substr(2, 9); // Example random user ID generation
    user.username = randomUserId;

    // Save the user with the password and username
    await user.save();

    res.status(200).json({ message: 'Password successfully set!', username: randomUserId });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'An error occurred during signup.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Hash the email
    const hashedEmail = hashEmail(email);

    // Find the user by hashed email
    const user = await User.findOne({ email: hashedEmail });

    // If user doesn't exist
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if the password is set
    if (!user.password) {
      return res.status(400).json({ message: 'Please complete the signup process to set your password.' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // If credentials are correct, generate a JWT token
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful!', token, user: {
      username: user.username,
      university: user.university
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;