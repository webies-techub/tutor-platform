const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { User, TutorProfile, Course, Lesson, Booking, Payment, Enrollment } = require('../models');
const { sendTutorApprovedEmail } = require('../services/email');

exports.getStats = async (req, res) => {
  try {
    const [users, courses, bookings, revenueResult] = await Promise.all([
      User.count(),
      Course.count(),
      Booking.count(),
      Payment.sum('amount', { where: { status: 'completed' } }),
    ]);
    return res.json({ users, courses, bookings, revenue: revenueResult || 0 });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'is_active', 'created_at'],
      order: [['created_at', 'DESC']],
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.is_active = !user.is_active;
    await user.save();
    return res.json({ id: user.id, is_active: user.is_active });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.listTutors = async (req, res) => {
  try {
    const tutors = await TutorProfile.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
    });
    return res.json(tutors);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.approveTutor = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({
      where: { user_id: req.params.id },
      include: [{ model: User, as: 'user' }],
    });
    if (!profile) return res.status(404).json({ message: 'Tutor profile not found' });
    profile.is_approved = true;
    await profile.save();
    sendTutorApprovedEmail(profile.user).catch(console.error);
    return res.json({ message: 'Tutor approved', profile });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.listCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'tutor', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
    return res.json(courses);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.approveCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.is_approved = true;
    await course.save();
    return res.json(course);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.featureCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.is_featured = !course.is_featured;
    await course.save();
    return res.json(course);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { tutor_id, title, subject, description, price, type } = req.body;
    const course = await Course.create({
      tutor_id,
      title,
      subject,
      description,
      price: price || 0,
      type: type || 'recorded',
      thumbnail_path: req.file ? req.file.path : null,
      is_approved: true,
    });
    return res.status(201).json(course);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const { course_id, title, order_index, duration } = req.body;
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

exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'tutor', attributes: ['id', 'name', 'email'] },
      ],
      order: [['datetime', 'DESC']],
    });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.listPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'title'] },
      ],
      order: [['created_at', 'DESC']],
    });
    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
