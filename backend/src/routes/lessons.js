const router = require('express').Router();
const { addLesson, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { uploadVideo } = require('../middleware/upload');

router.post('/', verifyToken, requireRole('tutor', 'admin'), uploadVideo.single('video'), addLesson);
router.put('/:id', verifyToken, requireRole('tutor', 'admin'), uploadVideo.single('video'), updateLesson);
router.delete('/:id', verifyToken, requireRole('tutor', 'admin'), deleteLesson);

module.exports = router;
