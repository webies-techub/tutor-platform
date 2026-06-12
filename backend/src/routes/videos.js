const router = require('express').Router();
const { streamVideo } = require('../controllers/videoController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.get('/:lessonId', verifyToken, requireRole('student'), streamVideo);

module.exports = router;
