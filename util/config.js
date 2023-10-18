require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT || 3001
const SECRET = process.env.SECRET
/* const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI */

module.exports = {
  DATABASE_URL,
  PORT,
  SECRET
}