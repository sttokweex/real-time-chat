// src/socketHandlers.js
import db from './db.js';

const socketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Join a channel
        socket.on('joinChannel', (channelId) => {
            socket.join(channelId);
            console.log(`User joined channel: ${channelId}`);

            // Send existing messages to the user when they join the channel
            db.all('SELECT * FROM messages WHERE channel_id = ?', [channelId], (err, rows) => {
                if (!err) {
                    socket.emit('loadMessages', rows);
                }
            });
        });

        // Handle sending messages
        socket.on('sendMessage', ({ channelId, message, username }) => {
            db.run('INSERT INTO messages (channel_id, message, username) VALUES (?, ?, ?)', [channelId, message, username], function(err) {
                if (err) {
                    console.error("Error inserting message:", err.message);
                    return;
                }
                const newMessage = { id: this.lastID, channel_id: channelId, message, username, timestamp: new Date() };
                io.to(channelId).emit('receiveMessage', newMessage);
            });
        });

        // Handle creating a new channel
        socket.on('createChannel', ({ name, creator }) => {
            db.run('INSERT INTO channels (name, creator) VALUES (?, ?)', [name, creator], function(err) {
                if (err) {
                    console.error("Error creating channel:", err.message);
                    return;
                }
                const newChannel = { id: this.lastID, name, creator };
                io.emit('channelCreated', newChannel); // Notify all clients about the new channel
            });
        });

        // Handle disconnecting users
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};

export default socketHandlers;