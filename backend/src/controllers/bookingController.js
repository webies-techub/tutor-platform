const { v4: uuidv4 } = require('uuid');
const { Booking, User } = require('../models');
const { sendNewBookingRequestEmail, sendBookingConfirmedEmail } = require('../services/email');

exports.createBooking = async (req, res) => {
  try {
    const { tutor_id, subject, datetime } = req.body;
    const tutor = await User.findOne({ where: { id: tutor_id, role: 'tutor' } });
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    const booking = await Booking.create({
      student_id: req.user.id,
      tutor_id,
      subject,
      datetime,
    });

    const student = await User.findByPk(req.user.id);
    sendNewBookingRequestEmail(tutor, student, booking).catch(console.error);

    return res.status(201).json(booking);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { student_id: req.user.id },
      include: [{ model: User, as: 'tutor', attributes: ['id', 'name', 'email'] }],
      order: [['datetime', 'DESC']],
    });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getIncomingBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { tutor_id: req.user.id },
      include: [{ model: User, as: 'student', attributes: ['id', 'name', 'email'] }],
      order: [['datetime', 'ASC']],
    });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.tutor_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    if (booking.status !== 'pending') {
      return res.status(409).json({ message: 'Booking already processed' });
    }

    booking.status = 'confirmed';
    booking.meeting_link = `https://meet.learnhub.local/room/${uuidv4()}`;
    await booking.save();

    const student = await User.findByPk(booking.student_id);
    const tutor = await User.findByPk(req.user.id);
    sendBookingConfirmedEmail(student, tutor, booking).catch(console.error);

    return res.json(booking);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const isOwner =
      booking.student_id === req.user.id || booking.tutor_id === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    booking.status = 'cancelled';
    await booking.save();
    return res.json(booking);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
