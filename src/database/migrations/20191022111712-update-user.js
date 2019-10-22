'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Users', 'senhaResetToken', {
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'senhaResetExpires', {
          type: Sequelize.DATE,
        }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Users', 'senhaResetToken', { transaction: t }),
        queryInterface.removeColumn('Users', 'senhaResetExpires', { transaction: t })
      ])
    })
  }
};
