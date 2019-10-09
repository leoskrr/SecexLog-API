const express = require('express');
/* IMPORTAÇÃO DOS CONTROLLERS */
const UserController = require('./app/controllers/UserController');
/* CONST PARA CRIAÇÃO DE ROTAS */
const Router = express.Router();
/*
    ROTAS 
*/

//USUÁRIO
Router.get('/users', (req,res)=>{
    return res.json({ message: "Servidor backend rodando!" });
});

Router.post('/users', UserController.store);

module.exports = Router;