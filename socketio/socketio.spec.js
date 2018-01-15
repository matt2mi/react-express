const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');

const socketio = require('./socketio');

describe('Socketio Test', () => {
    it('socketio should be a fct', function () {
        expect(socketio).to.be.a('function');
    });
});