const { User, TutorProfile, Course } = require('../models');
const { sendTutorApplicationEmails } = require('../services/email');

exports.listTutors = async (req, res) => {
  try {
    const tutors = await TutorProfile.findAll({
      where: { is_approved: true },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    });
    return res.json(tutors);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getTutor = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({
      where: { user_id: req.params.id, is_approved: true },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!profile) return res.status(404).json({ message: 'Tutor not found' });

    const courses = await Course.findAll({
      where: { tutor_id: req.params.id, is_approved: true },
    });
    return res.json({ profile, courses });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.applyAsTutor = async (req, res) => {
  try {
    const { bio, subjects, hourly_rate } = req.body;
    const user = await User.findByPk(req.user.id);

    const existing = await TutorProfile.findOne({ where: { user_id: req.user.id } });
    if (existing) return res.status(409).json({ message: 'Application already submitted' });

    const profile = await TutorProfile.create({
      user_id: req.user.id,
      bio,
      subjects,
      hourly_rate: hourly_rate || 0,
    });

    user.role = 'tutor';
    await user.save();

    sendTutorApplicationEmails({ ...user.toJSON(), subjects }).catch(console.error);

    return res.status(201).json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ message: 'Tutor profile not found' });

    const { bio, subjects, hourly_rate } = req.body;
    if (bio !== undefined) profile.bio = bio;
    if (subjects !== undefined) profile.subjects = subjects;
    if (hourly_rate !== undefined) profile.hourly_rate = hourly_rate;
    if (req.file) profile.avatar_path = req.file.path;

    await profile.save();
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
