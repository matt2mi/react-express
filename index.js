const express = require('express');
const path = require('path');
const http = require('http');
const sio = require('socket.io');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/players', (req, res) => {
    res.json(players);
    console.log('players sent', players);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Game app listening on port ${port}`);




let httpServer = http.createServer();
const sioPort = 8000;
httpServer.listen(sioPort);
console.info(`Socket server listening on port ${sioPort}`);

// TODO : plus vite - sio(httpServer, { transports: [ 'websocket' ] }) ??
let sioServer = sio(httpServer);

const players = []; // ['pseudo']
const playersMap = new Map(); // (socketClient, 'pseudo')

function addPlayer(pseudo, socketClient) {
    console.log(`${pseudo} is subscribing to app !`);
    players.push({id: players.length, pseudo: pseudo});
    playersMap.set(socketClient, players[players.length - 1]);
}

function deletePlayer(id, socketClient) {
    console.log(`${players[id].pseudo} is disconnected from app !`);
    players.splice(id, 1);
    players.map((player, id) => { return {id, pseudo: player.pseudo}; });
    playersMap.delete(socketClient);
}

sioServer.on('connection', (socketClient) => {
    socketClient.on('subscribeToApp', (pseudo) => {
        addPlayer(pseudo, socketClient);
        sioServer.emit('updatePlayers', {players});
    });

    socketClient.on('disconnect', () => {
        // TODO bug aléatoire on disconnect
        if(playersMap.size > 0 && playersMap.get(socketClient) && playersMap.get(socketClient).id !== -1) {
            deletePlayer(playersMap.get(socketClient).id, socketClient);
            sioServer.emit('updatePlayers', {players});
        }
    });
});