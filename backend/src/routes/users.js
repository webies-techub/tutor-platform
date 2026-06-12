const router = require('express').Router();
const { getMe, updateMe, changePassword } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, updateMe);
router.put('/me/password', verifyToken, changePassword);

module.exports = router;
