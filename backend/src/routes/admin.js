const router = require('express').Router();
const {
  getStats,
  listUsers,
  toggleUser,
  listTutors,
  approveTutor,
  listCourses,
  approveCourse,
  featureCourse,
  createCourse,
  addLesson,
  listBookings,
  listPayments,
} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { uploadThumbnail, uploadVideo } = require('../middleware/upload');

const isAdmin = [verifyToken, requireRole('admin')];

router.get('/stats', ...isAdmin, getStats);

router.get('/users', ...isAdmin, listUsers);
router.put('/users/:id/toggle', ...isAdmin, toggleUser);

router.get('/tutors', ...isAdmin, listTutors);
router.put('/tutors/:id/approve', ...isAdmin, approveTutor);

router.get('/courses', ...isAdmin, listCourses);
router.post('/courses', ...isAdmin, uploadThumbnail.single('thumbnail'), createCourse);
router.put('/courses/:id/approve', ...isAdmin, approveCourse);
router.put('/courses/:id/feature', ...isAdmin, featureCourse);

router.post('/lessons', ...isAdmin, uploadVideo.single('video'), addLesson);

router.get('/bookings', ...isAdmin, listBookings);
router.get('/payments', ...isAdmin, listPayments);

module.exports = router;
