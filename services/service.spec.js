const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');

const service = require('./service');

describe('Service Test', () => {
    it('calculateScores should be a fct', function () {
        expect(service.calculateScores).to.be.a('function');
    });

    // it('calculateScores should ', function () {
    //     // given
    //     players = [];
    //     answersMap = new Map();
    //     liesMap = new Map();
    //
    //     // when
    //
    //     // then
    // });
});