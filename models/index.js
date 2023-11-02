const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog, { as: 'blogs' })
Blog.belongsTo(User)
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })

module.exports = {
  Blog, User, ReadingList
}