const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define(
  'Lesson',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    course_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    video_path: { type: DataTypes.STRING(500) },
    duration: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    order_index: { type: DataTypes.SMALLINT.UNSIGNED, defaultValue: 0 },
  },
  { tableName: 'lessons', underscored: true }
);

module.exports = Lesson;
