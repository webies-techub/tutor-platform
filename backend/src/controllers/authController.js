const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendWelcomeEmail } = require('../services/email');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signAccess = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

const signRefresh = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    const allowed = ['student', 'tutor'];
    const userRole = allowed.includes(role) ? role : 'student';

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password_hash, role: userRole });

    sendWelcomeEmail(user).catch(console.error);

    return res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTS);

    return res.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: 'Refresh token invalid or expired' });
    }

    const user = await User.findByPk(payload.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = signAccess(user);
    return res.json({ accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken', COOKIE_OPTS);
  return res.json({ message: 'Logged out' });
};
