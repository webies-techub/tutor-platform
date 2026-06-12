const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define(
  'Booking',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tutor_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    subject: { type: DataTypes.STRING(150), allowNull: false },
    datetime: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending',
    },
    meeting_link: { type: DataTypes.STRING(500) },
  },
  { tableName: 'bookings', underscored: true }
);

module.exports = Booking;
