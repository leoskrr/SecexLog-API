'use strict';
module.exports = (sequelize, DataTypes) => {
  const Path = sequelize.define('Path', {
    initCidade: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O nome da cidade inicial não foi informado');
        }
      }
    },
    endCidade: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O nome da cidade final não foi informado');
        }
    }
  },
    modalTipo: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O tipo modal não foi informado');
        }
    }
    },
    prestNome: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O nome do prestador não foi informado');
        }
    }
    },
    dia: {
      type:DataTypes.INTEGER,
    
    },
    hora:{
      type:DataTypes.INTEGER,
      
    },
    duration: {
      type:DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('A duração não foi informada');
        }
    }
    },
    valor: {
      type:DataTypes.INTEGER
    },
    embarque: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O nome da cidade embarque não foi informado');
        }
    }
    },
    desembarque: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O nome da cidade desembarque não foi informado');
        }
    }
    },
    telefone: {
      type:DataTypes.STRING
    },
    email: {
      type:DataTypes.STRING
    },
    modal: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty(value) {
          if(!value)
            throw new Error('O modal não foi informado');
        }
    }
    },
  }, {
    defaultScope: {
      attributes: { exclude: ['createdAt','updatedAt'] },
    }
  });
  Path.associate = function(models) {
    // associations can be defined here
  };
  return Path;
};