const Sequelize = require('sequelize');

const { Path } = require('../models');
const { existsOrError, notExistsOrError } = require('../utils/validation');


module.exports = {

    Index(req, res){
        Path.findAll()
        .then(paths => res.json(paths))
        .catch(err => res.status(500).send(err));
    },

    async store(req, res){
        try {

            const path = { ...req.body };

            existsOrError(path.initCidade, "A cidade inicial deve ser informada");
            existsOrError(path.endCidade, "A cidade final deve ser informada");
            existsOrError(path.modalTipo, "O tipo modal ser informado");
            existsOrError(path.prestNome, "O nome do prestador deve ser informado");
            existsOrError(path.duration, "A duração do percurso deve ser informada");
            existsOrError(path.quilometragem, "A quilometragem deve ser informada");
            existsOrError(path.valor, "O valor da viagem deve ser informado");
            existsOrError(path.embarque, "A cidade embarque deve ser informada");
            existsOrError(path.desembarque, "A cidade desembarque deve ser informada");
            existsOrError(path.telefone, "O telefone do usuário deve ser informado");
            existsOrError(path.email, "A email do usuário deve ser informada");
            existsOrError(path.modal, "A modal da viagem deve ser informada");


            Path.create()
                .then(_ => res.status(204).send() )
                .catch(err => res.status(500).send(err));


        } catch (error) {
            return res.status(500).send(error)
        }
    },


    async show(req, res){
        let checkId = false;
        const pathData = req.params.data;

        if(!isNaN(pathData)) checkId = true;

        if(checkId){
            Path.findOne({
                where: {name : pathData}
            })
            .then(path => res.json(path))
            .catch(err => res.status(500).send(err));
        }
        else {
            Path.findAll({
                where: {
                    name: { [Operation.like]: `%${pathData}%` }
                }
            })
                .then(cities => res.json(cities))
                .catch(err => res.status(500).send(err));
        }
    },

    async update(req, res){
        const pathId = req.params.data;
        const path = { ...req.body }

        try {

            existsOrError(path.initCidade, "A cidade inicial deve ser informada");
            existsOrError(path.endCidade, "A cidade final deve ser informada");
            existsOrError(path.modalTipo, "O tipo modal ser informado");
            existsOrError(path.prestNome, "O nome do prestador deve ser informado");
            existsOrError(path.duration, "A duração do percurso deve ser informada");
            existsOrError(path.quilometragem, "A quilometragem deve ser informada");
            existsOrError(path.valor, "O valor da viagem deve ser informado");
            existsOrError(path.embarque, "A cidade embarque deve ser informada");
            existsOrError(path.desembarque, "A cidade desembarque deve ser informada");
            existsOrError(path.telefone, "O telefone do usuário deve ser informado");
            existsOrError(path.email, "A email do usuário deve ser informada");
            existsOrError(path.modal, "A modal da viagem deve ser informada");
            
            let resultFromDB = await User.findOne({
                where: { initCidade: path.initCidade }
            });

            if(resultFromDB.initCidade !== path.initCidade)
                notExistsOrError(resultFromDB, `Já existe uma cidade com o nome ${path.initCidade}`);

            resultFromDB = await User.findOne({
                where: { endCidade: path.endCidade }
            });

            if(resultFromDB.endCidade !== path.endCidade)
                notExistsOrError(resultFromDB, `Já existe um usuário com o email ${path.endCidade}`);

        } catch (msg) {
            return res.status(400).send(msg);
        }

        User.findOne({
            where: {
                id: pathId
            }
        }).then(resultFromDB => {
            if (resultFromDB) {
                resultFromDB.update({
                    ...path,
                })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err));
            }
        })
            .catch(err => res.status(500).send(err));

    },

    async delete(req, res){
        const pathId = req.params.data;

        try {
            const resultFromDB = await Path.findOne({
                where: {
                    id: pathId
                }
            })

            existsOrError(resultFromDB, "Não foi encontrado um trajeto com o ID informado");

        } catch (msg) {
            return res.status(400).send(msg);
        }

        Path.destroy({
            where: { id: pathId }
        })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err));
    }
}