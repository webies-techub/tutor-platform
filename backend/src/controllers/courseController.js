const { Op } = require('sequelize');
const { Course, Lesson, User } = require('../models');

exports.listCourses = async (req, res) => {
  try {
    const where = { is_approved: true };
    if (req.query.subject) where.subject = req.query.subject;
    if (req.query.type) where.type = req.query.type;
    if (req.query.featured === 'true') where.is_featured = true;

    const courses = await Course.findAll({
      where,
      include: [{ model: User, as: 'tutor', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
    return res.json(courses);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      where: { id: req.params.id, is_approved: true },
      include: [
        { model: User, as: 'tutor', attributes: ['id', 'name'] },
        {
          model: Lesson,
          as: 'lessons',
          attributes: ['id', 'title', 'duration', 'order_index'],
          order: [['order_index', 'ASC']],
        },
      ],
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    return res.json(course);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, subject, description, price, type } = req.body;
    const course = await Course.create({
      tutor_id: req.user.id,
      title,
      subject,
      description,
      price: price || 0,
      type: type || 'recorded',
      thumbnail_path: req.file ? req.file.path : null,
    });
    return res.status(201).json(course);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (req.user.role !== 'admin' && course.tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const fields = ['title', 'subject', 'description', 'price', 'type'];
    fields.forEach((f) => { if (req.body[f] !== undefined) course[f] = req.body[f]; });
    if (req.file) course.thumbnail_path = req.file.path;
    await course.save();
    return res.json(course);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (req.user.role !== 'admin' && course.tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await course.destroy();
    return res.json({ message: 'Course deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
