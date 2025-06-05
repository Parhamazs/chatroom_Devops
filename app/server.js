const express = require('express')
const http = require('http')
const { server } = require('socket.io')
const redis = require('redis');

const app = express();
const server = http.createServer(app);
const io = new server(server);

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected now');

    redisClient.IRange('messages', 0, -1).then((messages) =>{
        messages.forEach((msg) => socket.emit('chat message', msg));
    });

    socket.on('chat message', async (msg) => {
        await redisClient.rPush('messages', msg);
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