module.exports = (data) => {
    return `
    <!DOCTYPE html>
    <html lang="pt-br">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Detalhes da Viagem</title>
        <style>
            body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                font-family: Arial, Helvetica, sans-serif;
                color: #8c8c8c;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
    
            header {
                padding: 5px 0;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
    
            .logo-secex {
                width: 250px;
                height: 50px;
            }
    
            .logo-tce {
                width: 80px;
                height: 80px;
            }
    
            img {
                width: 100%;
                height: 100%;
            }
    
            .divider {
                height: 100px;
                width: 2px;
                background-color: #ccc;
                margin: 0 50px;
            }
    
            main {
                width: 70%;
            }
    
            .cities {
                color: #4f4f4f;
            }
        </style>
    </head>
    
    <body>
        <header>
            <div class="logo-secex">
                <img src="https://imgur.com/YHyH3LQ" alt="logo secexlog">
            </div>
            <div class="divider"></div>
            <div class="logo-tce">
                <img src="../img/logo-tce.png" alt="logo tce">
            </div>
        </header>
        <main>
            <h1>Detalhes da viagem</h1>

            <h3 class="cities">${data.cityDeparture} - ${data.cityRegress}</h3>
    
            <p><b>Partida</b>: ${data.going.date} às ${data.going.departure.time} AM</p>
    
            <p><b>Chegada</b>: ${data.going.arrival.day} às ${data.going.arrival.time}</p>
    
            <p><b>Duração da viagem</b>: ${data.duration}</p>
    
            <p><b>Prestador de Serviço</b>: ${data.going.departure.modal} - ${data.going.provider}</p>
    
            <p><b>Local de embarque</b>: Aeroporto Internacional Eduardo Gomes</p>
    
            <p><b>Local de desembarque</b>: Almirante Vitória da Cruz</p>

            <p>Informações adicionais: ${data.warnings}</p>
    
            <br>
    
            <h3 class="cities">${data.cityRegress} - ${data.cityDeparture}</h3>
    
            <p><b>Partida</b>: ${data.back.date} às ${data.back.departure.time} AM</p>
    
            <p><b>Chegada</b>: ${data.back.arrival.day} às ${data.back.arrival.time}</p>
    
            <p><b>Duração da viagem</b>: ${data.duration}</p>
    
            <p><b>Prestador de Serviço</b>: ${data.back.departure.modal} - ${data.back.provider}</p>
    
            <p><b>Local de embarque</b>: Aeroporto Internacional Eduardo Gomes</p>
            
            <p><b>Local de desembarque</b>: Almirante Vitória da Cruz</p>

            <p>Informações adicionais: ${data.warnings}</p>
        </main>
    </body>
    
    </html>
    
    `
}