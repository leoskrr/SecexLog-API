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

    const pathsResponse = [];
    const dayDep = getDay(dateDep);
    const dayReg = getDay(dateReg);

    const findAllPaths = async (init, end, day) => {
        //talvez seja necessário ordenar por hora
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
                hora arrival = pegar a hora de departure (time) e somar com a duração do trecho (provinda do banco)
                retornar um resultado onde existe um trajeto com a hora arrival, a cidade destino e o dia.
                Obs: manipular o dia conforme a hora arrival, ou seja, se a hora arrival ultrapassar 23:59, significa
                que o usuário chegará no dia posterior ao dia de partida
            */
            time = time.split(":");
            pathDuration = pathDuration.split(":");

            var daysTravelling = 0;
            var hoursArrival = parseInt(time[0]) + parseInt(pathDuration[0]);
            var minutesArrival = parseInt(time[1]) + parseInt(pathDuration[1]);

            while (minutesArrival >= 60) {
                minutesArrival -= 60;
                hoursArrival += 1;
            }

            while (hoursArrival >= 24) {
                hoursArrival -= 24;
                daysTravelling += 1;
            }

            var timeArrival = hoursArrival >= 0 && hoursArrival <= 9 ? "0" + hoursArrival : hoursArrival;
            var timeArrival = minutesArrival >= 0 && minutesArrival <= 9 ? `${timeArrival}:0${minutesArrival}` : `${timeArrival}:${minutesArrival}`;
            var dayPath = day;

            if (daysTravelling > 0) {
                var j = daysInPt.indexOf(day);

                for (i = 0; i <= daysTravelling; i++) {
                    if (j > 6)
                        j = 0;
                    dayPath = daysInPt[j];
                    j++;
                }
            }

            // const pathArrival = await Path.findOne({
            //     where: {
            //         initCidade: city,
            //         endCidade: cityArrival,
            //         dia: [dayPath],
            //         hora: timeArrival
            //     }
            // });

            // if (pathArrival) {
                return {
                    time: timeArrival,
                    day: dayPath,
                    city: cityArrival,
                    modal: modal
                }
            // } else {
            //     return {
            //         error: `there's not a path from ${city} to ${cityArrival} on ${dayPath} at ${timeArrival}`
            //     }
            // }

        }
        return {
            time: time,
            day: day,
            city: city,
            modal: modal
        }
    }

    const pathsGoing = await findAllPaths(cityDep, cityReg, dayDep, dateDep);
    const pathsBack = await findAllPaths(cityReg, cityDep, dayReg, dateReg);

    const waysGoing = await Promise.all(
        pathsGoing.map(async (path) => {
            return {
                date: dateDep,
                mileage: path.mileage,
                cost: path.cost,
                departure: await findWay(path.hora[0], path.dia[0], path.initCidade, path.modal),
                arrival: await findWay(path.hora[0], path.dia[0], path.initCidade, path.modal, true, path.duration, path.endCidade),
            }
        })
    );

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

        const object = [...req.body];

        const data = await Promise.all(
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