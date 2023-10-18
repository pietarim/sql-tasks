const router = require('express').Router()
const { Blog, User } = require('../models')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')
/* const User = require('../models/user') */
/* const middleware = require('../util/middleware') */

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)    
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }  
  }  else {
    return res.status(401).json({ error: 'token missing' })  
  }  
  next()
}

const blogFinder = async (request, response, next) => {
  console.log('blogFinder polkastu käyntiin')
  request.blog = await Blog.findByPk(request.params.id)
  next()
}

router.get('/', (request, response) => {
  const where = {}
  console.log('get polkastu käyntiin')

  const search = request.query.search
  console.log(search)
  console.log('search on yläpuolella')
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
    /* where.title = {
      [Op.substring]: search
    }
    where.author = {
      [Op.substring]: search
    } */
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

router.post('/', tokenExtractor, /*middleware.userExtractor, */ async (request, response) => {
  console.log('post polkastu käyntiin')
  const body = request.body

  try {
    const newBlog = await Blog.create({ ...body, userId: request.decodedToken.id })
    /* const newBlog = await blog.save() */
    if (newBlog) {
      response.status(201).json(newBlog)
    } else {
      response.status(400).end()
    }
  } catch(e) {
    if (e.message.includes('Validation max on year failed') || e.message.includes('Validation min on year failed')) {
      return response.status(400).json({ error: 'year must be between 1991 and 2021' })
    }
    console.log(e.message)
    response.status(400).end()
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (request, response) => {
  const matchingUser = User.findByPk(request.decodedToken.id)
  if (matchingUser.id) {
    return response.status(401).json({ error: 'unauthorized' })
  }
  request.blog.destroy()
    .then(() => {
      response.status(204).end()
    })
    .catch(() => {
      response.status(400).end()
    })
})

router.put('/:id', blogFinder, tokenExtractor, (request, response) => {
  const matchingUser = User.findByPk(request.decodedToken.id)
  if (matchingUser.id) {
    return response.status(401).json({ error: 'unauthorized' })
  }
  request.blog.likes += 1
  request.blog.save()
    .then(() => {
      response.status(204).send({ likes: request.blog.likes })
    })
    .catch(() => {
      response.status(400).end()
    })
})

module.exports = router