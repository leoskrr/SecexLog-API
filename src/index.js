// Importações
const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(routes);

app.listen('3333',()=>{
    console.log('Backend executado e rodando na porta 3333\nlocalhost:3333\nCTRL + C para parar');
})