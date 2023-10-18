/* const app = require('./app')
const config = require('./util/config')
const logger = require('./util/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
}) */
const app = require('./app')
const { PORT } = require('./util/config')

/* const express = require('express')
const app = express() */

/* const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
app.use(express.json())

const blogsRouter = require('./controllers/blogs') */


/* app.use('/api/notes', blogsRouter) */

/* const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start() */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})