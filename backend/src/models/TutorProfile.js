const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TutorProfile = sequelize.define(
  'TutorProfile',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
    headline: { type: DataTypes.STRING(200) },
    bio: { type: DataTypes.TEXT },
    subjects: { type: DataTypes.STRING(500) },
    qualifications: { type: DataTypes.STRING(500) },
    experience_years: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    hourly_rate: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0.0 },
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    avatar_path: { type: DataTypes.STRING(500) },
  },
  { tableName: 'tutor_profiles', underscored: true }
);

module.exports = TutorProfile;
