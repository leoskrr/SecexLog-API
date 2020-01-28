'use strict';
require('dotenv/config');

var sendgrid = require('sendgrid')(process.env.MAIL_SENDGRID_APYKEY);


exports.sendgrid = async(to, subject, body) =>{
    sendgrid.send({
        to:to,
        from:"euclidesvasconcelos01@gmail.com",
        subject:subject,
        html:body
    })
}