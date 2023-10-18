require('dotenv').config()
const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, { 
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog' })

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT })
    blogs.map(blog => console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`))
    /* sequelize.close() */
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }

}

main()