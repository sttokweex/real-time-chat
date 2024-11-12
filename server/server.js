// src/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import socketHandlers from './socketHandlers.js'; // Import socket handlers
import userRoutes from './userRoutes.js'; // Import user routes

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow requests from this origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware for CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());


// Initialize socket handlers
socketHandlers(io);

// Start the server
server.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});