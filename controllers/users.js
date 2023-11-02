const router = require('express').Router()
const { User, Blog } = require('../models')
require('express-async-errors')

// eslint-disable-next-line no-unused-vars
router.get('/:id', async (req, res, next) => {
  const id = req.params.id
  const read = req.query.read
  const userId = parseInt(id)
  if (read === undefined) {
    const user = await User.findByPk((userId), {
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: ['title', 'author', 'url', 'likes', 'id'],
          through: {
            attributes: ['id', 'read']
          }
        }
      ]
    })
    res.json(user)
  } else if (read === 'true' || read === 'false') {
    const isRead = read === 'true'
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: ['title', 'author', 'url', 'likes', 'id'],
          through: {
            attributes: ['id', 'read'],
            where: { read: isRead },
          }
        }
      ]
    })
    res.json(user)
  }
})

// eslint-disable-next-line no-unused-vars
router.get('/', async (req, res, next) => {
  const users = await User
    .findAll({
      include: {
        model: Blog,
        as: 'blogs',
        attributes: ['title', 'author', 'url', 'likes'],
      }
    })
  if (!users) {
    throw new Error('no users found')
  }
  res.json(users)
})

// eslint-disable-next-line no-unused-vars
router.put('/:username', async (req, res, next) => {
  const newUsername = req.body.username
  const count = await User.update({ username: newUsername }, {
    where: {
      username: req.params.username
    }
  })
  console.log(count)
  if (count[0] !== 0) {
    res.status(204).end()
  } else {
    throw new Error(404)
  }
})

// eslint-disable-next-line no-unused-vars
router.post('/', async (req, res, next) => {
  const body = req.body
  const newUser = await User.create(body)
  res.status(201).json(newUser)
})

module.exports = router