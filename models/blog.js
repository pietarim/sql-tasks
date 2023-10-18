require('dotenv').config()
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {    
    type: DataTypes.INTEGER,    
    allowNull: false,    
    references: { model: 'users', key: 'id' },
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1991,
      max: 2023,
    },
  },

}, { 
  sequelize,
  underscored: true,
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  modelName: 'blog' })

module.exports = Blog