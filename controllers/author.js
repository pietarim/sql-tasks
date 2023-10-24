const router = require('express').Router()
const { User, Blog } = require('../models')
require('express-async-errors')
const { Sequelize } = require('sequelize')

// eslint-disable-next-line no-unused-vars
router.get('/', async (req, res, next) => {
  const blogs = await Blog.findAll({
    group: ['blog.user_id', 'user.id'],
    attributes: 
      [
        [ Sequelize.fn('COUNT', Sequelize.col('title')), 'articles'],
        [ Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
        [ Sequelize.col('user.name'), 'author']
      ],
    include: {
      model: User,
      attributes: []
    }
  })
  res.json(blogs)
})

module.exports = router