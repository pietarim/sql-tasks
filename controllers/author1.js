const router = require('express').Router()
const { User, Blog } = require('../models')
require('express-async-errors')
const { Sequelize } = require('sequelize')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    group: 'user_id',
    attributes: 
      [
        [ Sequelize.fn('COUNT', Sequelize.col('title')), 'articles'],
        [ Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
        {
          include: {
            model: User,
            attributes: ['name']
          }
        }
      ],
  })
  res.json(blogs)
})