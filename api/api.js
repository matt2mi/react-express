const path = require('path');

const QUESTIONS = require('../bdd/questions').questions;
const service = require('../services/service');

module.exports = function (app, indexFilePath) {
    // Put all API endpoints under '/api'
    app.get('/api/players', (req, res) => {
        res.json(service.players);
        console.log('players sent', service.players);
    });
    app.get('/api/question', (req, res) => {
        const question = QUESTIONS[0];
        res.json(question);
        console.log('question sent', question);
    });
    app.get('/api/results', (req, res) => {
        const results = service
            .mapToArray(service.answersMap, 'lieValue', 'pseudos')
            .map(res => {
                return {
                    answer: {
                        lieValue: res.lieValue,
                        liePseudo: service.liesMap.get(res.lieValue)
                    },
                    pseudos: res.pseudos
                };
            });
        res.json(results);
        console.log('results sent', results);
    });
    app.get('/api/scores', (req, res) => {
        const scores = service.calculateScores(service.players, service.answersMap, service.liesMap);
        res.json(scores);
        console.log('scores sent', scores);
    });

    // send React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(indexFilePath));
    });
};