const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  console.log('errorHandler = (error, request, response) => {' )
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.message === 'invalid token') {
    return response.status(401).json({ error: 'invalid token' })
  }
  return response.status(500).json({ error: error.message })
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = jwt.verify(authorization.substring(7), SECRET)
    console.log('BBBBBB')
    console.log(token)
    console.log(token.name)
    const user = await User.findByPk(token.id)
    console.log('AAAAAA')
    console.log(user)
    console.log(user.name)
    if (!user) {
      throw new Error('invalid token')
    }
    console.log(111111111)
    if (user.disabled) {
      throw new Error('account disabled, please contact admin')
    }
    console.log(2222222222)
    if (!user.active_session) {
      throw new Error('invalid token')
    }
    console.log(3333333333)
    req.decodedToken = token
  }  else {
    throw new Error('invalid token') 
  }  
  next()
}

const isActiveSession = (req, res, next) => {
  console.log('isActiveSession = (req, res, next) => { req.decodedToken')
  console.log(req.decodedToken)
  const userId = req.decodedToken.id
  const activeUser = User.findByPk(userId, {
    where: {
      activeSession: true
    }
  })
  if (!activeUser) {
    const error = new Error('session expired')
    next(error)
  }
  next()
}

module.exports = {
  isActiveSession,
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}