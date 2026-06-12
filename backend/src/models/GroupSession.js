const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupSession = sequelize.define(
  'GroupSession',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    tutor_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    subject: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    datetime: { type: DataTypes.DATE, allowNull: false },
    duration_min: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 60 },
    capacity: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 10 },
    seats_taken: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0.0 },
    meeting_link: { type: DataTypes.STRING(500) },
    status: {
      type: DataTypes.ENUM('scheduled', 'cancelled', 'completed'),
      defaultValue: 'scheduled',
    },
  },
  { tableName: 'group_sessions', underscored: true }
);

module.exports = GroupSession;
