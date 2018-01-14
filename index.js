const express = require('express');
const path = require('path');
const http = require('http');
const sio = require('socket.io');

const app = express();

const QUESTIONS = [
    {
        text: 'El colacho est un festival espagnol où les gens s\'habille en diables et sautent au dessus de ...',
        answers: ['bébé', 'bebe', 'bébés', 'bebes'],
        lies: ['voitures', 'piscines']
    }, {
        text: 'Dans la ville d\'Alliance au Nebraska, on peut voir une réplique du Stonehenge faite de ...',
        answers: ['voiture', 'voitures'],
        lies: ['crottes', 'patates']
    }, {
        text: 'l\'acteur Eddie Murphy a sorti une chanson en 1982 dont le titre est "Boogie in ..."',
        answers: ['yout butt', 'butt'],
        lies: ['your mother', 'USA']
    }, {
        text: 'En vacances en chine à Dongyang, il faut absolument goûter leurs oeufs cuits dans ...',
        answers: ['l\'urine d\'enfant', 'urine d\'enfant', 'urine'],
        lies: ['un wok', 'du lait de panda']
    }, {
        text: 'Nicolas Ancion a écrit un livre sur un pays imaginaires dont le titre est "Les ours n\'ont pas de problème de ..."',
        answers: ['parking'],
        lies: ['dentition', 'température']
    }, {
        text: 'Zakhar Prilepine a écrit un livre de nouvelles comiques dont le titre est "Des chaussures pleines de ... chaud(es)"',
        answers: ['vodka'],
        lies: ['pisse', 'pieds']
    }, {
        text: 'Quand l\'auteur de Charlie et la chocolaterie, Roald Dahl est mort, il a été enterré avec des queues de billard, du vin de Bourgogne, du chocolat, des crayons et ...',
        answers: ['une scie électrique', 'scie'],
        lies: ['griffe de corbeau', 'globe terrestre']
    }, {
        text: 'Le 22 mai 2012, Lindsay Lohan a tweeté : "... est le meilleur médicament."',
        answers: ['le travail'],
        lies: ['la drogue', 'le sexe']
    }, {
        text: 'Mohammed Khurshid Hussain est dans le livre des records car il arrive à ... très vite avec son nez',
        answers: ['taper', 'taper au clavier', 'écrire'],
        lies: ['siffler', 'souffler']
    }, {
        text: 'Le New York Times a éét obligé de corriger une édition pour avoir pris Mario et Luigi (Nintendo) comme ... plutôt que plombiers',
        answers: ['concierges', 'concierge'],
        lies: ['électriciens', 'charpentiers']
    }, {
        text: 'La ville d\'Olney dans l\'Illinois (USA) organise un évènement annuel pour ... les écureuils',
        answers: ['compter'],
        lies: ['honorer', 'empailler']
    }, {
        text: 'Dans les années 90, les profs en Corée du Nord devaient savoir à peu près comment ...',
        answers: ['jouer de l\'accordéon'],
        lies: ['cuisiner', 'accoucher dans l\'eau']
    }, {
        text: 'D\'après une étude de l\'université de Jena, on se rapelle plus facilement des gens ...',
        answers: ['moches'],
        lies: ['grands', 'gros']
    }, {
        text: 'La cause de la mort d\'un cascadeur pendant qu\'il traversait une rivière sur une tyrolienne avec sa queue de cheval',
        answers: ['attaque cardiaque'],
        lies: ['scalpé', 'perte de sang']
    }, {
        text: 'Coca-Cola a, un jour, commandé un jeu vidéo sur Atari nommé "Pepsi ..."',
        answers: ['invaders'],
        lies: ['parade', 'problem']
    }
];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/players', (req, res) => {
    res.json(players);
    console.log('players sent', players);
});
app.get('/api/question', (req, res) => {
    const question = QUESTIONS[0];
    res.json(question);
    console.log('question sent', question);
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
const maxPlayers = 2;
const playersMap = new Map(); // (socketClient, 'pseudo')
const liesMap = new Map();

function addPlayer(pseudo, socketClient) {
    console.log(`${pseudo} is subscribing to app !`);
    players.push({id: players.length, pseudo: pseudo});
    playersMap.set(socketClient, players[players.length - 1]);
}

function deletePlayer(id, socketClient) {
    if(players.length > 0) {
        console.log('id', id);
        console.log(`${players[id].pseudo} is disconnected from app !`);
        players.splice(id, 1);
        players.map((player, id) => { return {id, pseudo: player.pseudo}; });
        playersMap.delete(socketClient);
    }
}

// TODO : dynamic key name
function maptoArray(map) {
    const array = [];
    for(let [key, value] of map) {
        array.push({key, value});
    }
    return array;
}

sioServer.on('connection', (socketClient) => {
    socketClient.on('disconnect', () => {
        if(playersMap.size > 0 && playersMap.get(socketClient) && playersMap.get(socketClient).id !== -1) {
            deletePlayer(playersMap.get(socketClient).id, socketClient);
            sioServer.emit('updatePlayers', players);
        }
    });

    socketClient.on('subscribeToApp', (pseudo) => {
        if(players.length < maxPlayers) {
            addPlayer(pseudo, socketClient);
            sioServer.emit('updatePlayers', players);

            if(players.length === maxPlayers) {
                sioServer.emit('players-list-full', players);
            }
        }
    });

    socketClient.on('lieAnswered', ({lieValue, pseudo}) => {
        console.log('lie received ', lieValue, ' from ', pseudo);
        liesMap.set(pseudo, lieValue);
        if(liesMap.size === players.length) {
            sioServer.emit('loadLies', maptoArray(liesMap));
        }
    })
});