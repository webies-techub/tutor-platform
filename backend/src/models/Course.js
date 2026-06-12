const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define(
  'Course',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    tutor_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    subject: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0.0 },
    type: { type: DataTypes.ENUM('recorded', 'live'), defaultValue: 'recorded' },
    thumbnail_path: { type: DataTypes.STRING(500) },
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'courses', underscored: true }
);

module.exports = Course;
