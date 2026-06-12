const { Lesson, Course } = require('../models');

exports.addLesson = async (req, res) => {
  try {
    const { course_id, title, order_index, duration } = req.body;
    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (req.user.role !== 'admin' && course.tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const lesson = await Lesson.create({
      course_id,
      title,
      video_path: req.file ? req.file.path : null,
      order_index: order_index || 0,
      duration: duration || 0,
    });
    return res.status(201).json(lesson);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }],
    });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    if (req.user.role !== 'admin' && lesson.course.tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { title, order_index, duration } = req.body;
    if (title !== undefined) lesson.title = title;
    if (order_index !== undefined) lesson.order_index = order_index;
    if (duration !== undefined) lesson.duration = duration;
    if (req.file) lesson.video_path = req.file.path;
    await lesson.save();
    return res.json(lesson);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }],
    });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    if (req.user.role !== 'admin' && lesson.course.tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await lesson.destroy();
    return res.json({ message: 'Lesson deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
