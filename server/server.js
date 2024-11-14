// src/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser'; // Ensure body-parser is imported
import sequelize from './dbconnector/db.js'; // Import sequelize instance
import socketHandlers from './sockets/socketHandlers.js'; // Import socket handlers
import routes from './routes/router.js'; // Import channel routes
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { Channel } from './models/models.js';

dotenv.config();

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'; // Fallback URL for development
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

app.use(cookieParser());

app.use(bodyParser.json({ strict: false }));
app.use('/', routes);

(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully.');

    const defaultChannelName = 'general';
    const [channel] = await Channel.findOrCreate({
      where: { name: defaultChannelName },
      defaults: { creatorId: 1 },
    });

    console.log(`Default channel "${channel.name}" is ready.`);

    server.listen(3001, '0.0.0.0', () => {
      console.log('Server is running on http://localhost:3001');
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

socketHandlers(io);
