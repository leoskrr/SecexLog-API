'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O nome do usuário não foi informado');
        }
      }
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O login do usuário não foi informado');
        }
      }
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O login do usuário não foi informado');
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('A senha do usuário não foi informada');
        }
      }
    }
  }, {
      defaultScope: {
        attributes: { exclude: ['password'] },
      }
    });
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};