const router = require('express').Router();
const {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { uploadThumbnail } = require('../middleware/upload');

router.get('/', listCourses);
router.get('/:id', getCourse);
router.post('/', verifyToken, requireRole('tutor', 'admin'), uploadThumbnail.single('thumbnail'), createCourse);
router.put('/:id', verifyToken, requireRole('tutor', 'admin'), uploadThumbnail.single('thumbnail'), updateCourse);
router.delete('/:id', verifyToken, requireRole('tutor', 'admin'), deleteCourse);

module.exports = router;
