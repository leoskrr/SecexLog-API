'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Cities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING
      },
      cBase: {
        type: Sequelize.BOOLEAN
      },
      cAuditada: {
        type: Sequelize.BOOLEAN
      },
      initDataFeriado: {
        type: Sequelize.STRING
      },
      initDataCheia: {
        type: Sequelize.STRING
      },
      endDataFeriado: {
        type: Sequelize.STRING
      },
      endDataCheia: {
        type: Sequelize.STRING
      },
      interdicaoTrecho:{
        type: Sequelize.BOOLEAN
      },
      obsInterdicao: {
        type: Sequelize.TEXT
      },
      obsCidade: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Cities');
  }
};