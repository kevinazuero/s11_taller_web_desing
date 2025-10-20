const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgres');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  userId: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'id' }
  }
}, {
  tableName: 'tasks',
  timestamps: true
});

User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = Task;
