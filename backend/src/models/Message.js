const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define(
  'Message',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    booking_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    sender_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: 'messages', underscored: true, timestamps: false }
);

module.exports = Message;
