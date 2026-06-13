const router = require('express').Router();
const { register, login, refresh, logout, verifyOtp, resendOtp } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', verifyToken, logout);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

module.exports = router;
