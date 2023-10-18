// eslint-disable-next-line no-unused-vars
const dummy = ( blogs ) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((acc, cur) => {
    return acc + cur.likes
  }, 0)
  return likes
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((acc, cur) => {
    return acc.likes > cur.likes ? acc : cur})
  return favorite
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(blog => blog.author)
  const authorsCount = authors.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1
    return acc
  }, {})
  const AuthorWithMostBlogs = Object.keys(authorsCount).reduce((acc, cur) => {
    return authorsCount[acc] > authorsCount[cur] ? acc : cur
  })
  return { author: AuthorWithMostBlogs, blogs: authorsCount[AuthorWithMostBlogs] }
}

const mostLikes = (blogs) => {
  const likesByAuthor = blogs.reduce((acc, cur) => {
    const { author, likes } = cur
    acc[author] = (acc[author] || 0) + likes
    return acc
  }, {})

  const authors = Object.keys(likesByAuthor)
  const authorsWithMostLikes = authors.reduce((acc, cur) => {
    return likesByAuthor[acc] > likesByAuthor[cur] ? acc : cur
  })
  return { author: authorsWithMostLikes, likes: likesByAuthor[authorsWithMostLikes] }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}