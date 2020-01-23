const Sequelize = require("sequelize");

const { Path, City } = require("../../models");
const Operation = Sequelize.Op;

async function getWarnings(city){
  const warnings = await City.findOne({
    attributes: ['obsInterdicao','obsCidade'],
    where: {
      nome: city
    }
  });

  return {
    interdition: warnings.dataValues.obsInterdicao,
    observation: warnings.dataValues.obsCidade
  }
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

      getWarnings(obj.cityRegress);

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
        warnings: {
          cityDeparture: await getWarnings(obj.cityDeparture),
          cityRegress: await getWarnings(obj.cityRegress)
        },
        paths: {
          going: await getPath(obj.cityDeparture, obj.cityRegress, obj.dateDeparture),
          back: await getPath(obj.cityRegress, obj.cityDeparture, obj.dateRegress)
        }
      }
    }));

    return res.status(200).send(data);
  }
};
