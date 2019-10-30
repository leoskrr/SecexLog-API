const Sequelize = require('sequelize');

const { City } = require('../models');
const { existsOrError, notExistsOrError } = require('../utils/validation');


const Operation = Sequelize.Op;


module.exports = {

    //Show all cities
    index(req, res){
        City.findAll()
            .then(cities => res.json(cities))
            .catch(err => res.status(500).send(err));
    }, 
    

    //Saving Users city information
    async store(req,res){
        try {
            const city = { ...req.body };

            existsOrError(city.name, "O nome da cidade deve ser informado");
            // existsOrError(city.cBase, "Por favor informe se é uma cidade vase");
            // existsOrError(city.cAuditada, "Por favor informe se é uma cidade auditada");
            // existsOrError(city.initDataFeriado, "Por favor informe a data inicial do feriado");
            // existsOrError(city.endDataFeriado, "Por favor informe a data final do feriado");
            // existsOrError(city.initDataCheia, "Por favor informe a data inicial da cheia");
            // existsOrError(city.endDataCheia, "Por favor informe a data final da cheia");


            let resultFromDb = await City.findOne({
                where: {name = city.name}
            });
            notExistsOrError(resultFromDB, `Já existe uma cidade cadastrada com o nome ${city.name}`);

            City.create()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));

        } catch (error) {
            return res.status().send(error);
        }
    },

    async show(req, res){
            let checkId = false;
            const cityData = req.params.data;

            if(!isNaN(cityData)) checkId = true;

            if(checkId){
                City.findOne({
                    where: {name : cityData}
                })
                .then(city => res.json(city))
                .catch(err => res.status(500).send(err));
            }
            else {
                City.findAll({
                    where: {
                        name: { [Operation.like]: `%${cityData}%` }
                    }
                })
                    .then(cities => res.json(cities))
                    .catch(err => res.status(500).send(err));
            }
    },

    //Updating a city status
    async update(req, res){
        const cityId = req.params.data;
        const  city = { ...req.body };

        try {
            let resultFromDB = await City.findOne({
                where: { name: city.name }
            });
        
            if(resultFromDB.name !== city.name)
                 notExistsOrError(resultFromDB, `Já existe uma cidade cadastrada com o nome ${city.name}`);
    
        } catch (error) {
            return res.status().send(err);
        }

        City.findOne({
            where:{
                id: cityId
            }
        }).then(resultFromDB => {
            if (resultFromDB) {
                resultFromDB.update({
                    ...city,
                })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err));
            }
        })

    },


    // This function deletes an city by id 
    async delete(req, res){
        const cityId  = req.params.data;

        try {
            const resultFromDB = await User.findOne({
                where: {
                    id: cityId
                }
            })

            existsOrError(resultFromDB, "Não foi encontrada uma cidade com o ID informado");


        } catch (error) {
            return res.status(500).send(error);
        }

        City.destroy({
            where: {id : userId}
        })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err));
    }

}