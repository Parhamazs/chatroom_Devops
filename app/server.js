const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected now');
    socket.on('chat message', (msg) => {
        io.emit('chat mesage', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});

// listen port
server.listen(3000, () => {
    console.log('server running on p 3000');
});