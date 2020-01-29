const Sequelize = require("sequelize");
const { Path, City, Holiday } = require("../../models");

const Operation = Sequelize.Op;
const daysInPt = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado'
];
var duration = 0;
var auxDuration = null;

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
        console.log("function getCityId error: " + error);
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
        console.log("function getWarnings error: " + error);
        return { "error": error };
    }

    return warnings;
}

function getDay(date) {

    const splitDate = date.split('/');

    const reverseDate = splitDate.reverse();

    const dateFormated = new Date(new Date().getFullYear(), parseInt(reverseDate[0]) - 1, parseInt(reverseDate[1]));

    if (auxDuration === null) {
        duration = parseInt(reverseDate[1]);
        auxDuration = duration;
    }
    else {
        duration -= parseInt(reverseDate[1]) + 1;
        if (duration < 0)
            duration *= -1;
        auxDuration = null;
    }

    return daysInPt[dateFormated.getUTCDay()];
}

async function formatePaths(cityDep, cityReg, dateDep, dateReg) {

    //Constante que será usada no final, ela conterá todos os paths do objeto que foi passado para a função atual (formatePaths)
    const pathsResponse = [];
    //Dia de partida convertido para dia da semana, ex: segunda-feira,terça-feira,...
    const dayDep = getDay(dateDep);
    //Dia de regresso convertido para dia da semana, ex: segunda-feira,terça-feira,...
    const dayReg = getDay(dateReg);

    const findAllPaths = async (init, end, day) => {
        /*
            retorna todos paths encontrados de acordo com as variáveis passadas para a função
            as constantes que fazem uso dessa função são "pathsGoing" e "pathsBack", retornando,
            respectivamente, todos os trajetos de ida e volta. Para os paths going, os parâmetros
            da cláusula 'where' seguem de acordo com a entrada, sendo o parâmetro 'initCidade' a cidade
            de departure e o parâmetro 'endCidade' a cidade de regress. Com os paths back ocorre o inverso: 
            como é o trajeto onde o usuário voltará para a cidade de partida, então 'initCidade' será
            a cidade de regress e o 'endCidade' será a cidade de departure.  A mesma lógica segue para os dias,
            sendo que estes podem ser as constantes 'dayDep' ou 'dayReg', pois no banco de dados os dias do
            trajeto não estão como datas, e sim como dias da semana.
        */
        try {
            return await Path.findAll({
                where: {
                    initCidade: init,
                    endCidade: end,
                    dia: day,
                }
            })
        } catch (error) {
            console.log("function findAllPaths error: " + error);
            return { "error": error };
        }
    }

    const findWay = async (time, day, city, modal, arrival = false, pathDuration = null, cityArrival = null) => {
        if (arrival) {
            /*
                a hora vem no formato HH:MM e a duração no formato H:MM, sendo duas strings, logo
                as variáveis 'time' e 'pathDuration' estão sendo transformadas em arrays através
                do split, sendo um array separado pelo ":", com isso as variáveis ficam nesse estilo:
                time = ['HH','MM']
                pathDuration= ['H', 'MM']
                A hora e o minuto foram separados, isso permitirá calcular o horário de chegada do usuário
            */
            time = time.split(":");
            pathDuration = pathDuration.split(":");

            //variável que servirá para calcular quantos dias o usuário ficará viajando
            var daysTravelling = 0;
            /*variável do tipo array que calcula a hora de chegada do usuário, 
              ela somará o primeiro valor da variável time (horá de partida)
              com o primeiro valor da variável pathDuração (hora de duração do trajeto)
            */
            var hoursArrival = parseInt(time[0]) + parseInt(pathDuration[0]);

            /*variável do tipo array que calcula os minutos de chegada do usuário, 
              ela somará o primeiro valor da variável time (horá de partida)
              com o primeiro valor da variável pathDuração (hora de duração do trajeto)
            */
            var minutesArrival = parseInt(time[1]) + parseInt(pathDuration[1]);

            /*
                Se a somatória dos minutos de chegada forem maiores que 60, isso significa 
                que deve ser adicionada mais horas na variável 'hoursArrival'. É exatamente
                isso que o loop abaixo faz, leia-se: "Enquanto os minutos de chegada forem maiores
                que 60, diminua 60 nesses minutos de chegada e incremente 1 nas horas de chegada".
            */
            while (minutesArrival >= 60) {
                minutesArrival -= 60;
                hoursArrival += 1;
            }

            /*
                Se a somatória da hora de chegada for maior que 24, isso significa 
                que deve ser adicionado mais dias na variável 'daysTravelling'. É exatamente
                isso que o loop abaixo faz, leia-se: "Enquanto a horas de chegada for maior
                que 24, diminua 24 dessa hora de chegada e incremente 1 nos dias viajando".
            */
            while (hoursArrival >= 24) {
                hoursArrival -= 24;
                daysTravelling += 1;
            }

            var timeArrival = hoursArrival >= 0 && hoursArrival <= 9 ? "0" + hoursArrival : hoursArrival;
            var timeArrival = minutesArrival >= 0 && minutesArrival <= 9 ? `${timeArrival}:0${minutesArrival}` : `${timeArrival}:${minutesArrival}`;
            var dayPath = day;

            //achando qual dia da semana o usuário chegará no destino de arrival
            if (daysTravelling > 0) {
                var j = daysInPt.indexOf(day);

                for (i = 0; i <= daysTravelling; i++) {
                    if (j > 6)
                        j = 0;
                    dayPath = daysInPt[j];
                    j++;
                }
            }

            return {
                time: timeArrival,
                day: dayPath,
                city: cityArrival,
                modal: modal
            }
        }
        return {
            time: time,
            day: day,
            city: city,
            modal: modal
        }
    }

    //constante com todos os trajetos de ida
    const pathsGoing = await findAllPaths(cityDep, cityReg, dayDep, dateDep);

    //constante com todos os trajetos de volta
    const pathsBack = await findAllPaths(cityReg, cityDep, dayReg, dateReg);

    /*
        Essa função conterá todos os caminhos de ida. Aqui está sendo feito um map dos pathsGoing e, então, 
        cada caminho (objeto de resposta contendo data, quilometragem, preço, trajeto de ida e de chegada)
        será armazenado nessa constante. 
    */
    const waysGoing = await Promise.all(
        pathsGoing.map(async (path) => {
            return {
                date: dateDep,
                mileage: path.mileage,
                cost: path.cost,
                /*
                    achando o caminho de partida por meio da cidade inicial informada pelo usuário
                    os parâmetros hora e dia são, originalmente, arrays, por isso estão sendo passados
                    dessa maneira, passando somente a primeira string do path recuperado do banco de dados.
                    Isso deve ser corrigido futuramente, a api deverá tratar não como string, mas como array
                    no caso de existir mais horas e/ou dias
                */
                departure: await findWay(path.hora[0], path.dia[0], path.initCidade, path.modal),
                /*
                    aqui é onde o período de chegada do usuário no trajeto de ida será calculado. A função
                    findWay vai calcular, a partir da hora de partida (path.hora[0]), do dia de partida 
                    (path.dia[0]) e a duração do trajeto em horas (path.duration), a chegada do usuário
                    no seu destino (path.endCidade)
                */
                arrival: await findWay(path.hora[0], path.dia[0], path.initCidade, path.modal, true, path.duration, path.endCidade),
            }
        })
    );

    //Mesma lógica dos waysGoing
    const waysBack = await Promise.all(
        pathsBack.map(async (path) => {
            return {
                date: dateReg,
                mileage: path.mileage,
                cost: path.cost,
                departure: await findWay(path.hora[0], path.dia[0], path.initCidade, path.modal),
                arrival: await findWay(path.hora[0], path.dia[0], path.initCidade, path.modal, true, path.duration, path.endCidade),
            }
        })
    );

    /*
        Aqui está acontecendo a formação da saída esperada, onde a função pathsResponse conterá todos os ways de ida
        e volta organizado em pares, ou seja, se waysGoing e waysBack fossem retornados separados, o retorno seria
        mais ou menos assim: 
        [
            {
            going: ...
            },
            {
                going: ...
            },
            {
                back: ...
            }
            {
                back: ...
            },
            ...
        ]
        No caso de existirem muitos ways, isso seria um problema, pois no frontend não seria possível identificar 
        qual o caminho de ida e volta certo para cada entrada. Por isso, através desse for, a saída retornará cada
        way de going e back de forma organizada, em pares, e ainda mostrando o custo total e a quilometragem total
        da viagem. Formato: 
        [
            {
                totalCost: ...,
                totalMileage: ...,
                going: ...,
                back: ...
            },
            {
                totalCost: ...,
                totalMileage: ...,
                going: ...,
                back: ...
            },
            ...
        ]
        Obs, o for está percorrendo um vetor referente ao tamanho do waysGoing e usando o mesmo i para deixar
        em pares o way going de indice i com o way back de indice i, mas isso não é um problema, pois as 
        constantes pathsGoing e pathsBack (nas quais as constantes de ways se basearam) sempre recuperarão
        as mesmas quantidades de paths, pois cada para trajeto de ida no dia x existirá um trajeto de volta no dia y
    */
    for (i = 0; i < waysGoing.length; i++) {
        pathsResponse.push({
            totalCost: waysGoing[i].cost + waysBack[i].cost,
            totalMileage: waysGoing[i].mileage + waysBack[i].mileage,
            going: waysGoing[i],
            back: waysBack[i]
        })
    }

    return pathsResponse;
}

