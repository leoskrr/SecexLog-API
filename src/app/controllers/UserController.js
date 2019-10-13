const Sequelize = require('sequelize');
const { User } = require('../models');
const { cryptPsw } = require('../utils/ProcessPassword');

const Op = Sequelize.Op;

module.exports = {
    //Mostra todos os usuários
    index(req, res) {
        User.findAll()
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err));
    },
    //Salva um usuário
    store(req, res) {
        const user = { ...req.body };
        //fazendo a criptografia Hash da senha do usuário
        user.password = cryptPsw(user.password);

        User.create(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err));
    },
    //Mostrar usuário(s) resultante(s) de pesquisa por id ou por nome
    show(req, res) {
        let checkById = false;

        const userData = req.params.data;
        
        /*
        Verifica se o dado passado para a url é um número, para, assim, 
        fazer (ou não) uma pesquisa por id
        */
        if(!isNaN(userData)) checkById = true; 

        /* 
        Caso a condição seja verdadeira será feita uma pesquisa por id,
        retornando, assim, apenas um usuário. Caso seja falsa, será feita
        uma pesquisa por nome, retornado vários usuários. 
        */
        if(checkById)
        {
            User.findOne({ 
                where: {
                        id: userData
                    }
            })
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err));
        }
        else{
            User.findAll({
                where: {
                    name: { [Op.like]: `%${userData}%` }
                }
            })
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err));
        }

    },
    //Atualiza um usuário
    update(req, res){

    },
    //Deleta um usuário
    delete(req, res) {

    }


}