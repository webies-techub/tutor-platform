const router = require('express').Router();
const { simulatePayment, simulateBookingPayment, getMyPayments, createPaymentIntent } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.post('/create-intent', verifyToken, requireRole('student'), createPaymentIntent);
router.post('/simulate', verifyToken, requireRole('student'), simulatePayment);
router.post('/simulate-booking', verifyToken, requireRole('student'), simulateBookingPayment);
router.get('/mine', verifyToken, requireRole('student'), getMyPayments);

module.exports = router;
