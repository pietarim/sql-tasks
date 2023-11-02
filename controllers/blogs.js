const router = require('express').Router()
const { Blog, User } = require('../models')
require('express-async-errors')
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (request, response, next) => {
  request.blog = await Blog.findByPk(request.params.id)
  next()
}

// eslint-disable-next-line no-unused-vars
router.get('/', async (request, response, next) => {
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

  const blog = await Blog
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
  
  if (!blog) {
    throw new Error('no blogs found')
  }

  response.json(blog)
})

// eslint-disable-next-line no-unused-vars
router.post('/', tokenExtractor, async (request, response, next) => {
  const body = request.body
  const author = request.decodedToken.name
  const newBlog = await Blog.create({ ...body, userId: request.decodedToken.id, author })
  if (newBlog) {
    return response.status(201).json(newBlog)
  } else {
    throw new Error('bad request')
    /* return response.status(400).end() */
  }
})

// eslint-disable-next-line no-unused-vars
router.delete('/:id', tokenExtractor, async (request, response, next) => {
  const count = await Blog.destroy({ where: { id: request.params.id, user_id: request.decodedToken.id } })
  if (count === 0) {
    throw new Error('unauthorized')
  }
  return response.status(204).end()
})

// eslint-disable-next-line no-unused-vars
router.put('/:id', blogFinder, tokenExtractor, async (request, response, next) => {
  const { likes } = request.body
  const matchingUser = User.findByPk(request.decodedToken.id)
  if (matchingUser.id) {
    throw new Error('unauthorized')
  }
  const blog = await Blog.findByPk(request.params.id)
  if (!blog) {
    throw new Error('404')
  }
  blog.likes = likes
  const newBlog = await blog.save()
  return response.status(200).json(newBlog)
})

module.exports = router