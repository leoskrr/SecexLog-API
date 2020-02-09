require('dotenv/config');

const Sequelize = require("sequelize");
const pdf = require('html-pdf');
const path = require('path');

const pdfTemplate = require('../../../resources/documents/pathPdf');
const mailer = require('../../../modules/mailer');
const { Path, Provider } = require("../../models");

const Operation = Sequelize.Op;

async function findPlaces(city1, city2, day, hour, provider) {
    const path = await Path.findOne({
        where: {
            initCidade: city1,
            endCidade: city2,
            dia: { [Operation.like]: `%${day}%` },
            hora: { [Operation.like]: `%${hour}%` },
            prestNome: provider
        }
    })

    return {
        departure: path !== null ? path.departure : "não registrado",
        arrival: path !== null ? path.arrival : "não registrado",
    }
}

async function findProviderInfos(name) {
    const provider = await Provider.findOne({
        where: {
            nome: name
        }
    })
    return {
        name: name,
        email: provider !== null ? provider.email : "não registrado",
        number: provider !== null ? provider.telefone : "não registrado"
    }
}

module.exports = {

    async create(req, res) {
        const userEmail = req.query.email;
        var data = {
            ...req.body,
            going: {
                ...req.body.going,
                provider: await findProviderInfos(req.body.going.provider),
                places: await findPlaces(req.body.cityDeparture, req.body.cityRegress, req.body.going.departure.day, req.body.going.departure.time, req.body.going.provider)
            },
            back: {
                ...req.body.back,
                provider: await findProviderInfos(req.body.going.provider),
                places: await findPlaces(req.body.cityRegress, req.body.cityDeparture, req.body.back.departure.day, req.body.back.departure.time, req.body.back.provider)
            }
        }

        pdf.create(pdfTemplate(data), {}).toFile('viagem-detalhes.pdf', (err) => {
            if (err)
                return res.send(Promise.reject());
            console.log(data);
            mailer.sendMail({
                to: userEmail,
                from: process.env.ACCOUNT_EMAIL,
                template: '/travel-details',
                subject: 'SecexLog - Detalhes da Viagem',
                attachments: [
                    {
                        filename: 'viagem-detalhes.pdf',
                        path: path.join(__dirname, '../../../../viagem-detalhes.pdf'),
                        contentType: 'application/pdf'
                    }
                ]
            })
        });
        return res.status(204).send();
    },

    fetch(req, res) {
        res.sendFile(path.join(__dirname, '../../../../viagem-detalhes.pdf'))
    }
}