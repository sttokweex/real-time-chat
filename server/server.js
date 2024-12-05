import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './dbconnector/db.js';
import socketHandlers from './sockets/socketHandlers.js';
import routes from './routes/router.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const clientUrl = 'http://79.141.65.250';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [clientUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [clientUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(bodyParser.json({ strict: false }));
app.use('/', routes);

(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully.');

    server.listen(3001, '0.0.0.0', () => {});
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

socketHandlers(io);
