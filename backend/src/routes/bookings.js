const router = require('express').Router();
const {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  confirmBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.post('/', verifyToken, requireRole('student'), createBooking);
router.get('/mine', verifyToken, requireRole('student'), getMyBookings);
router.get('/incoming', verifyToken, requireRole('tutor'), getIncomingBookings);
router.put('/:id/confirm', verifyToken, requireRole('tutor'), confirmBooking);
router.put('/:id/cancel', verifyToken, cancelBooking);

module.exports = router;
