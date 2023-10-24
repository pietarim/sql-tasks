const { DATABASE_URL } = require('./config')
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL)

/* const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: false
    }
  },
}) */

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },  
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}  

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()}

const rollbackToFirst = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down({ to: 0 })
}

module.exports = { connectToDatabase, sequelize, rollbackMigration, rollbackToFirst }