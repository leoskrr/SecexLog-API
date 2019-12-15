'use strict';
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    nome:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    relations:{
      type: DataTypes.STRING,
      allowNull: false
    },
    cBase:{
      type:DataTypes.BOOLEAN
    },
    cAuditada: {
      type:DataTypes.BOOLEAN
    },
    initDataCheia: {
      type:DataTypes.STRING
    },
    endDataCheia: {
      type:DataTypes.STRING
    },
    obsInterdicao: {
      type: DataTypes.TEXT
    },
    obsCidade: {
      type: DataTypes.TEXT
    }
  }, {
<<<<<<< HEAD
    
=======

>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
    defaultScope: {
      attributes: { exclude: ['createdAt','updatedAt'] },
    }
  });
<<<<<<< HEAD
  
  City.associate = (models) =>{
    City.belongsToMany(models.City, {
        through: 'cityProviders',
        as : 'providers',
        foreignKey: 'CityId'        
        });
    };
=======
  City.associate = function(models) {
    // associations can be defined here
  };
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
  return City;
};