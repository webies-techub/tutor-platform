const { Enrollment, Course, Lesson } = require('../models');

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { student_id: req.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: Lesson,
              as: 'lessons',
              attributes: ['id', 'title', 'duration', 'order_index', 'lesson_type', 'content', 'resource_path'],
              order: [['order_index', 'ASC']],
            },
          ],
        },
      ],
    });
    return res.json(enrollments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      where: { student_id: req.user.id, course_id: req.params.courseId },
    });
    return res.json({ enrolled: !!enrollment });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
