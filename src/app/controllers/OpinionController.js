const Sequelize = require('sequelize');

const { Opinion } = require('../models');
const { existsOrError } = require('../utils/validation');


module.exports = {

    index(req, res) {
        Opinion.findAll()
            .then(opinions => res.json(opinions))
            .catch(err => res.status(500).send(err));
    },

    store(req, res) {
        //spread do formulário vindo do front-end
        const opiniao = { ...req.body };

        try {
            existsOrError(opiniao.titulo, "O título da opinião não foi informado");
            existsOrError(opiniao.desc, "A descrição da opinião está vazia");
        } catch (msg) {
            return res.status(400).json({ erro: msg });
        }
        Opinion.create({
            ...opiniao,
            title: opiniao.titulo
        })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err));
    },

    show(req, res) {

        

    },

    update(req, res) {

    },

    async delete(req, res) {
        const { id } = req.params; 

        try {
            const resultFromDB = await Opinion.findOne({
                where: {
                    id,
                }
            })
            existsOrError(resultFromDB, "Essa opinião não existe");
        } catch (msg) {
            return res.status(400).json({ erro: msg });
        }

        Opinion.destroy({
            where: { id }
        })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err));
    }
}