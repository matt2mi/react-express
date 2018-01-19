import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

const url: string = window.location.href;
const socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':8000');

function getSocket(): Socket {
    return socket;
}

function subscribeToApp(cb: (err: string) => void, pseudo: string) {
    socket.on('updatePlayers', () => cb(''));
    socket.emit('subscribeToApp', pseudo);
}

export {
    subscribeToApp,
    getSocket
};