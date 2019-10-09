const { User } = require('../models/User');

module.exports = {
    //Mostra todos os usuários
    index(req,res){

    },
    //Salva um usuário
    store(req,res){
        const user = {...req.body};


        return res.json({ nome });
    },
    //Mostra apenas um usuário
    show(req,res){

    },
    //Deleta um usuário
    delete(req,res){

    }


}