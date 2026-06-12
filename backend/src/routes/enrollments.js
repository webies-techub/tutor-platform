const router = require('express').Router();
const { getMyEnrollments, checkEnrollment } = require('../controllers/enrollmentController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.get('/mine', verifyToken, requireRole('student'), getMyEnrollments);
router.get('/:courseId/check', verifyToken, requireRole('student'), checkEnrollment);

module.exports = router;
