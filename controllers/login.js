const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
  const body = request.body
  try {
    const user = await User.update({ activeSession: true }, { where: {
      username: body.username
    } })

    const passwordCorrect = body.password === 'secret'

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }

    if (user.disabled) {
      return response.status(401).json({
        error: 'account disabled, please contact admin'
      })  
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)

    response
      .status(200)
      .send(token)

  } catch(e) {
    console.log(e.message)
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
})

module.exports = router