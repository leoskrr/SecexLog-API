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

        return res.send({
            modals: modals,
        })
    }
}