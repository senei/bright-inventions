var express = require('express');
var app = express();
const { range, random } = require("lodash")

var expressWs = require('express-ws')(app);

// params 
const _rangeMax = 32;
const _intervalTime = 2 * 1000;
const _port = 8085;
// params - end

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

app.get('/cars', function(req, res, next){
  console.log('get route', req.testing);
  console.log('emit initial cars', cars)
  res.send(cars);
});

app.ws('/cars', function(ws, req) {
  ws.on('connect', function(connection) {
    console.log('emit initial cars', connection)
    connection.send("cars", cars)  
  });
  
  ws.on('message', function(msg) {
    console.log(msg + ' on message');
  });
  console.log('socket', req.testing);

  let changeCarsPositionsAndEmitToClients = () => {
    console.log('Updating cars positions');
    cars = cars.map(oldCar => {
        if (random(1, true) < 0.3) {
            let updatedCar = {
                ...oldCar,
                lat: oldCar.lat + 0.01 - random(0.02, true),
                lng: oldCar.lng + 0.01 - random(0.02, true)
            };
            expressWs.getWss().clients.forEach((client)=>{client.send(JSON.stringify(cars))});

            return updatedCar;
        } else {
            return oldCar;
        }
    })
};
changeCarsPositionsAndEmitToClients();
setInterval(changeCarsPositionsAndEmitToClients, _intervalTime);

});

let cars = range(_rangeMax).map((id) => {
    return {
        id,
        name: `Car ${id}`,
        lat: 54.370044 + 0.01 - random(0.2, true),
        lng: 18.600549 + 0.01 - random(0.2, true)
    }
});


app.listen(_port);