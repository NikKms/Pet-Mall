const { exec } = require('child_process');

const dockerCompose = exec('docker-compose up -d', { cwd: __dirname });

dockerCompose.on('error', (err) => {
	console.error('The error when starting the Docker Compose:', err);
});

dockerCompose.on('exit', (code, signal) => {
	if (code === 0) {
		console.log('Docker Compose start succes');
	} else {
		console.error(`Docker Compose error ${code}`);
	}
});

const server = exec('cd server && yarn start:dev || npm run start:dev ');

const solana = exec('cd solana && yarn start:dev || npm run start:dev ');

server.on('exit', (code, signal) => {
	console.log('first');
	console.log(signal);
});

server.on('error', (err) => {
	console.error('The error when starting the server:', err);
});

solana.on('error', (err) => {
	console.error('The error when starting the solana:', err);
});
