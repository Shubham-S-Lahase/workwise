const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

// Hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare plain-text password with a hashed password
const comparePasswords = (plainText, hashed) => bcrypt.compare(plainText, hashed);

// Generate a JWT token
const generateToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

// Verify a JWT token
const verifyToken = (token) => jwt.verify(token, SECRET_KEY);

// Check if a user's role is admin
const isAdmin = (role) => role === 'admin';

module.exports = { hashPassword, comparePasswords, generateToken, verifyToken, isAdmin };