import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import apiClient from '../http/axios/axiosInstance';
import { Message, User } from '../types';

interface Channel {
  id: string;
  name: string;
  userRole: string;
}

interface ChannelResponse {
  id: string;
  name: string;
  creatorId: string;
}

const useSocket = (socketUrl: string, userData: User) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string>('');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(socketUrl);
      console.log('Socket connected:', socketUrl); // Log when socket connects
    }

    const socket = socketRef.current;

    socket.emit('setUser', userData.id);
    console.log('User set:', userData.id); // Log user ID when setting

    fetchChannels();

    socket.on('userKicked', handleUserKicked);
    socket.on('userRemoved', handleUserRemoved);
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('loadMessages', handleLoadMessages);
    socket.on('channelCreated', handleChannelCreated);
    socket.on('updateChannelUsers', handleUpdateChannelUsers);

    return () => {
      socket.off('userKicked', handleUserKicked);
      socket.off('userRemoved', handleUserRemoved);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('loadMessages', handleLoadMessages);
      socket.off('channelCreated', handleChannelCreated);
      socket.off('updateChannelUsers', handleUpdateChannelUsers);

      if (socket) {
        console.log('Disconnecting socket'); // Log before disconnecting
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [socketUrl, userData.id]);

  const fetchChannels = async () => {
    try {
      const response = await apiClient.get('/channels');

      if (response.status !== 200) throw new Error('Failed to fetch channels');

      const updatedChannels = response.data.map((channel: Channel) => ({
        id: channel.id,
        name: channel.name,
        userRole: channel.userRole,
      }));

      setChannels(updatedChannels);

      const savedChannel = localStorage.getItem('currentChannel');

      if (savedChannel) {
        const existingChannel = updatedChannels.find(
          (channel: Channel) => channel.name === savedChannel,
        );

        if (existingChannel) {
          joinChannel(existingChannel.name, userData.id);
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const joinChannel = (channelName: string, userId: string) => {
    setCurrentChannel(channelName);
    setMessages([]);
    localStorage.setItem('currentChannel', channelName);

    console.log(`Joining channel: ${channelName} for user ID: ${userId}`); // Log channel joining
    socketRef.current?.emit('joinChannel', { channelName, userId });
  };

  const changeChannel = (oldChannelName: string) => {
    console.log(`Changing channel from ${oldChannelName}`); // Log channel change
    socketRef.current?.emit('changeChannel', oldChannelName);
  };

  const deleteUser = (
    channelName: string,
    deletedUsername: string,
    userCreatorId: string,
  ) => {
    console.log(`Deleting user ${deletedUsername} from channel ${channelName}`); // Log user deletion
    socketRef.current?.emit('removeUserFromChannel', {
      channelName,
      deletedUsername,
      userCreatorId,
    });
  };

  const sendMessage = (messageInput: string) => {
    if (messageInput && currentChannel) {
      console.log(`Sending message to ${currentChannel}: ${messageInput}`); // Log message sending
      socketRef.current?.emit('sendMessage', {
        channelName: currentChannel,
        message: messageInput,
        userId: userData.id,
      });
    } else {
      console.warn('Message input is empty or no current channel'); // Warn if no message or channel
    }
  };

  const createChannel = (newChannelName: string) => {
    if (newChannelName) {
      console.log(`Creating new channel: ${newChannelName}`); // Log new channel creation
      socketRef.current?.emit('createChannel', {
        name: newChannelName,
        creatorId: userData.id,
      });
    }
  };

  const handleUserKicked = (channelName: string) => {
    console.log(`User kicked from channel: ${channelName}`); // Log when a user is kicked
    if (channelName === localStorage.getItem('currentChannel')) {
      setMessages([]);
      setActiveUsers([]);
      setCurrentChannel('');
      localStorage.removeItem('currentChannel');
    }

    setChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel.name === channelName
          ? { ...channel, userRole: 'unstated' }
          : channel,
      ),
    );
  };

  const handleUserRemoved = (deletedUsername: string) => {
    console.log(`User removed: ${deletedUsername}`); // Log when a user is removed
    setActiveUsers((prevActiveUsers) =>
      prevActiveUsers.filter((username) => username !== deletedUsername),
    );
  };

  const handleReceiveMessage = (message: Message) => {
    console.log(`Message received in ${currentChannel}:`, message); // Log received messages
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleLoadMessages = (loadedMessages: Message[]) => {
    console.log(`Loading messages for ${currentChannel}:`, loadedMessages); // Log loaded messages
    setMessages(loadedMessages);
  };

  const handleChannelCreated = (newChannel: ChannelResponse) => {
    console.log(`New channel created: ${newChannel.name}`); // Log new channels created
    const role = newChannel.creatorId === userData.id ? 'admin' : 'unstated';

    if (newChannel.creatorId === userData.id) {
      joinChannel(newChannel.name, userData.id);
    }

    const channelData = {
      id: newChannel.id,
      name: newChannel.name,
      userRole: role,
    };

    setChannels((prevChannels) => [...prevChannels, channelData]);
  };

  const handleUpdateChannelUsers = (usernames: string[]) => {
    console.log(`Updating active users in the current channel:` , usernames); // Log active users update
    setActiveUsers(usernames);
  };

  return {
    channels,
    messages,
    currentChannel,
    activeUsers,
    isRegistered,
    setChannels,
    setIsRegistered,
    joinChannel,
    createChannel,
    sendMessage,
    changeChannel,
    deleteUser,
  };
};

export default useSocket;