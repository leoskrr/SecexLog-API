const Sequelize = require("sequelize");

const { Modal } = require("../models");
// const { existsOrError, notExistsOrError } = require("../utils/validation");

const Operation = Sequelize.Op;

/*

- Retornar:

[X] Qtd de modais cadastrados
[X] Qtd de avioes cadastrados
[X] Qtd de taxis cadastrados
[ ] Qtd de barcos cadastrados - boat
[ ] Qtd de lanchas a jato cadastradas - motorboat
[ ] Qtd de voadeiras cadastradas
[ ] Qtd de rabetas cadastradas
[ ] feedbacks de cidades
[ ] feedbacks do sistema

*/

async function countThisModal(modal) {
    const numberOfModals = Modal.findAndCountAll(
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
    const numberOfModals = Modal.count();

    return numberOfModals;
}

module.exports = {
    async index(req, res) {
        const modals = await countModals();
        const airplanes = await countThisModal("avião");
        const taxis = await countThisModal("táxi");
        
        return res.send({
            modals: modals,
            airplanes: airplanes.count,
            taxis: taxis.count
        })
    }
}