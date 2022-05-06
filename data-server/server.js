const express = require("express");
const cors = require("cors");
const https = require("https");
const socketIo = require("socket.io");
const { range, random } = require("lodash")
const app = express();
app.use(cors());

// params 
const _rangeMax = 10;
const _intervalTime = 2 * 1000;
const _port = 8085;
// params - end

const server = new https.Server(app);
const io = socketIo(server);

let cars = range(_rangeMax).map((id) => {
    return {
        id,
        name: `Car ${id}`,
        lat: 54.370044 + 0.01 - random(0.2, true),
        lng: 18.600549 + 0.01 - random(0.2, true)
    }
});

let changeCarsPositionsAndEmitToClients = () => {
    console.log('Updating cars positions for : '+io.sockets.clients()   );
    cars = cars.map(oldCar => {
        if (random(1, true) < 0.3) {
            let updatedCar = {
                ...oldCar,
                lat: oldCar.lat + 0.01 - random(0.02, true),
                lng: oldCar.lng + 0.01 - random(0.02, true)
            };
            io.sockets.clients().emit("carPositionChanged", updatedCar)
            return updatedCar;
        } else {
            return oldCar;
        }
    })
};

setInterval(changeCarsPositionsAndEmitToClients, _intervalTime);

app.get('/cars', (req, res) => res.send(cars));

io.on("connect", (connection) => {
    console.log('emit initial cars', connection)
    connection.emit("cars", cars)
});

server.listen(_port, () => {
    console.log("Server listening on port " + _port)
});