module.exports = {

    async index(req, res) {

        /*
            Objeto de entrada: é um array de caminhos que o usuário quer fazer
            Formato: 
            [
                {
                    'cityDeparture': 'cidade 1' // <- Cidade inicial (partida)
                    'dateDeparture': 'DD/MM' // <- Data inicial (partida)
                    'cityRegress': 'cidade 2 // <- Cidade destino (volta)
                    'dateRegress': 'DD/MM' // <- Data de volta
                },
                {
                    'cityDeparture': 'cidade X' // <- Cidade inicial (partida)
                    'dateDeparture': 'DD/MM' // <- Data inicial (partida)
                    'cityRegress': 'cidade Y // <- Cidade destino (volta)
                    'dateRegress': 'DD/MM' // <- Data de volta
                },
                ...
            ]
            OBS: se o dia/mês for maior ou igual a 1 e menor ou igual a 9, deve ser informado com um zero na frente
                Ex: 01/08, 09/10, 11,/05, etc...
        */
        const object = [...req.body];

        /*
            Constante que será enviada como resposta. "data", por ser uma promisse, acaba sendo 
            um array de respostas que conterá todos os trajetos com os dados informados na entrada
            por ex: 
        */
        const data = await Promise.all(
            //Achando os itens de resposta para cada entrada da constante object
            object.map(async obj => {
                return {
                    cityDeparture: obj.cityDeparture,
                    dateDeparture: obj.dateDeparture,
                    warnings: await getWarnings(obj.cityDeparture, obj.cityRegress, obj.dateDeparture, obj.dateRegress),
                    cityRegress: obj.cityRegress,
                    dateRegress: obj.dateRegress,
                    paths: await formatePaths(obj.cityDeparture, obj.cityRegress, obj.dateDeparture, obj.dateRegress),
                    duration: duration
                }
            })
        );

        return res.status(200).send(data);
    }
}