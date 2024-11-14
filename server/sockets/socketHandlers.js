import { Channel, Message, User, ChannelUser } from '../models/models.js';

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinChannel', async ({ channelName, userId }) => {
      socket.join(channelName);
      console.log(`User joined channel: ${channelName}`);

      try {
        const channel = await Channel.findOne({ where: { name: channelName } });

        if (!channel) {
          console.error('Channel not found:', channelName);

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

        io.to(channelName).emit('loadMessages', messagesWithUsernames);
        io.to(channelName).emit('updateChannelUsers', usernamesInChannel);
      } catch (err) {
        console.error('Error loading messages or users:', err.message);
      }
    });

    socket.on('sendMessage', async ({ channelId, message, userId }) => {
      try {
        const channel = await Channel.findOne({ where: { name: channelId } });

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

        io.to(channelId).emit('receiveMessage', messageWithUsername);
      } catch (err) {
        console.error('Error inserting message:', err.message);
      }
    });

    socket.on('createChannel', async ({ name, creatorId }) => {
      try {
        const newChannel = await Channel.create({ name, creatorId });
        io.emit('channelCreated', newChannel);
      } catch (err) {
        console.error('Error creating channel:', err.message);
      }
    });
    socket.on(
      'removeUserFromChannel',
      async ({ channelName, deletedUsername, userCreatorId }) => {
        try {
          const deletedUser = await User.findOne({
            where: { username: deletedUsername },
          });
          const channel = await Channel.findOne({
            where: { name: channelName },
          });

          if (userCreatorId != channel.creatorId) {
            return socket.emit('error', { message: 'Channel not found' });
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
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

export default socketHandlers;
