const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');
const {
  GroupSession,
  GroupRegistration,
  Payment,
  User,
} = require('../models');
const { sendGroupRegistrationEmail } = require('../services/email');

// Public: list upcoming scheduled sessions
exports.listSessions = async (req, res) => {
  try {
    const where = { status: 'scheduled' };
    if (req.query.subject) where.subject = req.query.subject;
    if (req.query.upcoming !== 'false') where.datetime = { [Op.gte]: new Date() };

    const sessions = await GroupSession.findAll({
      where,
      include: [{ model: User, as: 'tutor', attributes: ['id', 'name'] }],
      order: [['datetime', 'ASC']],
    });
    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Public: single session
exports.getSession = async (req, res) => {
  try {
    const session = await GroupSession.findByPk(req.params.id, {
      include: [{ model: User, as: 'tutor', attributes: ['id', 'name'] }],
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    return res.json(session);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Tutor/Admin: create
exports.createSession = async (req, res) => {
  try {
    const { title, subject, description, datetime, duration_min, capacity, price, tutor_id } = req.body;
    const ownerId = req.user.role === 'admin' && tutor_id ? tutor_id : req.user.id;
    const session = await GroupSession.create({
      tutor_id: ownerId,
      title,
      subject,
      description,
      datetime,
      duration_min: duration_min || 60,
      capacity: capacity || 10,
      price: price || 0,
      meeting_link: `https://meet.learnhub.local/group/${uuidv4()}`,
    });
    return res.status(201).json(session);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Tutor/Admin: update
exports.updateSession = async (req, res) => {
  try {
    const session = await GroupSession.findByPk(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (req.user.role !== 'admin' && session.tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const fields = ['title', 'subject', 'description', 'datetime', 'duration_min', 'capacity', 'price', 'status'];
    fields.forEach((f) => { if (req.body[f] !== undefined) session[f] = req.body[f]; });
    await session.save();
    return res.json(session);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Tutor/Admin: delete
exports.deleteSession = async (req, res) => {
  try {
    const session = await GroupSession.findByPk(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (req.user.role !== 'admin' && session.tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await session.destroy();
    return res.json({ message: 'Session deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Tutor: sessions I host
exports.getMyHostedSessions = async (req, res) => {
  try {
    const sessions = await GroupSession.findAll({
      where: { tutor_id: req.user.id },
      include: [{ model: GroupRegistration, as: 'registrations' }],
      order: [['datetime', 'ASC']],
    });
    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Student: register (with simulated payment) — uses a transaction + row lock for seat safety
exports.registerForSession = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const session = await GroupSession.findByPk(req.params.id, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!session || session.status !== 'scheduled') {
      await t.rollback();
      return res.status(404).json({ message: 'Session not available' });
    }

    const existing = await GroupRegistration.findOne({
      where: { session_id: session.id, student_id: req.user.id },
      transaction: t,
    });
    if (existing) {
      await t.rollback();
      return res.status(409).json({ message: 'Already registered for this session' });
    }

    if (session.seats_taken >= session.capacity) {
      await t.rollback();
      return res.status(409).json({ message: 'This session is full' });
    }

    const payment = await Payment.create(
      {
        student_id: req.user.id,
        session_id: session.id,
        kind: 'group_session',
        amount: session.price,
        status: 'completed',
      },
      { transaction: t }
    );

    const registration = await GroupRegistration.create(
      { session_id: session.id, student_id: req.user.id, payment_id: payment.id },
      { transaction: t }
    );

    session.seats_taken += 1;
    await session.save({ transaction: t });

    await t.commit();

    const student = await User.findByPk(req.user.id);
    sendGroupRegistrationEmail(student, session).catch(console.error);

    return res.status(201).json({ payment, registration });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ message: err.message });
  }
};

// Student: my registered sessions
exports.getMyRegistrations = async (req, res) => {
  try {
    const regs = await GroupRegistration.findAll({
      where: { student_id: req.user.id },
      include: [
        {
          model: GroupSession,
          as: 'session',
          include: [{ model: User, as: 'tutor', attributes: ['id', 'name'] }],
        },
      ],
    });
    return res.json(regs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Student: check registration
exports.checkRegistration = async (req, res) => {
  try {
    const reg = await GroupRegistration.findOne({
      where: { session_id: req.params.id, student_id: req.user.id },
    });
    return res.json({ registered: !!reg });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
