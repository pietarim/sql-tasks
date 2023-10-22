const router = require('express').Router()
const { Blog, User } = require('../models')
require('express-async-errors')
/* const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config') */
const { Op } = require('sequelize')
const { tokenExtractor, isActiveSession } = require('../util/middleware')
/* const User = require('../models/user') */
/* const middleware = require('../util/middleware') */

/* const isActiveSession = (req, res, next) => {
  const userId = req.decodedToken.id
  const activeUser = User.findByPk(userId).where('activeSession', true)
  if (!activeUser) {
    return res.status(401).json({ error: 'session expired' })
  }
  next()
} */


/* const tokenExtractor = (req, res, next) => {
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
} */

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

router.post('/', tokenExtractor, isActiveSession, async (request, response) => {
  console.log('post polkastu käyntiin')
  const body = request.body

  /* try { */
  const newBlog = await Blog.create({ ...body, userId: request.decodedToken.id })
  /* const newBlog = await blog.save() */
  if (newBlog) {
    response.status(201).json(newBlog)
  } else {
    response.status(400).end()
  }
  /* } catch(e) {
    if (e.message.includes('Validation max on year failed') || e.message.includes('Validation min on year failed')) {
      return response.status(400).json({ error: 'year must be between 1991 and 2021' })
    }
    console.log(e)
    console.log('ennen viimeistä riviä post ketjussa')
    response.status(400).end()
  } */
})

router.delete('/:id', blogFinder, tokenExtractor, isActiveSession, async (request, response) => {
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

router.put('/:id', blogFinder, tokenExtractor, isActiveSession, (request, response) => {
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