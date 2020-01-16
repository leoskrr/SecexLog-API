'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'city',
      'longitude',
      {
        type: Sequelize.STRING,
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'city',
      'longitude',
      {
        type: Sequelize.STRING,
      },
    );
  }
};
