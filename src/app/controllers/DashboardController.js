const Sequelize = require("sequelize");

const { Modal, City, Opinions } = require("../models");
// const { existsOrError, notExistsOrError } = require("../utils/validation");

const Operation = Sequelize.Op;

/*

- Retornar:

[X] Qtd de modais cadastrados
[X] Qtd de avioes cadastrados
[X] Qtd de taxis cadastrados
[X] Qtd de barcos cadastrados - boat
[X] Qtd de lanchas a jato cadastradas - motorboat
[X] Qtd de voadeiras cadastradas
[X] Qtd de rabetas cadastradas
[X] feedbacks de cidades
[ ] feedbacks do sistema

*/
async function getFeedbackOfCities(){
    const feedbacks = await City.findAll({
        attributes: ['nome','obsCidade', 'obsInterdicao'],
    });

    return feedbacks;
}

async function getFeedbacks(){ 
    const feedbacksOfCities = await getFeedbackOfCities();

    return { 
        cities: feedbacksOfCities
    }
}

async function countThisModal(modal) {
    const numberOfModals = await Modal.findAndCountAll(
        {
            where: {
                name: {
                    [Operation.like]: `%${modal}%`
                }
            },
        })

    return numberOfModals
}

async function countModals() {
    const numberOfModals = await Modal.count();
    const airplanes = await countThisModal("avião");
    const taxis = await countThisModal("táxi");
    const boats = await countThisModal("barco");
    const motorboats = await countThisModal("lancha");
    const voadeiras = await countThisModal("voadeira");
    const rabetas = await countThisModal("rabeta");

    return {
        count: numberOfModals,
        types: {
            airplanes: airplanes.count,
            taxis: taxis.count,
            boats: boats.count,
            motorboats: motorboats.count,
            voadeiras: voadeiras.count,
            rabetas: rabetas.count,
        }
    };
}

module.exports = {
    async index(req, res) {
        const modals = await countModals();
        const feedbacks = await getFeedbacks();

        return res.send({
            modals: modals,
            feedbacks: feedbacks
        })
    }
}