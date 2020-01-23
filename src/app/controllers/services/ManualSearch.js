const Sequelize = require("sequelize");

const { Path } = require("../../models");
const Operation = Sequelize.Op;

async function getPath(initCidade, endCidade, date) {

  const path = await Path.findOne({
    where: {
      initCidade: { [Operation.like]: `%${initCidade}%` },
      endCidade: { [Operation.like]: `%${endCidade}%` }
    }
  })

  var pathResponse = {
    date: date,
    arrival: {
      time: path.dataValues.hora,
      day: path.dataValues.dia,
      city: path.dataValues.initCidade,
      modal: path.dataValues.modal
    },
    departure: {
      time: path.dataValues.hora,
      day: path.dataValues.dia,
      city: path.dataValues.endCidade,
      modal: path.dataValues.modal
    }
  }

  return pathResponse;
}

module.exports = {
  async index(req, res) {

    var object = [...req.body];
    
    var data = await Promise.all(object.map(async obj => {
      return {
        ...obj,
        paths: {
          going: await getPath(obj.cityDeparture, obj.cityRegress, obj.dateDeparture),
          back: await getPath(obj.cityRegress, obj.cityDeparture, obj.dateRegress)
        }
      }
    }));

    return res.status(200).send(data);
  }
};
