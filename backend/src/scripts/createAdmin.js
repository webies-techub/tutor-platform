require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { User } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    const hash = await bcrypt.hash('Admin@1234', 12);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@learnhub.local',
      password_hash: hash,
      role: 'admin',
    });
    console.log('Admin user created:', admin.email);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sequelize.close();
  }
})();
