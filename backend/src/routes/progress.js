const router = require('express').Router();
const { markComplete, getMine } = require('../controllers/progressController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.use(verifyToken, requireRole('student'));
router.get('/mine', getMine);
router.post('/:lessonId', markComplete);

module.exports = router;
