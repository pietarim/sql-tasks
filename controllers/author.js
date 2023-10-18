const router = require('express').Router()
const { User, Blog } = require('../models')
require('express-async-errors')
const { Sequelize } = require('sequelize')
/* const { Op } = require('sequelize') */

router.get('/', async (req, res) => {
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
  /* console.log('yhdistelmäkysely polkastu käyntiin')
  const authors = await User.findAll({
    attributes: [
      'id',
      'name',
    ],
    include: {
      model: Blog,
      attributes: [[ Sequelize.fn('COUNT', Sequelize.col('title')), 'articles']],
      group: ['user_id']
    },
  })

  res.json(authors) */
})

/* router.get('/', async (req, res) => {
  const authors = await User.findAll({
    include: {
      model: Blog,
      attributes: ['title']
    }
  })
  res.json(authors)
}) */

module.exports = router