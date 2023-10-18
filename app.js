/* const config = require('./utils/config') */
const express = require('express')
const app = express()
/* require('express-async-errors') */
const cors = require('cors')
const readinglistRouter = require('./controllers/readinglist')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/author')
const middleware = require('./util/middleware')
const { connectToDatabase } = require('./util/db')
/* const logger = require('./utils/logger')*/
/* const { main } = require('./models/blog') */


/* logger.info('connecting to', config.MONGODB_URI) */ 



app.use(cors())
app.use(express.static('build'))

const start = async () => {
  try {
    await connectToDatabase()
    console.log('connection is a o k')
  } catch {
    console.log('connection failed')
  }
}

start()

/* main() */
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/author', authorRouter)
app.use('/api/readinglist', readinglistRouter)

/* if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')  
  app.use('/api/testing', testingRouter)
} */

app.use('/api/users', usersRouter)
/* app.use(middleware.tokenExtractor) */


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app