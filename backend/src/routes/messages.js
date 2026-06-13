const router = require('express').Router();
const { getInbox, getMessages, sendMessage } = require('../controllers/messageController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/inbox', getInbox);
router.get('/:bookingId', getMessages);
router.post('/:bookingId', sendMessage);

module.exports = router;
