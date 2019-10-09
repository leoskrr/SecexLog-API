module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        nome: DataTypes.STRING,
        cargo: DataTypes.STRING,
        login: DataTypes.STRING,
        senha: DataTypes.STRING,
    })

    return User;
}