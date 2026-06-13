const { Lesson, Course } = require('../models');

exports.addLesson = async (req, res) => {
  try {
    const { course_id, title, order_index, duration, lesson_type = 'video', content } = req.body;
    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (req.user.role !== 'admin' && course.tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const lessonData = {
      course_id,
      title,
      lesson_type,
      order_index: order_index || 0,
      duration: lesson_type === 'video' ? (duration || 0) : 0,
    };

    if (lesson_type === 'video') {
      lessonData.video_path = req.file ? req.file.path : null;
    } else if (lesson_type === 'text') {
      lessonData.content = content || '';
    } else if (lesson_type === 'youtube') {
      lessonData.content = content || '';  // stores the YouTube URL
    } else if (lesson_type === 'image' || lesson_type === 'resource') {
      lessonData.resource_path = req.file ? `uploads/resources/${req.file.filename}` : null;
    }

    const lesson = await Lesson.create(lessonData);
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

    const { title, order_index, duration, content } = req.body;
    if (title !== undefined) lesson.title = title;
    if (order_index !== undefined) lesson.order_index = order_index;
    if (duration !== undefined) lesson.duration = duration;
    if (content !== undefined) lesson.content = content;

    if (req.file) {
      if (req.file.mimetype.startsWith('video/')) {
        lesson.video_path = req.file.path;
      } else {
        lesson.resource_path = `uploads/resources/${req.file.filename}`;
      }
    }

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
