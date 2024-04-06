const { exec } = require('child_process');

const server = exec('cd server && yarn  || npm i ');

const solana = exec('cd solana && yarn  || npm i ');

server.on('error', (err) => {
	console.error('The error when installing the server:', err);
});

solana.on('error', (err) => {
	console.error('The error when installing the solana:', err);
});
