const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog, { as: 'blogs' })
Blog.belongsTo(User)
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'to_read' })

module.exports = {
  Blog, User, ReadingList
}