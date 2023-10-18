const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)
Blog.hasMany(ReadingList)
User.hasMany(ReadingList)

module.exports = {
  Blog, User, ReadingList
}