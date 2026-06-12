const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupRegistration = sequelize.define(
  'GroupRegistration',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    session_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    student_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    payment_id: { type: DataTypes.INTEGER.UNSIGNED },
  },
  {
    tableName: 'group_registrations',
    underscored: true,
    updatedAt: false,
    indexes: [{ unique: true, fields: ['session_id', 'student_id'] }],
  }
);

module.exports = GroupRegistration;
