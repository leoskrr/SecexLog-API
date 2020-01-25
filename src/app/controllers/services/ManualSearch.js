const Sequelize = require("sequelize");

const { Path, City, Holiday } = require("../../models");
const Operation = Sequelize.Op;

async function getCityId(city) {
  try {
    const response = await City.findOne({
      attributes: ['id'],
      where: {
        nome: city
      }
    });

    return response.dataValues;

  } catch (error) {
    return { "error": error };
  }
}

async function getWarnings(city1, city2, dateDep, dateReg) {
  const warnings = [];

  const cityDep = await getCityId(city1);
  const cityReg = await getCityId(city2);

  try {
    const observations = await City.findAll({
      attributes: ['obsInterdicao', 'obsCidade'],
      where: {
        nome: {
          [Operation.in]: [city1, city2]
        }
      }
    });

    observations.map(obs => {
      warnings.push(obs.dataValues.obsInterdicao);
      warnings.push(obs.dataValues.obsCidade);
    });

    const holidays = await Holiday.findAll({
      where: {
        city_id: {
          [Operation.in]: [cityDep.id, cityReg.id]
        },
        [Operation.or]: [{ init: dateDep }, { init: dateReg }],
        [Operation.or]: [{ end: dateDep }, { end: dateReg }],
      }
    })

    if (holidays) {
      holidays.map(holiday => {
        if (holiday.dataValues.init === holiday.dataValues.end)
          warnings.push(`Feriado dia ${holiday.dataValues.init}: ${holiday.dataValues.nome}`);
        else
          warnings.push(`Feriados no dia ${holiday.dataValues.init} até o dia ${holiday.dataValues.end}: ${holiday.dataValues.nome}`);
      })
    }

  } catch (error) {
    return { "error": error };
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
    return { "error": error };
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
        warnings: await getWarnings(obj.cityDeparture, obj.cityRegress, obj.dateDeparture, obj.dateRegress),
        paths: await formatePaths(obj.cityDeparture, obj.cityRegress, obj.dateDeparture, obj.dateRegress)
      }
    }));

    return res.status(200).send(data);
  }
};
