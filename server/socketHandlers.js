// src/socketHandlers.js
import { User, Channel, Message } from './models/models.js'; // Import Sequelize models

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a channel
    socket.on('joinChannel', async (channelId) => {
      socket.join(channelId);
      console.log(`User joined channel: ${channelId}`);

      // Send existing messages to the user when they join the channel
      try {
        const channel = await Channel.findOne({ where: { name: channelId } });
        const messages = await Message.findAll({
          where: { channel_id: channel.id },
        });
        socket.emit('loadMessages', messages);
      } catch (err) {
        console.error('Error loading messages:', err.message);
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async ({ channelId, message, username }) => {
      const channel = await Channel.findOne({ where: { name: channelId } });
      const messages = await Message.findAll({
        where: { channel_id: channel.id },
      });
      console.log(channel.id, messages);
      try {
        const newMessage = await Message.create({
          channel_id: channel.id,
          message,
          username,
        });

        // Emit the new message to all users in the channel
        io.to(channelId).emit('receiveMessage', newMessage);
      } catch (err) {
        console.error('Error inserting message:', err.message);
      }
    });

    // Handle creating a new channel
    socket.on('createChannel', async ({ name, creator }) => {
      try {
        const newChannel = await Channel.create({ name, creator });
        io.emit('channelCreated', newChannel); // Notify all clients about the new channel
      } catch (err) {
        console.error('Error creating channel:', err.message);
      }
    });

    // Handle disconnecting users
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

export default socketHandlers;
