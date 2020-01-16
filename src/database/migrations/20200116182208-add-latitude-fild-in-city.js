'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'city',
      'latitute',
      {
        type: Sequelize.STRING,
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'city',
      'latitute',
      {
        type: Sequelize.STRING,
      },
    );
  }
};
