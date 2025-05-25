const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
let players = {};

app.use(express.static("public")); // Serve static files from 'public' folder

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Initialize player state
    players[socket.id] = {
        x: 300,
        y: 300,
        ugul: 0,
        opashkaX: [],
        opashkaY: [],
        opashkaUgul: [],
        opashkaBroi: 0
    };

    // Send the current players state to all clients
    io.emit("playersUpdate", players);

    // Handle player updates
    socket.on("playerUpdate", (playerData) => {
        players[socket.id] = playerData;
        io.emit("playersUpdate", players);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit("playersUpdate", players);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
