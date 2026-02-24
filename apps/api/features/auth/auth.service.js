import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../db.js';

export const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const createUser = async (email, password, base_currency, language, initial_balance = 0) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await pool.query(
    'INSERT INTO users (email, password, base_currency, language, initial_balance) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, base_currency, language, initial_balance',
    [email, hashedPassword, base_currency, language, initial_balance]
  );
  return result.rows[0];
};

export const verifyPassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

export const updateSettings = async (userId, { base_currency, language, initial_balance }) => {
  const updates = [];
  const params = [];
  let paramCount = 0;

  if (base_currency) {
    paramCount++;
    updates.push(`base_currency = $${paramCount}`);
    params.push(base_currency);
  }
  if (language) {
    paramCount++;
    updates.push(`language = $${paramCount}`);
    params.push(language);
  }
  if (initial_balance !== undefined) {
    paramCount++;
    updates.push(`initial_balance = $${paramCount}`);
    params.push(initial_balance);
  }

  if (updates.length === 0) return null;

  params.push(userId);
  const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${paramCount + 1}
    RETURNING id, email, base_currency, language, initial_balance
  `;
  const result = await pool.query(query, params);
  return result.rows[0];
};
