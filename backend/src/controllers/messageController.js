const { Message, Booking, User } = require('../models');
const { Op } = require('sequelize');

// GET /api/messages/inbox — conversation list for floating chat widget
exports.getInbox = async (req, res) => {
  try {
    const userId = req.user.id;
    const isStudent = req.user.role === 'student';

    const where = {
      [Op.or]: [{ student_id: userId }, { tutor_id: userId }],
      status: { [Op.ne]: 'cancelled' },
    };

    // Students can only chat on bookings they've paid for
    if (isStudent) {
      where.payment_id = { [Op.ne]: null };
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, as: 'student', attributes: ['id', 'name'] },
        { model: User, as: 'tutor', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    });

    const conversations = await Promise.all(
      bookings.map(async (b) => {
        const lastMsg = await Message.findOne({
          where: { booking_id: b.id },
          include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
          order: [['created_at', 'DESC']],
        });
        const otherPerson = userId === b.student_id ? b.tutor : b.student;
        return {
          bookingId: b.id,
          subject: b.subject,
          status: b.status,
          otherPerson: { id: otherPerson?.id, name: otherPerson?.name },
          lastMessage: lastMsg
            ? {
                id: lastMsg.id,
                body: lastMsg.body,
                senderId: lastMsg.sender_id,
                senderName: lastMsg.sender?.name,
                createdAt: lastMsg.created_at,
              }
            : null,
        };
      })
    );

    return res.json(conversations);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const canAccess = async (bookingId, userId) => {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) return null;
  if (booking.student_id !== userId && booking.tutor_id !== userId) return null;
  return booking;
};

// GET /api/messages/:bookingId — poll for messages
exports.getMessages = async (req, res) => {
  try {
    const booking = await canAccess(req.params.bookingId, req.user.id);
    if (!booking) return res.status(403).json({ message: 'Access denied' });

    const messages = await Message.findAll({
      where: { booking_id: booking.id },
      include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
      order: [['created_at', 'ASC']],
    });

    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/messages/:bookingId — send a message
exports.sendMessage = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) return res.status(400).json({ message: 'Message cannot be empty' });

    const booking = await canAccess(req.params.bookingId, req.user.id);
    if (!booking) return res.status(403).json({ message: 'Access denied' });

    const msg = await Message.create({
      booking_id: booking.id,
      sender_id: req.user.id,
      body: body.trim(),
    });

    const withSender = await Message.findByPk(msg.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
    });

    return res.status(201).json(withSender);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
