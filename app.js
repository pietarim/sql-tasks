require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const readinglistRouter = require('./controllers/readinglist')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/author')
const logoutRouter = require('./controllers/logout')
const middleware = require('./util/middleware')
const { connectToDatabase } = require('./util/db')

app.use(cors())
app.use(express.static('build'))

const start = async () => {
  try {
    await connectToDatabase()
    console.log('Connected to database')
  } catch {
    console.log('connection failed')
  }
}

start()

app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/author', authorRouter)
app.use('/api/readinglist', readinglistRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app