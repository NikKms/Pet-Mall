# Pet-Mol

Pet-Mol is a backend application with a CRM system where you can create products with designations by specifying the manufacturer, purpose, and tags. You can also moderate them, work on orders, add managers, as well as a client-side with all the functions of any internet store. The main feature is the dynamic calculation of the product price, tied to the Solana cryptocurrency.

## About

The project is made with NestJS framework.

## Technologies

Technologies used in development:

- MySQL
- TypeORM
- Mongoose
- MongoDB
- Redis
- Kafka
- Socket.io
- SFTP
- JWT
- Swagger

## Running the Application

1. Make sure the `.env` file is filled correctly.
2. Start Docker Compose to run auxiliary services and Kafka, Redis, SFTP servers:

Before starting Docker Compose, ensure that localhost:6379, localhost:9092, localhost:2222 are available.

```bash
docker-compose up
```

3. Open three consoles:

   - **First console**: Navigate to the `solana` directory, install dependencies, and start the service:

     ```bash
     cd solana
     yarn / npm i
     yarn start:dev / npm run start:dev
     ```

   - **Second console**: Navigate to the `server` directory, install dependencies, and start the server:

     ```bash
     cd server
     yarn / npm i
     yarn start:dev / npm run start:dev
     ```

   - **Third console**: Start the main server:

     ```bash
     yarn / npm start
     ```

4. After that, you can start testing.

## Alternative Launch

If you are confident that your databases are working fine and the `.env` file is filled correctly, you can start the application using the following commands from the project root:

```bash
yarn install / npm install
yarn start / npm start


```

In this case, the application should start and work, but the logs will not be available.

## API Documentation

All available endpoints are described in Swagger:

```bash
localhost:PORT_FROM_ENV/api/docs


```
