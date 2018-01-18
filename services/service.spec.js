const expect = require('chai').expect;
const sinon = require('sinon');

const service = require('./service');

describe('Service Test', () => {
    /*describe('Fct addPlayer', () => {
        it('addPlayer should be a fct', () => {
            expect(service.addPlayer).to.be.a('function');
        });

        it('addPlayer should add one player to players & playersMap', () => {
            // given
            const player = 'player1';

            // when
            service.addPlayer(player, {});

            // then
            expect(service.players.length).to.equal(1);
            expect(service.playersMap.size).to.equal(1);
        });
    });

    describe('Fct deletePlayer', () => {
        it('deletePlayer should be a fct', () => {
            expect(service.deletePlayer).to.be.a('function');
        });

        it('deletePlayer should delete the only one player', () => {
            // given
            const pseudo = 'player1';
            service.players.push(pseudo);
            const socketClient = {value: 'socketClient'};
            service.playersMap.set(socketClient, pseudo);

            // when
            service.deletePlayer(0, socketClient);

            // then
            expect(service.players.length).to.equal(0);
            expect(service.playersMap.size).to.equal(0);
        });

        it('deletePlayer should delete one player in 3 players & set back the ids', () => {
            // given
            const player1 = {id: 0, pseudo: 'player1'};
            const player2 = {id: 1, pseudo: 'player2'};
            const player3 = {id: 2, pseudo: 'player3'};
            service.players.push(player1);
            service.players.push(player2);
            service.players.push(player3);

            const socketClient1 = {value: 'socketClient1'};
            const socketClient2 = {value: 'socketClient2'};
            const socketClient3 = {value: 'socketClient3'};
            service.playersMap.set(socketClient1, player1);
            service.playersMap.set(socketClient2, player2);
            service.playersMap.set(socketClient3, player3);

            // when
            service.deletePlayer(1, socketClient2);

            // then
            expect(service.players.length).to.equal(2);

            expect(service.players[0].id).to.equal(player1.id);
            expect(service.players[0].pseudo).to.equal(player1.pseudo);
            expect(service.players[1].id).to.equal(player2.id);
            expect(service.players[1].pseudo).to.equal(player3.pseudo);

            expect(service.playersMap.size).to.equal(2);
        });
    });*/

    describe('Fct calculateScores', () => {
        it('calculateScores should be a fct', () => {
            expect(service.calculateScores).to.be.a('function');
        });

        it('calculateScores should give 200 by lie choosen - 1pl', () => {
            // given
            const players = [{id: 0, pseudo: 'player1'}];
            const liesMap = new Map();
            const answersMap = new Map();

            liesMap.set('mito1', 'player1');

            answersMap.set('mito1', ['player1']);

            // when
            const scores = service.calculateScores(players, answersMap, liesMap);

            console.log('scores', scores);
            // then
            expect(scores[0].pseudo).to.equal('player1');
            expect(scores[0].value).to.equal(200);
        });

        it('calculateScores should give 200 by lie choosen - 3pl - 2 player on same lie', () => {
            // given
            const players = [
                {id: 0, pseudo: 'player1'},
                {id: 1, pseudo: 'player2'},
                {id: 2, pseudo: 'player3'}
            ];
            const answersMap = new Map();
            const liesMap = new Map();

            answersMap
                .set('mito1', ['player1', 'player2'])
                .set('mito2', ['player3']);

            liesMap
                .set('mito1', 'player1')
                .set('mito2', 'player2')
                .set('mito3', 'player3');

            // when
            const scores = service.calculateScores(players, answersMap, liesMap);

            // then
            expect(scores[0].pseudo).to.equal('player1');
            expect(scores[0].value).to.equal(400);
            expect(scores[1].pseudo).to.equal('player2');
            expect(scores[1].value).to.equal(200);
        });
    });
});