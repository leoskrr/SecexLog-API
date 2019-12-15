'use strict';
module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define('Provider', {
    nome: DataTypes.STRING,
    telefone: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }

    }
  }, {});
<<<<<<< HEAD
  Provider.associate = (models) =>{
    Provider.belongsToMany(models.City, {
        through: 'cityProviders',
        as : 'citys',
        foreignKey: 'Provider_Id'        
        });
    };
=======
  Provider.associate = function (models) {
    // associations can be defined here
  };
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
  return Provider;
};