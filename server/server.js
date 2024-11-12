// src/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import sequelize from './db.js'; // Импорт экземпляра sequelize
import socketHandlers from './socketHandlers.js'; // Импорт обработчиков сокетов
import routes from './routes/index.js'; // Импорт маршрутов каналов
import dotenv from 'dotenv';

dotenv.config();
const clientUrl = process.env.CLIENT_URL;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(
  cors({
    origin: clientUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);

app.use(express.json());

app.use('/', routes);

await sequelize.sync();

// const defaultChannelName = 'general';
// const [channel] = await Channel.findOrCreate({
//   where: { name: defaultChannelName },
//   defaults: { creator: 'System' },
// });
// console.log(`Default channel "${channel.name}" is ready.`);

socketHandlers(io);

server.listen(3001, '0.0.0.0', () => {
  console.log('Server is running on http://localhost:3001');
});
