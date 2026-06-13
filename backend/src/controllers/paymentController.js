const { Payment, Enrollment, Course, Booking, TutorProfile, GroupSession, User } = require('../models');
const { sendEnrollmentEmail, sendBookingConfirmedEmail } = require('../services/email');
const stripe = require('../services/stripeService');

// ── Stripe: create PaymentIntent ──────────────────────────────────────────────
exports.createPaymentIntent = async (req, res) => {
  if (!stripe.isConfigured()) {
    return res.status(400).json({ message: 'Stripe is not configured on this server.' });
  }
  try {
    const { type, reference_id } = req.body;
    const student_id = req.user.id;
    let amountAud = 0;
    const metadata = { type, student_id: String(student_id) };

    if (type === 'course') {
      const course = await Course.findByPk(reference_id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      const already = await Enrollment.findOne({ where: { student_id, course_id: reference_id } });
      if (already) return res.status(409).json({ message: 'Already enrolled in this course' });
      amountAud = parseFloat(course.price);
      metadata.course_id = String(reference_id);
    } else if (type === 'booking') {
      const booking = await Booking.findByPk(reference_id, {
        include: [{ model: User, as: 'tutor', attributes: ['id'],
          include: [{ model: TutorProfile, as: 'tutorProfile', attributes: ['hourly_rate'] }] }],
      });
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      if (booking.student_id !== student_id) return res.status(403).json({ message: 'Forbidden' });
      amountAud = parseFloat(booking.tutor?.tutorProfile?.hourly_rate || 0);
      metadata.booking_id = String(reference_id);
    } else if (type === 'group') {
      const session = await GroupSession.findByPk(reference_id);
      if (!session) return res.status(404).json({ message: 'Session not found' });
      amountAud = parseFloat(session.price || 0);
      metadata.session_id = String(reference_id);
    } else {
      return res.status(400).json({ message: 'Invalid payment type' });
    }

    if (amountAud <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero for Stripe payment' });
    }

    const intent = await stripe.createIntent({ amountAud, metadata });
    return res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── Course purchase ────────────────────────────────────────────────────────────
// Accepts optional payment_intent_id — when present, verifies with Stripe.
// When absent (or Stripe not configured), processes as before (legacy simulate mode).
exports.simulatePayment = async (req, res) => {
  try {
    const { course_id, payment_intent_id } = req.body;
    const student_id = req.user.id;

    const existing = await Enrollment.findOne({ where: { student_id, course_id } });
    if (existing) return res.status(409).json({ message: 'Already enrolled in this course' });

    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Verify with Stripe when a PaymentIntent ID is provided
    if (payment_intent_id && stripe.isConfigured()) {
      const intent = await stripe.retrieveIntent(payment_intent_id);
      if (intent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not confirmed by Stripe' });
      }
    }

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

// ── Booking payment ────────────────────────────────────────────────────────────
exports.simulateBookingPayment = async (req, res) => {
  try {
    const { booking_id, payment_intent_id } = req.body;
    const student_id = req.user.id;

    const booking = await Booking.findByPk(booking_id, {
      include: [
        { model: User, as: 'tutor', attributes: ['id', 'name', 'email'],
          include: [{ model: TutorProfile, as: 'tutorProfile', attributes: ['hourly_rate'] }] },
      ],
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.student_id !== student_id) return res.status(403).json({ message: 'Forbidden' });
    if (booking.payment_id) return res.status(409).json({ message: 'Already paid for this booking' });
    if (booking.status === 'cancelled') return res.status(409).json({ message: 'Booking has been cancelled' });

    // Verify with Stripe when a PaymentIntent ID is provided
    if (payment_intent_id && stripe.isConfigured()) {
      const intent = await stripe.retrieveIntent(payment_intent_id);
      if (intent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not confirmed by Stripe' });
      }
    }

    const amount = parseFloat(booking.tutor?.tutorProfile?.hourly_rate || 0);

    const payment = await Payment.create({
      student_id,
      booking_id: booking.id,
      kind: 'booking',
      amount,
      status: 'completed',
    });

    booking.payment_id = payment.id;
    await booking.save();

    const student = await User.findByPk(student_id);
    sendBookingConfirmedEmail(student, booking.tutor, booking).catch(console.error);

    return res.status(201).json({ payment, booking });
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
