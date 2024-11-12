import { User, Channel, Message } from './models/models.js';

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinChannel', async (channelName) => {
      socket.join(channelName);
      console.log(`User joined channel: ${channelName}`);

      try {
        const channel = await Channel.findOne({ where: { name: channelName } });
        const messages = await Message.findAll({
          where: { channel_id: channel.id },
        });
        socket.emit('loadMessages', messages);
      } catch (err) {
        console.error('Error loading messages:', err.message);
      }
    });

    socket.on('sendMessage', async ({ channelId, message, username }) => {
      const channel = await Channel.findOne({ where: { name: channelId } });
      const messages = await Message.findAll({
        where: { channel_id: channel.id },
      });

      try {
        const newMessage = await Message.create({
          channel_id: channel.id,
          message,
          username,
        });

        io.to(channelId).emit('receiveMessage', newMessage);
      } catch (err) {
        console.error('Error inserting message:', err.message);
      }
    });

    socket.on('createChannel', async ({ name, creator }) => {
      try {
        const newChannel = await Channel.create({ name, creator });
        io.emit('channelCreated', newChannel);
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
