const Sequelize = require('sequelize');

const { User } = require('../models');
const { cryptPsw } = require('../utils/ProcessPassword');
const { existsOrError, notExistsOrError } = require('../utils/validation');

const Operator = Sequelize.Op;

module.exports = {
    //Mostra todos os usuários
    index(req, res) {
        User.findAll()
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err));
    },
    //Salva um usuário
    async store(req, res) {
        const user = { ...req.body };
        //fazendo a criptografia Hash da senha do usuário
        if (user.password) user.password = cryptPsw(user.password);

        try {

            existsOrError(user.name, "O nome do usuário deve ser informado");
            existsOrError(user.login, "O login do usuário deve ser informado");
            existsOrError(user.position, "O cargo do usuário deve ser informado");
            existsOrError(user.password, "A senha do usuário deve ser informada");

            const resultFromDB = await User.findOne({
                where: {
                    login: user.login
                }
            });
            notExistsOrError(resultFromDB, `Já existe um usuário com o login ${user.login}`)
        } catch (msg) {
            return res.status(400).json({ erro: msg });
        }

        User.create(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err));
    },
    //Mostrar usuário(s) resultante(s) da pesquisa por id ou por nome
    async show(req, res) {
        let checkById = false;
        const userData = req.params.data;
        /*
        Verifica se o dado passado para a url é um número, para, assim, 
        fazer (ou não) uma pesquisa por id
        */
        if (!isNaN(userData)) checkById = true;

        /* 
        Caso a condição seja verdadeira será feita uma pesquisa por id,
        retornando, assim, apenas um usuário. Caso seja falsa, será feita
        uma pesquisa por nome, retornado vários usuários. 
        */
        if (checkById) {
            User.findOne({
                where: {
                    id: userData
                }
            })
                .then(user => res.json(user))
                .catch(err => res.status(500).send(err));
        }
        else {
            User.findAll({
                where: {
                    //Usando as operações do Sequelize para fazer consulta do tipo 'like'
                    name: { [Operator.like]: `%${userData}%` }
                }
            })
                .then(users => res.json(users))
                .catch(err => res.status(500).send(err));
        }

    },
    //Atualiza um usuário
    update(req, res) {
        const userId = req.params.data;
        const user = {... req.body }
        try {
            existsOrError(user.name, "O nome do usuário deve ser informado");
            existsOrError(user.login, "O login do usuário deve ser informado");
            existsOrError(user.position, "O cargo do usuário deve ser informado");
            existsOrError(user.password, "A senha do usuário deve ser informada");

        } catch (msg) {
            return res.status(400).json({ erro: msg });
        }

        User.findOne({
            where: {
                id: userId
            }
        }).then(resultFromDB => {
            if(resultFromDB)
            {
                resultFromDB.update({
                    name: user.name,
                    login: user.login,
                    position: user.position,
                    password: cryptPsw(user.password)
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));
            }
        })
        .catch(err => res.status(500).send(err));

    },
    //Deleta um usuário
    async delete(req, res) {
        const userId = req.params.data;

        try {
            const resultFromDB = await User.findOne({
                where: {
                    id: userId
                }
            })

            existsOrError(resultFromDB, "Não foi encontrado um usuário com o ID informado");

        } catch (msg) {
            return res.status(400).json({ erro: msg });
        }

        User.destroy({
            where: { id: userId }
        })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err));

    }


}