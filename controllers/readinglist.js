const router = require('express').Router()
const { ReadingList, Book } = require('../models')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  try {
    const newReadingList = await ReadingList.create({ blogId, userId })
    res.status(201).json(newReadingList)
  } catch(e) {
    console.log(e.message)
    res.status(400).end()
  }
})

module.exports = router