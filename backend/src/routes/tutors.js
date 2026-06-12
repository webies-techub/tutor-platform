const router = require('express').Router();
const {
  listTutors,
  getTutor,
  applyAsTutor,
  updateProfile,
  getMyProfile,
} = require('../controllers/tutorController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { uploadAvatar } = require('../middleware/upload');

router.get('/', listTutors);
router.get('/profile', verifyToken, requireRole('tutor'), getMyProfile);
router.get('/:id', getTutor);
router.post('/apply', verifyToken, applyAsTutor);
router.put('/profile', verifyToken, requireRole('tutor'), uploadAvatar.single('avatar'), updateProfile);

module.exports = router;
