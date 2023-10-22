const router = require('express').Router()
const { User, Blog } = require('../models')
require('express-async-errors')
const { tokenExtractor, isActiveSession } = require('../util/middleware')

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.get('/:id', async (req, res) => {
  const { read, id } = req.params
  const userId = parseInt(id)
  if (read === undefined) {
    try {
      const user = await User.findByPk((userId), {
        include: [
          {
            model: Blog,
            as: 'blogs',
            attributes: ['title', 'author', 'url', 'likes', 'id']
          },
        ]
      })
      res.json(user)
    } catch (e) {
      console.log(e)
      res.status(400).end()
    }
  } else if (read === true) {
    try {
      const user = await User.findByPk((userId), {
        include: [
          {
            model: Blog,
            as: 'blogs',
            attributes: ['title', 'author', 'url', 'likes', 'id']
          },
          {
            model: Blog,
            as: 'readinglists',
            attributes: ['title', 'author', 'url', 'likes', 'id'],
            where: { read: true },
            through: {
              attributes: ['id', 'read']
            }

          }
        ]
      })
      res.json(user)
    } catch (e) {
      console.log(e.message)
      res.status(400).end()
    }
  } else {
    try {
      const user = await User.findByPk((userId), {
        include: [
          {
            model: Blog,
            as: 'blogs',
            attributes: ['title', 'author', 'url', 'likes', 'id']
          },
          {
            model: Blog,
            as: 'readinglists',
            attributes: ['title', 'author', 'url', 'likes', 'id'],
            where: { read: false },
            through: {
              attributes: ['id', 'read']
            }

          }
        ]
      })
      res.json(user)
    } catch (e) {
      console.log(e)
      res.status(400).end()
    }
  }
})

router.get('/', async (req, res) => {
  User
    .findAll({
      include: {
        model: Blog,
        as: 'blogs',
        attributes: ['title']
      }
    })
    .then(users => {
      res.json(users)
    })
    .catch((error) => {
      console.log(error.message)
      res.status(400).end()
    }
    )
})

/* aaaaaaaaaaaa uusi */

router.put('/:username', tokenExtractor, isAdmin, isActiveSession, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

/* aaaaaaaa uusi */

router.post('/', async (req, res) => {
  const body = req.body
  try {
    const newUser = await User.create(body)
    res.status(201).json(newUser)
  }
  catch {
    return res.status(400).json({ error: 'username must be unique' })
  }
})

router.put('/:username', async (req, res) => {
  try {  
    const username = req.params.username
    const newUserName = req.body.username
    await User.update({ username: newUserName }, { where: { username: username } })
    res.status(204).end()
  } catch {
    res.status(400).end()
  }
})

module.exports = router