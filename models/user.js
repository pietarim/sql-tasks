require('dotenv').config()
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  active_session: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { 
  sequelize,
  underscored: true,
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  modelName: 'user' })

module.exports = User