const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
// app.use(express.static(join(__dirname, './')));

let imena = {};
let bets = {};

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});
app.get('/game.js', (req, res) => {
    res.sendFile(join(__dirname, 'game.js'));
});

io.on('connection', (socket) => {
    console.log('a user connected with id: ' + socket.id);
    socket.on("register", (ime) => {
        imena[socket.id] = ime;
        console.log("imeto na " + socket.id + ' e ' + ime)

        let userImena = [];
        for(id in imena) {
            userImena.push(imena[id])
        }
        io.emit("imena", userImena)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected with id: ' + socket.id);
    });
    socket.on("zalagam", (x) => {
        bets[imena[socket.id]] = x;
    })
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(() => {
    let chislo = getRandomInt(0, 36); // Example range
    io.emit("chislo", 5);
}, 10000); // Example interval of 1 second
