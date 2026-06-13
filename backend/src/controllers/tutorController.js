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
    const { headline, bio, subjects, qualifications, experience_years, hourly_rate } = req.body;
    const user = await User.findByPk(req.user.id);

    const existing = await TutorProfile.findOne({ where: { user_id: req.user.id } });
    if (existing) return res.status(409).json({ message: 'Application already submitted' });

    const profile = await TutorProfile.create({
      user_id: req.user.id,
      headline,
      bio,
      subjects,
      qualifications,
      experience_years: experience_years || 0,
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
    const [profile] = await TutorProfile.findOrCreate({
      where: { user_id: req.user.id },
      defaults: { user_id: req.user.id, hourly_rate: 0 },
    });

    const { headline, bio, subjects, qualifications, experience_years, hourly_rate } = req.body;
    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (subjects !== undefined) profile.subjects = subjects;
    if (qualifications !== undefined) profile.qualifications = qualifications;
    if (experience_years !== undefined) profile.experience_years = Number(experience_years) || 0;
    if (hourly_rate !== undefined) profile.hourly_rate = Number(hourly_rate) || 0;
    if (req.file) profile.avatar_path = `uploads/thumbnails/${req.file.filename}`;

    await profile.save();
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const [profile] = await TutorProfile.findOrCreate({
      where: { user_id: req.user.id },
      defaults: { user_id: req.user.id, hourly_rate: 0 },
    });
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
