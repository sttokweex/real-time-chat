// src/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import sequelize from './db.js'; // Import the sequelize instance
import { User, Channel, Message } from './models/models.js'; // Import models
import socketHandlers from './socketHandlers.js'; // Import socket handlers

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost', // Allow requests from this origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware for CORS and JSON parsing
app.use(
  cors({
    origin: 'http://localhost',
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);
app.use(express.json());

// API endpoint to get all channels
app.get('/api/channels', async (req, res) => {
  try {
    const channels = await Channel.findAll(); // Await the result of findAll
    res.json(channels); // Send the channels as a JSON response
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' }); // Send an error response if something goes wrong
  }
});

// Sync database and create tables if they do not exist
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Synchronize all defined models to the DB.
    console.log('All models were synchronized successfully.');

    const defaultChannelName = 'general';
    const [channel] = await Channel.findOrCreate({
      where: { name: defaultChannelName },
      defaults: { creator: 'System' },
    });
    console.log(`Default channel "${channel.name}" is ready.`);
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDatabase();

// Initialize socket handlers
socketHandlers(io);

// Start the server
server.listen(3001, '0.0.0.0', () => {
  console.log('Server is running on http://localhost:3001');
});
