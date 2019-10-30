'use strict';
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    nome:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    cBase:{
      type:DataTypes.BOOLEAN
    },
    cAuditada: {
      type:DataTypes.BOOLEAN
    },
    initDataFeriado: {
      type:DataTypes.STRING
    },
    initDataCheia: {
      type:DataTypes.STRING
    },
    endDataFeriado:{
      type:DataTypes.STRING
    },
    endDataCheia: {
      type:DataTypes.STRING
    },
  }, {

    defaultScope: {
      attributes: { exclude: ['createdAt','updatedAt'] },
    }
  });
  City.associate = function(models) {
    // associations can be defined here
  };
  return City;
};