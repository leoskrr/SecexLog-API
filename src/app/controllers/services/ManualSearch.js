const Sequelize = require("sequelize");

const { Path } = require("../../models");
const Operation = Sequelize.Op;

/*
  INPUT: 
  [
    {
      cityDeparture: "Manaus",
      dateDeparture: "01/08/2020" 
      cityRegress: "Itacoatiara",
      dateRegress: "09/08/2020",
    },
    {
      cityDeparture: "Maués"
      dateDeparture: "01/08/2020" 
      cityRegress: "Manaus",
      dateRegress: "09/08/2020",
    },
    ...
  ]

  OUTPUT:
  [

    {
      cityDeparture: "Manaus",
      dateDeparture: "01/08/2020" 
      cityRegress: "Itacoatiara",
      dateRegress: "09/08/2020",
      mileage: "270km"
      warnings: {
        cityDeparture: "warnings manaus",
        cityRegres: "warning Itacoatiara"
      },
      price: 800,
      duration: "5:00"
      paths: [
        going: {
          date: "01/08/2020",
          arrival: {
            time: "10:00 AM",
            day: "quinta-feira",
            city: "Manaus",
            modal: "Taxi Aéreo"
          },
          departure: {
            time: "12:00 AM",
            day: "quinta-feira",
            city: "Itacoatiara",
            modal: "Taxi Aéreo"
          }
        },

        back: {
          date: "09/08/2020",
          arrival: {
            time: "07:00 AM",
            day: "sexta-feira",
            city: "Itacoatiara",
            modal: "Taxi Aéreo"
          },
          departure: {
            time: "03:00 PM",
            day: "sexta-feira",
            city: "Manaus",
            modal: "Taxi Aéreo"
          }
        },
      ]

    },
  ]


  Retorno ====> 	Cidade saida
		Data saida
		horario saida
		data chegada	
		horario chegada
	

		Cidade destino
		data destino
		horario saida retorno
		data retorno 
		horario chegada retorno


		nome modal saida
		icone modal saida
		nome modal retorno
		icone modal retorno

		preço total traj
		duracao de cada trecho(00:00)
		quantidade de dias uties de cada cidade
		quantidade de dias uteis totais
		avisos
*/

/*
  IDA: 
    trajeto de cidade volta para cidade ida
  VOLTA: 
    trajeto de cidade volta para cidade ida
*/

/*
  processos: 
  - criar a variável de entrada (array) object que faz spread dos dados recebidos;
  - criar uma variável response de array vazia;
  - Fazer um map da variável object
  - criar um objeto singleResponse dentro de cada map
  - Dentro do map fazer os processos de consulta no banco e, a cada resultado,
  adicionar o mesmo na variável singleResponse conforme o formato de output
  - No fim do map, fazer o push da variável singleResponse na variável array response
  - Ao fim do código, retornar a variável response
*/

module.exports = {
  index(req, res) {
    //fazendo spread da entrada (arrays de json)
    var object = [...req.body];
    var response = [];

    //map dos json e fazer o find em cada um
    object.map(obj => {
      var singleResponse = {
        ...obj
      };

      //TRAJETO DE IDA
      Path.findOne({
        where: {
          initCidade: { [Operation.like]: `%${obj.cityDeparture}%` },
          endCidade: { [Operation.like]: `%${obj.cityRegress}%` }
        }
      })
        .then(path => {
          singleResponse = { ...path }
        })
    })

    // Path.findAll({
    //   where: {
    //     initCidade: { [Operation.like]: `%${path.initCidade}%` },
    //     endCidade: { [Operation.like]: `%${path.endCidade}%` }
    //   }
    // })
    //   .then(paths => res.json(paths))
    //   .catch(err => res.status(500).send(err));
    return res.status(200).send(object);
  }
};
