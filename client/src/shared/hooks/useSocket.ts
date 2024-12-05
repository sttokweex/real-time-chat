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
    }

    const socket = socketRef.current;

    socket.emit('setUser', userData.id);
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

    socketRef.current?.emit('joinChannel', { channelName, userId });
  };

  const changeChannel = (oldChannelName: string) => {
    socketRef.current?.emit('changeChannel', oldChannelName);
  };

  const deleteUser = (
    channelName: string,
    deletedUsername: string,
    userCreatorId: string,
  ) => {
    socketRef.current?.emit('removeUserFromChannel', {
      channelName,
      deletedUsername,
      userCreatorId,
    });
  };

  const sendMessage = (messageInput: string) => {
    if (messageInput && currentChannel) {
      socketRef.current?.emit('sendMessage', {
        channelName: currentChannel,
        message: messageInput,
        userId: userData.id,
      });
    }
  };

  const createChannel = (newChannelName: string) => {
    if (newChannelName) {
      socketRef.current?.emit('createChannel', {
        name: newChannelName,
        creatorId: userData.id,
      });
    }
  };

  const handleUserKicked = (channelName: string) => {
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
    setActiveUsers((prevActiveUsers) =>
      prevActiveUsers.filter((username) => username !== deletedUsername),
    );
  };

  const handleReceiveMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleLoadMessages = (loadedMessages: Message[]) => {
    setMessages(loadedMessages);
  };

  const handleChannelCreated = (newChannel: ChannelResponse) => {
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
