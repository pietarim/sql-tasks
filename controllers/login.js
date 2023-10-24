const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findOne( { where: {
    username: body.username
  } })

  console.log(user)
  const passwordCorrect = body.password === 'secret'
  console.log(passwordCorrect)

  if (!(user && passwordCorrect)) {
    throw new Error('invalid username or password')
    /* console.log('invalid username or password')
    return response.status(401).json({
      error: 'invalid username or password'
    }) */
  }

  if (user.disabled) {
    throw new Error('account disabled, please contact admin')
    /* console.log('account disabled, please contact admin')
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })  */ 
  }

  await User.update({ active_session: true }, { where: {
    id: user.id
  } })
  
  console.log(777777777)
  console.log(user.name)
  console.log({
    name: user.name,
    username: user.username,
    id: user.id,
  })

  const userForToken = {
    name: user.name,
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send(token)

  /* } catch(e) {
    console.log(e.message)
    return response.status(401).json({
      error: 'invalid username or password'
    })
  } */
})

module.exports = router