const Sequelize = require("sequelize");

const { Modal } = require("../models");
// const { existsOrError, notExistsOrError } = require("../utils/validation");

const Operation = Sequelize.Op;

/*

- Retornar:

[X] Qtd de modais cadastrados
[X] Qtd de avioes cadastrados
[ ] Qtd de taxis cadastrados
[ ] Qtd de barcos cadastrados
[ ] Qtd de lanchas a jato cadastradas
[ ] Qtd de voadeiras cadastradas
[ ] Qtd de rabetas cadastradas
[ ] feedbacks de cidades
[ ] feedbacks do sistema

*/
async function countAirplanes() {
    const numberOfAirplanes = Modal.findAndCountAll(
        {
            where: {
                name: {
                    [Operation.like]: '%avião%'
                }
            },
        })
    console.log(numberOfAirplanes)

    return numberOfAirplanes
}

async function countModals() {
    const numberOfModals = Modal.count();

    return numberOfModals;
}

module.exports = {
    async index(req, res) {
        const modals = await countModals();
        const airplanes = await countAirplanes();
        
        return res.send({
            modals: modals,
            airplanes: airplanes.count
        })
    }
}