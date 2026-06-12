const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'is_active', 'created_at'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword required' });
    }
    const user = await User.findByPk(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Current password incorrect' });
    user.password_hash = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.json({ message: 'Password changed' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
