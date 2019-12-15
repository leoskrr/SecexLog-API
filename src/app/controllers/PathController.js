// const Sequelize = require('sequelize');

const { Path } = require('../models');
const { City } = require('../models');

<<<<<<< HEAD
const { existsOrError } = require('../utils/validation');
=======
const { existsOrError} = require('../utils/validation');
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a

// const Operation = Sequelize.Op;

module.exports = {

    index(req, res) {
        Path.findAll()
            .then(paths => res.json(paths))
<<<<<<< HEAD
            .catch(err => { console.log(err); return res.status(500).send(err) });
=======
            .catch(err => res.status(500).send(err));
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
    },

    async store(req, res) {
        try {

            const path = { ...req.body };

            existsOrError(path.initCidade, "A cidade inicial deve ser informada");
            existsOrError(path.endCidade, "A cidade final deve ser informada");
<<<<<<< HEAD
            existsOrError(path.modal, "O modal ser informado");
            existsOrError(path.prestNome, "O nome do prestador deve ser informado");
=======
            existsOrError(path.modalTipo, "O tipo modal ser informado");
            existsOrError(path.prestNome, "O nome do prestador deve ser informado");
            existsOrError(path.duration, "A duração do percurso deve ser informada");
            existsOrError(path.quilometragem, "A quilometragem deve ser informada");
            existsOrError(path.valor, "O valor da viagem deve ser informado");
            existsOrError(path.embarque, "O lugar de embarque deve ser informado");
            existsOrError(path.desembarque, "O lugar de desembarque deve ser informado");
            existsOrError(path.telefone, "O telefone do provedor deve ser informado");
            existsOrError(path.email, "O email do provedor deve ser informado");
            existsOrError(path.modal, "O modal da viagem deve ser informada");
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
            existsOrError(path.dia, "O dia do trajeto deve ser informado");
            existsOrError(path.hora, "A hora do trajeto deve ser informada");

            const initCityValidation = await City.findAll({
                where: {
                    nome: path.initCidade
                }
            })
<<<<<<< HEAD

            existsOrError(initCityValidation, `Não existe nenhuma cidade cadastrada com o nome ${initCityValidation.nome} no sistema.`);

=======
            
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
            const endCityValidation = await City.findAll({
                where: {
                    nome: path.endCidade
                }
            })
<<<<<<< HEAD

            existsOrError(endCityValidation, `Não existe nenhuma cidade cadastrada com o nome ${endCityValidation.nome} no sistema.`);

            Path.create(path)
                .then(_ => res.status(204).send())
                .catch(err => { console.log(err); return res.status(500).send(err) });


        } catch (error) {
            console.log(error);
=======
            console.log(initCityValidation)
            console.log(endCityValidation)

            existsOrError(initCityValidation, `Não existe nenhuma cidade cadastrada com o nome ${initCityValidation.nome} no sistema.`);
            existsOrError(endCityValidation, `Não existe nenhuma cidade cadastrada com o nome ${endCityValidation.nome} no sistema.`);



            Path.create(path)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));
            
            

        } catch (error) {
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
            return res.status(500).send(error)
        }
    },

    async show(req, res) {
<<<<<<< HEAD
        const { id } = req.params;

        Path.findOne({
            where: {
                id
=======
        // let checkId = false;
        const pathData = req.params.data;

        // if (!isNaN(pathData)) checkId = true;

        // if (checkId) {
        Path.findOne({
            where: {
                id: pathData
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
            }
        })
            .then(path => res.json(path))
            .catch(err => res.status(500).send(err));
<<<<<<< HEAD
    },

    async update(req, res) {
        const { id } = req.params;
=======
        // }
        // else {
        //     Path.findAll({
        //         where: {
        //             name: { [Operation.like]: `%${pathData}%` }
        //         }
        //     })
        //         .then(paths => res.json(paths))
        //         .catch(err => res.status(500).send(err));
        // }
    },

    async update(req, res) {
        const pathId = req.params.data;
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
        const path = { ...req.body }

        try {

            existsOrError(path.initCidade, "A cidade inicial deve ser informada");
            existsOrError(path.endCidade, "A cidade final deve ser informada");
<<<<<<< HEAD
            existsOrError(path.modal, "O modal ser informado");
            existsOrError(path.prestNome, "O nome do prestador deve ser informado");
            existsOrError(path.dia, "O dia do trajeto deve ser informado");
            existsOrError(path.hora, "A hora do trajeto deve ser informada");

            const initCityValidation = await City.findAll({
                where: {
                    nome: path.initCidade
                }
            })

            existsOrError(initCityValidation, `Não existe nenhuma cidade cadastrada com o nome ${initCityValidation.nome} no sistema.`);

            const endCityValidation = await City.findAll({
                where: {
                    nome: path.endCidade
                }
            })

            existsOrError(endCityValidation, `Não existe nenhuma cidade cadastrada com o nome ${endCityValidation.nome} no sistema.`);
=======
            existsOrError(path.modalTipo, "O tipo modal ser informado");
            existsOrError(path.prestNome, "O nome do prestador deve ser informado");
            existsOrError(path.duration, "A duração do percurso deve ser informada");
            existsOrError(path.quilometragem, "A quilometragem deve ser informada");
            existsOrError(path.valor, "O valor da viagem deve ser informado");
            existsOrError(path.embarque, "O local de embarque deve ser informado");
            existsOrError(path.desembarque, "O local de desembarque deve ser informado");
            existsOrError(path.telefone, "O telefone do provedor deve ser informado");
            existsOrError(path.email, "O email do provedor deve ser informado");
            existsOrError(path.modal, "O modal da viagem deve ser informado");

            // let resultFromDB = await Path.findOne({
            //     where: { initCidade: path.initCidade }
            // });

            // if(resultFromDB.initCidade !== path.initCidade)
            //     notExistsOrError(resultFromDB, `Já existe uma cidade com o nome ${path.initCidade}`);

            // resultFromDB = await Path.findOne({
            //     where: { endCidade: path.endCidade }
            // });

            // if(resultFromDB.endCidade !== path.endCidade)
            //     notExistsOrError(resultFromDB, `${path.endCidade}`);
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a

        } catch (msg) {
            return res.status(400).send(msg);
        }

        Path.findOne({
            where: {
<<<<<<< HEAD
                id
=======
                id: pathId
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
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

    async delete(req, res) {
<<<<<<< HEAD
        const { id } = req.params;
=======
        const pathId = req.params.data;
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a

        try {
            const resultFromDB = await Path.findOne({
                where: {
<<<<<<< HEAD
                    id
=======
                    id: pathId
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
                }
            })

            existsOrError(resultFromDB, "Não foi encontrado um trajeto com o ID informado");

        } catch (msg) {
            return res.status(400).send(msg);
        }

        Path.destroy({
<<<<<<< HEAD
            where: { id }
=======
            where: { id: pathId }
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
        })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err));
    }
}