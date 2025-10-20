const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgres');

const Person = sequelize.define('Person', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dni: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  lastname: { type: DataTypes.STRING, allowNull: false },
  birthday: { type: DataTypes.DATE, allowNull: false },
  ciudad: { type: DataTypes.STRING, allowNull: false },
  genero: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'person',
  timestamps: true
});

module.exports = Person;