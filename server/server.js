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
    origin: [clientUrl, 'http://localhost'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket.io', // Specify the path for Socket.io
});

// Middleware setup
app.use(
  cors({
    origin: [clientUrl, 'http://localhost'],
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(bodyParser.json({ strict: false }));
app.use('/', routes);

// Start the server and sync the database
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully.');

    server.listen(3001, '0.0.0.0', () => {
      console.log('Server is running on http://79.141.65.250:3001'); // Log server start
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

// Initialize socket handlers and log socket creation
socketHandlers(io);
console.log('Socket handlers initialized'); // Log when socket handlers are set up

// Log when a new socket connection is established (this will be handled in socketHandlers)
io.on('connection', (socket) => {
  console.log(`New socket connected: ${socket.id}`); // Log each new socket connection
});