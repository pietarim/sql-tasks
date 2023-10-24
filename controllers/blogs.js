const router = require('express').Router()
const { Blog, User } = require('../models')
require('express-async-errors')
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (request, response, next) => {
  request.blog = await Blog.findByPk(request.params.id)
  next()
}

router.get('/', (request, response) => {
  const where = {}

  const search = request.query.search
  if (search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${search}%`
        }
      }
    ]
  }

  Blog
    .findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['username', 'name']
      },
      where,
      order: [
        ['likes', 'DESC']
      ]
    })
    .then(blogs => {
      response.json(blogs)
    })
    .catch(() => {
      response.status(400).end()
    })
})

// eslint-disable-next-line no-unused-vars
router.post('/', tokenExtractor, async (request, response, next) => {
  const body = request.body
  const author = request.decodedToken.name
  const newBlog = await Blog.create({ ...body, userId: request.decodedToken.id, author })
  if (newBlog) {
    return response.status(201).json(newBlog)
  } else {
    return response.status(400).end()
  }
})

router.delete('/:id', tokenExtractor, async (request, response) => {
  const count = await Blog.destroy({ where: { id: request.params.id, user_id: request.decodedToken.id } })
  if (count === 0) {
    return response.status(401).json({ error: 'unauthorized' })
  }
  return response.status(204).end()
})

// eslint-disable-next-line no-unused-vars
router.put('/:id', blogFinder, tokenExtractor, async (request, response, next) => {
  const matchingUser = User.findByPk(request.decodedToken.id)
  if (matchingUser.id) {
    return response.status(401).json({ error: 'unauthorized' })
  }
  request.blog.likes += 1
  const [numberOfAltereRows] = await Blog.update({ likes: request.blog.likes }, { where: { id: request.blog.id } })
  if (numberOfAltereRows === 0) {
    return response.status(400).end()
  }
  return response.status(204).json({ likes: request.blog.likes })
})

module.exports = router