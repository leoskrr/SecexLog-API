const Sequelize = require("sequelize");

const { Path, City, Holiday } = require("../../models");
const Operation = Sequelize.Op;

async function getWarnings(city1, city2) {
  const warnings = [];

  try {
    const allWarnings = await City.findAll({
      attributes: ['obsInterdicao', 'obsCidade'],
      where: {
        nome: {
          [Operation.in]: [city1, city2]
        }
      }
    });

    allWarnings.map(warning => {
      warnings.push(warning.dataValues.obsInterdicao);
      warnings.push(warning.dataValues.obsCidade);
    });

  } catch (error) {
    return res.status(500).send({ "error": error });
  }

  return warnings;
}

async function getPaths(initCidade, endCidade, date) {
  const paths = [];

  try {
    const allPaths = await Path.findAll({
      where: {
        initCidade: { [Operation.like]: `%${initCidade}%` },
        endCidade: { [Operation.like]: `%${endCidade}%` }
      }
    })

    allPaths.map(path => {
      paths.push({
        date: date,
        mileage: path.mileage,
        price: path.cost,
        duration: path.duration,
        arrival: {
          time: path.hora,
          day: path.dia,
          city: path.initCidade,
          modal: path.modal
        },
        departure: {
          time: path.hora,
          day: path.dia,
          city: path.endCidade,
          modal: path.modal
        }
      });
    })
  } catch (error) {
    return res.status(500).send({ "error": error });
  }

  return paths;
}

async function formatePaths(initCidade, endCidade, dateDep, dateReg) {

  const paths = [];

  const pathsGoing = await getPaths(initCidade, endCidade, dateDep);
  const pathsBack = await getPaths(endCidade, initCidade, dateReg);

  for (i = 0; i < pathsGoing.length; i++) {
    paths.push({
      going: pathsGoing[i],
      back: pathsBack[i]
    })
  }

  return paths;
}

module.exports = {
  async index(req, res) {

    const object = [...req.body];

    const data = await Promise.all(object.map(async obj => {

      return {
        ...obj,
        warnings: await getWarnings(obj.cityDeparture, obj.cityRegress),
        paths: await formatePaths(obj.cityDeparture, obj.cityRegress, obj.dateDeparture, obj.dateRegress)
      }
    }));

    return res.status(200).send(data);
  }
};
