const express = require('express');
const path = require('path');
const http = require('http');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// set api routes
require('./api/api')(app, __dirname + '/client/build/index.html');

// Api server
const port = process.env.PORT || 5000;
app.listen(port);
console.log('Game app listening on port', port);

// Socket-io server
const httpServer = http.createServer();
require('./socketio/socketio')(httpServer);

const sioPort = 8000;
httpServer.listen(sioPort);
console.info('Socket server listening on port', sioPort);