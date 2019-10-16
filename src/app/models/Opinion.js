'use strict';
module.exports = (sequelize, DataTypes) => {
  const Opinion = sequelize.define('Opinion', {
    title: DataTypes.STRING,
    desc: DataTypes.TEXT
  }, {});
  Opinion.associate = function(models) {
    // associations can be defined here
  };
  return Opinion;
};