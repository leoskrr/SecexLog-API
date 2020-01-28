const Sequelize = require('sequelize');
const crypto = require('crypto');

const sgMail = require('@sendgrid/mail');
var SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);


const { emailFeature } = require('../services/EmailFeature')
const { User } = require('../../models');
const { generatePassword, cryptPsw } = require('../../utils/ProcessPassword');

// const mailer = require('../../../modules/mailer');

module.exports = {

    async recoverPass(req, res) {

        const { email } = req.body;

        try {

            const user = await User.findOne({
                where: { email }
            })

            if(!user) return res.status(400).send('Usuário não encontrado');

            // const token = crypto.randomBytes(20).toString('hex');

            // const now = new Date();
            // now.setHours(now.getHours() + 1);

            const newPass = generatePassword();

            User.findOne({
                where: {
                    id: user.id
                }
            }).then(resultFromDB => {
                if(resultFromDB)
                {
                    resultFromDB.update({
                        // senhaResetToken: token,
                        // senhaResetExpires: now,
                        senha: cryptPsw(newPass)
                        
                    })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err));

                }
            })
            .catch(err => res.status(500).send(err));

            emailFeature(user.email, "Teste de login", `Sua senha é ${user.senha}`)
        
        } catch (err) {
            console.log(err);
            return res.status(400).send({ erro: 'erro ao recuperar senha' });
        }

    }

}