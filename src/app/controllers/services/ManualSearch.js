const Sequelize = require("sequelize");

const { Path } = require("../../models");
const Operation = Sequelize.Op;

// var pathResponse;

// function setPathResponse(path,date) {

//   console.log(pathResponse);
// }

async function getPathResponse(initCidade, endCidade, date) {

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

  // console.log(pathResponse)

  return pathResponse;
}

function foo(){
  var num = {
    aaa: "aaaa"
  }
  return num;
}

module.exports = {
  index(req, res) {
    //fazendo spread da entrada (arrays de json)
    var object = [...req.body];
    var response = [];

    //map dos json e fazer o find em cada um
    object.map(async (obj) => {
      var singleResponse = {
        ...obj
      };
      // var paths = {
      //   going: {},
      //   back: {}
      // };

      /* RETORNAR MILEAGE, PRICE, DURATION
       código aqui */

      /* RETORNAR WARNINGS DAS CIDADES
        código aqui */

      //TRAJETO DE IDA

      var x = getPathResponse(obj.cityDeparture, obj.cityRegress, obj.dateDeparture);
      console.log(x);

      // getPathResponse(obj.cityDeparture, obj.cityRegress, obj.dateDeparture)
      //   .then(function (result) {
      //     return paths.going = result;

      //   })

      // console.log(going);

      //TRAJETO DE VOLTA
      // paths.back = findPath(obj.cityRegress, obj.cityDeparture, obj.dateRegress);

      // console.log(paths);

      // console.log(going)

      response.push(singleResponse);
    })

    return res.status(200).send(response);
  }
};
