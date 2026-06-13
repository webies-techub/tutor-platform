const router = require('express').Router();
const { register, login, refresh, logout, verifyOtp, resendOtp } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', verifyToken, logout);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Test-only: bypass email OTP verification. Disabled in production.
router.post('/force-verify', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(404).json({ message: 'Not found' });
  const { User } = require('../models');
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.update({ email_verified: true, otp_code: null, otp_expires_at: null });
  return res.json({ message: 'Verified' });
});

module.exports = router;
