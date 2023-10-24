const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

// eslint-disable-next-line no-unused-vars
router.post('/', async (request, response, next) => {
  const body = request.body
  const user = await User.findOne( { where: {
    username: body.username
  } })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    throw new Error('invalid username or password')
  }

  if (user.disabled) {
    throw new Error('account disabled, please contact admin')
  }

  await User.update({ active_session: true }, { where: {
    id: user.id
  } })

  const userForToken = {
    name: user.name,
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send(token)
})

module.exports = router