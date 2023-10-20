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

module.exports = router