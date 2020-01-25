const Sequelize = require("sequelize");

const { Path, City } = require("../../models");
const Operation = Sequelize.Op;

async function getWarnings(city1, city2){
  const warnings = [];
  const allWarnings = await City.findAll({
    attributes: ['obsInterdicao','obsCidade'],
    where: {
      nome: {
        [Operation.in]: [city1, city2]
      }
    }
  });

  allWarnings.map(warning => {
    warnings.push(warning.dataValues.obsInterdicao);
    warnings.push(warning.dataValues.obsCidade);
  })

  return warnings;
}

async function getPath(initCidade, endCidade, date) {

  const path = await Path.findOne({
    where: {
      initCidade: { [Operation.like]: `%${initCidade}%` },
      endCidade: { [Operation.like]: `%${endCidade}%` }
    }
  })

  const pathResponse = {
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

    const object = [...req.body];

    const data = await Promise.all(object.map(async obj => {

      const path = await Path.findOne({
        where: {
          initCidade: { [Operation.like]: `%${obj.cityDeparture}%` },
          endCidade: { [Operation.like]: `%${obj.cityRegress}%` }
        }
      })

      const mileage = path.dataValues.mileage;
      const price = path.dataValues.cost;
      const duration = path.dataValues.duration;

      return {
        ...obj,
        mileage: mileage,
        price: price,
        duration: duration,
        warnings: await getWarnings(obj.cityDeparture, obj.cityRegress)
        // paths: {
        //   going: await getPath(obj.cityDeparture, obj.cityRegress, obj.dateDeparture),
        //   back: await getPath(obj.cityRegress, obj.cityDeparture, obj.dateRegress)
        // }
      }
    }));

    return res.status(200).send(data);
  }
};
