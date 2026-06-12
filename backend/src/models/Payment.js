const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define(
  'Payment',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    course_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    session_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    kind: { type: DataTypes.ENUM('course', 'group_session'), defaultValue: 'course' },
    amount: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending' },
  },
  { tableName: 'payments', underscored: true }
);

module.exports = Payment;
