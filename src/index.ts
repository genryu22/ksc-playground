import { ChildProcess } from "child_process";

const fs = require("fs");

const { spawn } = require('node:child_process');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	maxHttpBufferSize: 1e8 // 100 MB
});

app.use(express.static('./frontend/dist/'));



io.on('connection', (socket: any) => {
	console.log('a user connected');
	let currentTask: ChildProcess;

	let fileName = `./deno/codes/${socket.id}.js`;

	socket.on('code', (code: String) => {
		if (currentTask) {
			currentTask.kill();
		}

		fs.writeFile(fileName, code, (err: any) => {
			const ls: ChildProcess = spawn('deno', ['run', '--allow-read', './deno/executor.js', fileName.replace('/deno', '')]);

			ls.stdout?.on('data', (data) => {
				socket.emit('data_packet', `${data}`);
			});

			let error = '';
			ls.stderr?.on('data', (data) => {
				error += `${data}`;
			});

			ls.on('close', (code) => {
				if (code == 1) {
					socket.emit('error_packet', error);
				}
			});

			currentTask = ls;
		})
	})

	socket.on('disconnect', () => {
		if (currentTask) {
			currentTask.kill();
		}
		fs.unlink(fileName, (err: Error) => {
			if (err) console.error(err);
		});
	})
});

server.listen(3000, () => {
	console.log('listening on *:3000');
});