import { Channel, Message, User, ChannelUser } from '../models/models.js';

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id); // Log when a user connects

    socket.on('setUser', (userId) => {
      socket.userId = userId;
      console.log(`User set: ${userId}`); // Log user ID when set
    });

    socket.on('joinChannel', async ({ channelName, userId }) => {
      console.log(`${userId} joining channel: ${channelName}`); // Log joining channel
      socket.join(channelName);

      try {
        const channel = await Channel.findOne({ where: { name: channelName } });

        if (!channel) {
          console.error(`Channel not found: ${channelName}`);
          return;
        }

        await ChannelUser.findOrCreate({
          where: {
            userId,
            channelId: channel.id,
          },
        });

        const messages = await Message.findAll({
          where: { channel_id: channel.id },
          include: [{ model: User, attributes: ['username'] }],
          order: [['createdAt', 'ASC']],
        });

        const messagesWithUsernames = messages.map((message) => ({
          ...message.toJSON(),
          username: message.user.username,
        }));

        const channelUsers = await ChannelUser.findAll({
          where: { channelId: channel.id },
        });

        const userIds = channelUsers.map((channelUser) => channelUser.userId);

        const users = await User.findAll({
          where: {
            id: userIds,
          },
        });

        const usernamesInChannel = users.map((user) => user.username);
        socket.emit('loadMessages', messagesWithUsernames);
        io.to(channelName).emit('updateChannelUsers', usernamesInChannel);
      } catch (err) {
        console.error('Error loading messages or users:', err.message);
      }
    });

    socket.on('sendMessage', async ({ channelName, message, userId }) => {
      console.log(`Message from ${userId} in ${channelName}: ${message}`); // Log message details
      try {
        const channel = await Channel.findOne({ where: { name: channelName } });

        if (!channel) {
          console.error('Channel not found for ID:', channelName);
          return;
        }

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
          console.error('User not found for ID:', userId);
          return;
        }

        const newMessage = await Message.create({
          channel_id: channel.id,
          message,
          userId,
        });

        const messageWithUsername = {
          ...newMessage.toJSON(),
          username: user.username,
        };

        io.to(channelName).emit('receiveMessage', messageWithUsername);
      } catch (err) {
        console.error('Error inserting message:', err.message);
      }
    });

    socket.on('createChannel', async ({ name, creatorId }) => {
      console.log(`Creating new channel: ${name} by user ID: ${creatorId}`); // Log new channel creation
      try {
        const existingChannel = await Channel.findOne({
          where: { name },
        });

        if (existingChannel) {
          console.warn(`Channel already exists: ${name}`);
          return;
        }

        const newChannel = await Channel.create({ name, creatorId });
        io.emit('channelCreated', newChannel);
      } catch (err) {
        console.error('Error creating channel:', err.message);
      }
    });

    socket.on(
      'removeUserFromChannel',
      async ({ channelName, deletedUsername, userCreatorId }) => {
        console.log(`Removing user ${deletedUsername} from channel ${channelName}`); // Log user removal
        try {
          const deletedUser = await User.findOne({
            where: { username: deletedUsername },
          });

          if (!deletedUser) {
            return socket.emit('error', { message: 'User not found' });
          }
          
          const kickedSocket = Array.from(io.sockets.sockets.values()).find(
            (s) => s.userId === deletedUser.id,
          );

          if (kickedSocket) {
            kickedSocket.leave(channelName);
            kickedSocket.leave(`${channelName}All`);
            kickedSocket.emit('userKicked', channelName);
            console.log(`User ${deletedUsername} has been kicked from ${channelName}`); // Log successful kick
          }

          const channel = await Channel.findOne({
            where: { name: channelName },
          });

          if (!channel || userCreatorId !== channel.creatorId) {
            return socket.emit('error', { message: 'Unauthorized action' });
          }

          await ChannelUser.destroy({
            where: { channelId: channel.id, userId: deletedUser.id },
          });
          
          io.to(channelName).emit('userRemoved', deletedUsername);
        } catch (error) {
          console.error('Error removing user:', error.message);
        }
      },
    );

    socket.on('changeChannel', async (oldChannelName) => {
      console.log(`${socket.userId} leaving ${oldChannelName}`); // Log when a user leaves a channel
      socket.leave(oldChannelName);
    });

    socket.on('disconnect', () => {
      console.log(`A user disconnected: ${socket.id}`); // Log when a user disconnects
    });
  });
};

export default socketHandlers;