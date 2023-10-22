const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware') 
const User = require('../models/user')

router.delete('/', tokenExtractor, async (request, response) => {
  if (!request.decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  try {
    const loggedOutUser = await User.update({ activeSession: false }, { where: {
      id: request.decodedToken.id
    } })
    if (loggedOutUser) {
      return response.status(204).end()
    } else {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
  } catch (e) {
    console.log(e.message)
    return response.status(500).end()
  }
})

module.exports = router