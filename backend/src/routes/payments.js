const router = require('express').Router();
const { simulatePayment, getMyPayments } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.post('/simulate', verifyToken, requireRole('student'), simulatePayment);
router.get('/mine', verifyToken, requireRole('student'), getMyPayments);

module.exports = router;
