const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

// eslint-disable-next-line no-unused-vars
router.post('/', async (req, res, next) => {
  const { blogId, userId } = req.body
  const newReadingList = await ReadingList.create({ blog_id: blogId, user_id: userId })
  res.status(201).json(newReadingList)
})

// eslint-disable-next-line no-unused-vars
router.put('/:id', tokenExtractor, async (req, res, next) => {
  const userId = req.decodedToken.id
  const { id } = req.params
  const { read } = req.body
  const readingList = await ReadingList.findByPk(id, { where: { user_id: userId } })
  if (!readingList) {
    throw new Error('404')
  }
  if (readingList.user_id !== userId) {
    throw new Error('unauthorized')
  }
  await ReadingList.update({ read }, { where: { id } })
  res.status(204).end()
})

module.exports = router