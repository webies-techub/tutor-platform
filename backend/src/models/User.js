const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('student', 'tutor', 'admin'), defaultValue: 'student' },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    email_verified: { type: DataTypes.BOOLEAN, defaultValue: true },
    otp_code: { type: DataTypes.STRING(6), allowNull: true },
    otp_expires_at: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'users', underscored: true }
);

module.exports = User;
