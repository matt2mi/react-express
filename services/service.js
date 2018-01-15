const players = []; // ['pseudo']
const maxPlayers = 2;
const playersMap = new Map(); // (socketClient, 'pseudo')
const liesMap = new Map(); // ('mito', 'pseudo')
const answersMap = new Map(); // (lieValue: 'mito', ['pseudo'])
let scores = []; // [{pseudo: 'pseudo', scoreValue: 500}]

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

function mapToArray(map, keyPropName, valuePropName) {
    const array = [];
    for(let [key, value] of map) {
        array.push({[keyPropName]: key, [valuePropName]: value});
    }
    return array;
}

function calculateScores() {
    const scoresMap = new Map();
    players.forEach(player => scoresMap.set(player, 0));

    for(let [lieValue, pseudos] of answersMap) {
        const lierPseudo = liesMap.get(lieValue);
        const currentScore = scoresMap.get(lierPseudo);
        scoresMap.set(lierPseudo, 200 + pseudos.length);
    }
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
    calculateScores
};