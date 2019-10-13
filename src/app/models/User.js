module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        position: DataTypes.STRING,
        login: DataTypes.STRING,
        password: DataTypes.STRING,
    },
    /*
      Usando as options do sequelize para não retornar a(s) senha(s) do(s) usuário(s)
      quando chamado um 'index'/'show'
    */
    {
        defaultScope: {
            attributes: { exclude: ['password'] },
        }
    });
    
    return User;
}