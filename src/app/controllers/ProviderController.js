// const Sequelize = require('sequelize');


// const { Provider, Modal } = require('../models');
// const { existsOrError, notExistsOrError } = require("../utils/validation");
// const Operation = Sequelize.Op;

// module.exports = {
//     async store(req,res){
//         const provedor = { ...req.body };
        
//         const modals = Modal.findAll();

//         try {
//             existsOrError(provedor.name, "Não existe um provedor com esse nome");
//         } catch (error) {
//             return res.status(400).send(error);      
//         }
//         Provider.create(provedor)
//              .then(_ => res.status(204).send())
//              .catch(err => res.status(500).send(err));
//     },

//     show(req,res){
//         let checkById = false;
//         const providerData = req.params.data;
    
    
//         if (!isNaN(providerData)) checkById = true;
    
    
//         if (checkById) {
//             Provider.findOne({
//             where: {
//                 id: providerData
//             }
//             })
//             .then(provider => res.json(provider))
//             .catch(err => res.status(500).send(err));
//         }else {
//             Provider.findAll({
//             where: {
//                 name: { [Operation.like]: `%${providerData}%` }
//             }
//             })
//             .then(providers => {
//                 providers.forEach(provider => {});
//             })
//             .catch(err => res.status(500).send(err));   
//         }

//     }, 


//     delete(req,res){
//         const providerId = req.params.data;
    
//         Provider.destroy({
//           where: { id: providerId }
//         })
//           .then(_ => res.status(204).send())
//           .catch(err => res.status(500).send(err));
//       }
//     };
