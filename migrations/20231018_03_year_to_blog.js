const { DataTypes, Op } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      minValue: 1991,
      maxValue: 2023,
    })

    await queryInterface.addConstraint('blogs', {
      type: 'check',
      fields: ['year'],
      name: 'check_year_range',
      where: {
        year: {
          [Op.gte]: 1991,
          [Op.lte]: 2023
        }
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}