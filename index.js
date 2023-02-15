const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
import process from 'node:process';

app.use(express.static(__dirname + '/frontend/dist/'));

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('code', (code) => {
		console.log(code);
	})
});

server.listen(3000, () => {
	console.log('listening on *:3000');
});