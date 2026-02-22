import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

/**
 * Helper function to generate JWT token
 *
 * @param {number} userId - User's database ID
 * @param {string} email - User's email
 * @returns {string} JWT token
 */
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * POST /api/signup
 * Create new user account and return JWT token
 */
router.post('/signup', async (req, res) => {
  const { email, password, base_currency = 'SEK', language = 'EN' } = req.body;
  console.log('Signup:', email, 'Currency:', base_currency, 'Language:', language);

  try {
    const validCurrencies = ['SEK', 'EUR'];
    if (!validCurrencies.includes(base_currency)) {
      return res.status(400).json({ error: 'Invalid currency. Supported: SEK, EUR' });
    }

    const validLanguages = ['EN', 'IT'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ error: 'Invalid language. Supported: EN, IT' });
    }

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (email, password, base_currency, language) VALUES ($1, $2, $3, $4) RETURNING id, email, base_currency, language',
      [email, hashedPassword, base_currency, language]
    );

    const newUser = result.rows[0];
    console.log('User created:', newUser.email, 'Currency:', newUser.base_currency, 'Language:', newUser.language);

    const token = generateToken(newUser.id, newUser.email);

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        base_currency: newUser.base_currency,
        language: newUser.language
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', email);

  try {
    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Compare password with hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    console.log('User authenticated successfully:', user.email);

    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        base_currency: user.base_currency || 'SEK',
        language: user.language || 'EN'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/settings', async (req, res) => {
  const { base_currency, language } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const updates = [];
    const params = [];
    let paramCount = 0;

    if (base_currency) {
      const validCurrencies = ['SEK', 'EUR'];
      if (!validCurrencies.includes(base_currency)) {
        return res.status(400).json({ error: 'Invalid currency' });
      }
      paramCount++;
      updates.push(`base_currency = $${paramCount}`);
      params.push(base_currency);
    }

    if (language) {
      const validLanguages = ['EN', 'IT'];
      if (!validLanguages.includes(language)) {
        return res.status(400).json({ error: 'Invalid language' });
      }
      paramCount++;
      updates.push(`language = $${paramCount}`);
      params.push(language);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(userId);
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount + 1}
      RETURNING id, email, base_currency, language
    `;

    const result = await pool.query(query, params);
    const user = result.rows[0];

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        base_currency: user.base_currency,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
