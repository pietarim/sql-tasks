const app = require('./app')
const { PORT } = require('./util/config')

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})