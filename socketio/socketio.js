const sio = require('socket.io');
const service = require('../services/service');
const QUESTIONS = require('../bdd/questions');

let nbAnswers = 0;

module.exports = function (httpServer) {

    // TODO : plus vite - sio(httpServer, { transports: [ 'websocket' ] }) ??
    let sioServer = sio(httpServer);

    sioServer.on('connection', (socketClient) => {
        socketClient.on('disconnect', () => {
            if (service.playersMap.size > 0 &&
                    service.playersMap.get(socketClient) &&
                    service.playersMap.get(socketClient).id !== -1) {
                service.deletePlayer(service.playersMap.get(socketClient).id, socketClient);
                sioServer.emit('updatePlayers', service.players);
            }
        });

        socketClient.on('subscribeToApp', (pseudo) => {
            if (service.players.length < service.maxPlayers) {
                service.addPlayer(pseudo, socketClient);
                sioServer.emit('updatePlayers', service.players);

                if (service.players.length === service.maxPlayers) {
                    sioServer.emit('players-list-full', service.players);
                }
            }
        });

        socketClient.on('lieAnswered', ({lieValue, pseudo}) => {
            console.log('lie received', lieValue, 'from', pseudo);
            service.liesMap.set(lieValue, pseudo);
            if (service.liesMap.size === service.players.length) {
                console.log('q', QUESTIONS[0]);
                const lies = service.mapToArray(service.liesMap, 'lieValue', 'pseudo');
                lies.push({
                    lieValue: QUESTIONS[0].answers[0],
                    pseudo: 'truth'
                });
                lies.push({
                    lieValue: QUESTIONS[0].lies[0],
                    pseudo: 'gameLie'
                });
                sioServer.emit('loadLies', lies);
            }
        });

        socketClient.on('lieChoosen', answer => {
            console.log('lie choosen by', answer.pseudo, ':', answer.lie.lieValue, '(', answer.lie.pseudo, ')');

            if (service.answersMap.get(answer.lie.lieValue) !== undefined) {
                service.answersMap.get(answer.lie.lieValue).push(answer.pseudo);
            } else {
                service.answersMap.set(answer.lie.lieValue, [answer.pseudo]);
            }

            nbAnswers++;
            if (nbAnswers === service.players.length) {
                sioServer.emit('goToResults');
            }
        });
    });
};