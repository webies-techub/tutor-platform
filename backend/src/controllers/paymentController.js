const { Payment, Enrollment, Course, User } = require('../models');
const { sendEnrollmentEmail } = require('../services/email');

exports.simulatePayment = async (req, res) => {
  try {
    const { course_id } = req.body;
    const student_id = req.user.id;

    const existing = await Enrollment.findOne({ where: { student_id, course_id } });
    if (existing) return res.status(409).json({ message: 'Already enrolled in this course' });

    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const payment = await Payment.create({
      student_id,
      course_id,
      amount: course.price,
      status: 'completed',
    });

    const enrollment = await Enrollment.create({
      student_id,
      course_id,
      payment_id: payment.id,
    });

    const student = await User.findByPk(student_id);
    sendEnrollmentEmail(student, course, course.price).catch(console.error);

    return res.status(201).json({ payment, enrollment });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { student_id: req.user.id },
      include: [{ model: Course, as: 'course', attributes: ['id', 'title', 'subject'] }],
      order: [['created_at', 'DESC']],
    });
    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
