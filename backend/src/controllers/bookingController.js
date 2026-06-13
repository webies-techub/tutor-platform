const { Booking, User, TutorProfile } = require('../models');
const { sendNewBookingRequestEmail, sendBookingConfirmedEmail } = require('../services/email');

exports.createBooking = async (req, res) => {
  try {
    const { tutor_id, subject, datetime } = req.body;
    const tutor = await User.findOne({
      where: { id: tutor_id, role: 'tutor' },
      include: [{ model: TutorProfile, as: 'tutorProfile', attributes: ['hourly_rate'] }],
    });
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    const booking = await Booking.create({
      student_id: req.user.id,
      tutor_id,
      subject,
      datetime,
    });

    // Return the booking with tutor info so the frontend can redirect to checkout
    const result = booking.toJSON();
    result.tutor = { id: tutor.id, name: tutor.name, hourly_rate: tutor.tutorProfile?.hourly_rate || 0 };

    const student = await User.findByPk(req.user.id);
    sendNewBookingRequestEmail(tutor, student, booking).catch(console.error);

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/:id — fetch a single booking with tutor profile (for checkout page)
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'name'],
          include: [{ model: TutorProfile, as: 'tutorProfile', attributes: ['hourly_rate'] }],
        },
        { model: User, as: 'student', attributes: ['id', 'name'] },
      ],
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Only the student or tutor involved can see it
    if (booking.student_id !== req.user.id && booking.tutor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.json(booking);
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
    booking.meeting_link = req.body.meeting_url || null;
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
