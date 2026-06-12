const router = require('express').Router();
const ctrl = require('../controllers/groupSessionController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// Public browse
router.get('/', ctrl.listSessions);

// Tutor: sessions I host (before /:id to avoid conflict)
router.get('/hosted/mine', verifyToken, requireRole('tutor', 'admin'), ctrl.getMyHostedSessions);

// Student: my registrations
router.get('/registrations/mine', verifyToken, requireRole('student'), ctrl.getMyRegistrations);

router.get('/:id', ctrl.getSession);
router.get('/:id/check', verifyToken, requireRole('student'), ctrl.checkRegistration);

// Create / manage
router.post('/', verifyToken, requireRole('tutor', 'admin'), ctrl.createSession);
router.put('/:id', verifyToken, requireRole('tutor', 'admin'), ctrl.updateSession);
router.delete('/:id', verifyToken, requireRole('tutor', 'admin'), ctrl.deleteSession);

// Student register (simulated payment)
router.post('/:id/register', verifyToken, requireRole('student'), ctrl.registerForSession);

module.exports = router;
