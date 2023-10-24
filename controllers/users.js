const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
require('express-async-errors')
const { tokenExtractor/* , isActiveSession */ } = require('../util/middleware')

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

// eslint-disable-next-line no-unused-vars
router.get('/:id', async (req, res, next) => {
  const id = req.params.id
  const read = req.query.read
  const userId = parseInt(id)
  if (read === undefined) {
    const user = await User.findByPk((userId), {
      include: [
        /* {
          model: Blog,
          as: 'blogs',
          attributes: ['title', 'author', 'url', 'likes', 'id']
        }, */
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

router.get('/', async (req, res) => {
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

router.put('/:username', async (req, res) => {
  const newUsername = req.body.username
  /* const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) { */
  const count = await User.update({ username: newUsername }, {
    where: {
      username: req.params.username
    }
  })
  if (count) {
    console.log(count)
    res.status(204).end()
  } else {
    throw new Error('Something went wrong')
  }
  /* } else {
    throw new Error('user not found')
  } */
})

router.post('/', async (req, res) => {
  const body = req.body
  const newUser = await User.create(body)
  res.status(201).json(newUser)
})

module.exports = router