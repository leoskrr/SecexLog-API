require('dotenv/config');

const pdf = require('html-pdf');
const path = require('path');
const pdfTemplate = require('../../../resources/documents/pathPdf');
const mailer = require('../../../modules/mailer');

module.exports = {
    //POST - PDF GENERATION AND FETCHING OF THE DATA
    create(req, res) {
        const userEmail = req.query.email;

        pdf.create(pdfTemplate(req.body), {}).toFile('viagem-detalhes.pdf', (err) => {
            if (err)
                return res.send(Promise.reject());

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

            return res.status(204).send();
        });
    },

    fetch(req, res) {
        res.sendFile(path.join(__dirname, '../../../../viagem-detalhes.pdf'))
    }
}