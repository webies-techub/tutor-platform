const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define(
  'Enrollment',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    course_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    payment_id: { type: DataTypes.INTEGER.UNSIGNED },
  },
  { tableName: 'enrollments', underscored: true, updatedAt: false }
);

module.exports = Enrollment;
