let players = []; // [{id: 0, pseudo: 'pseudo'}]
let maxPlayers = 3;
let playersMap = new Map(); // (socketClient, 'pseudo')
let liesMap = new Map(); // ('mito', 'pseudo')
let answersMap = new Map(); // (lieValue: 'mito', ['pseudo'])
let scores = []; // [{pseudo: 'pseudo', scoreValue: 500}]

function addPlayer(pseudo, socketClient) {
    players.push({id: players.length, pseudo: pseudo});
    playersMap.set(socketClient, players[players.length]);
}

function deletePlayer(id, socketClient) {
    if(players.length > 0) {
        players.splice(id, 1);
        players.map((player, id) => { player.id = id; });
        playersMap.delete(socketClient);
    }
}

function mapToArray(map, keyPropName, valuePropName) {
    const array = [];
    for(let [key, value] of map) {
        array.push({[keyPropName]: key, [valuePropName]: value});
    }
    return array;
}

function calculateScores(players, answersMap, liesMap) {
    const scoresMap = new Map();
    players.forEach(player => scoresMap.set(player.pseudo, 0));

    for(let [lieValue, pseudos] of answersMap) {
        const liarPseudo = liesMap.get(lieValue);
        scoresMap.set(liarPseudo, 200 * pseudos.length);
    }

    return mapToArray(scoresMap, 'pseudo', 'value');
}

function init() {
    players = []; // [{id: 0, pseudo: 'pseudo'}]
    maxPlayers = 2;
    playersMap = new Map(); // (socketClient, 'pseudo')
    liesMap = new Map(); // ('mito', 'pseudo')
    answersMap = new Map(); // (lieValue: 'mito', ['pseudo'])
    scores = []; // [{pseudo: 'pseudo', scoreValue: 500}]
}

module.exports = {
    players,
    maxPlayers,
    playersMap,
    liesMap,
    answersMap,
    scores,
    addPlayer,
    deletePlayer,
    mapToArray,
    calculateScores,
    init
};