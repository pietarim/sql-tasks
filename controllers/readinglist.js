const router = require('express').Router()
const { ReadingList } = require('../models')

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

router.put('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const readingList = await ReadingList.findByPk(id)
    readingList.read = true
    await readingList.save({ read: readingList.read })
    res.status(204).end()
  } catch(e) {
    console.log(e.message)
    res.status(400).end()
  }
})

module.exports = router