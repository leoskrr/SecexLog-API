const Sequelize = require("sequelize");

const { Modal, City, Opinion } = require("../models");

const Operation = Sequelize.Op;

async function getFeedbacksOfSystem(){
    const feedbacks = await Opinion.findAll({
        attributes: ['titulo','desc']
    });

    return feedbacks;
}

async function getFeedbackOfCities(){
    const feedbacks = await City.findAll({
        attributes: ['nome','obsCidade', 'obsInterdicao']
    });

    return feedbacks;
}

async function getFeedbacks(){ 
    const feedbacksOfCities = await getFeedbackOfCities();
    const feedbacksOfSystem = await getFeedbacksOfSystem();

    return { 
        cities: feedbacksOfCities,
        system: feedbacksOfSystem
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