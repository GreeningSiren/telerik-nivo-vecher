const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

const users = [];

io.on('connection', (socket) => {
    console.log('a user connected with id: ' + socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected with id: ' + socket.id);
        users.forEach((user, index) => {
            if (user.id === socket.id) {
                console.log('removed: ' + user.username + ' - ' + user.id);
                users.splice(index, 1);
            }
        });
        console.log(users);

    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg.username + ' - ' + msg.message);
        io.emit('chat message', msg);
    });
    socket.on('register', (username) => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                socket.emit('register fail', username);
                return;
            }
        }
        console.log('registered: ' + username + ' - ' + socket.id);
                users.push({
                    username: username,
                    id: socket.id
                });
                socket.emit('register success', username);
        console.log(users);
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});