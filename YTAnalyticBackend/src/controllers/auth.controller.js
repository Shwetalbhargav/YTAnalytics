const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/user.model');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existing = await getUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(email, hashed);

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Registration failed' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
      })
      .json({ message: 'Login successful', token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed' });
  }
};
// Get currently authenticated user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    res.json({ id: userId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get current user' });
  }
};

// Get user channels
exports.getUserChannels = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query('SELECT * FROM channels WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
};
