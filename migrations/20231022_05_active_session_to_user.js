const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'active_session', {
      type: DataTypes.STRING,
      allowNull: true
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'active_session')
  },
}