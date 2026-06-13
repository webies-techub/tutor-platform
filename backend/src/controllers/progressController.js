const { LessonProgress, Lesson, Enrollment } = require('../models');

// POST /api/progress/:lessonId — mark lesson complete (student only)
exports.markComplete = async (req, res) => {
  try {
    const studentId = req.user.id;
    const lessonId = parseInt(req.params.lessonId, 10);

    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const enrolled = await Enrollment.findOne({ where: { student_id: studentId, course_id: lesson.course_id } });
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

    const [record, created] = await LessonProgress.findOrCreate({
      where: { student_id: studentId, lesson_id: lessonId },
      defaults: { student_id: studentId, lesson_id: lessonId },
    });

    return res.json({ completed: true, created });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/progress/mine — all completed lesson IDs for the student
exports.getMine = async (req, res) => {
  try {
    const rows = await LessonProgress.findAll({ where: { student_id: req.user.id }, attributes: ['lesson_id'] });
    return res.json(rows.map((r) => r.lesson_id));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
