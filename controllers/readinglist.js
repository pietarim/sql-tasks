const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  try {
    const newReadingList = await ReadingList.create({ blog_id: blogId, user_id: userId })
    res.status(201).json(newReadingList)
  } catch(e) {
    console.log(e.message)
    res.status(400).end()
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id
  const { id } = req.params
  const readingList = await ReadingList.findByPk(id, { where: { user_id: userId } })
  if (!readingList) {
    throw new Error('reading list not found')
  }
  await ReadingList.update({ read: true }, { where: { id } })
  res.status(204).end()
})

module.exports = router