const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LessonProgress = sequelize.define(
  'LessonProgress',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    lesson_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    completed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: 'lesson_progress', underscored: true, timestamps: false }
);

module.exports = LessonProgress;
