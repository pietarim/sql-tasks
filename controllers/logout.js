const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware') 
const User = require('../models/user')

router.delete('/', tokenExtractor, async (request, response, next) => {
  const [modifiedColumns] = await User.update({ active_session: false }, { where: {
    id: request.decodedToken.id
  } })
  if (modifiedColumns === 1) {
    return response.status(204).end()
  } else {
    const error = new Error('token missing or invalid')
    next(error)
  }
})

module.exports = router