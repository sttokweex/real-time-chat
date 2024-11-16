import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import apiClient from '../http/axios/axiosInstance';
import { Message, User } from '../type';

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
    socketRef.current = io(socketUrl);
    const socket = socketRef.current;

    socket.emit('setUser', userData.id);

    fetchChannels();

    socket.on('userKicked', (channelName: string) => {
      if (channelName == localStorage.getItem('currentChannel')) {
        setMessages([]);
        setActiveUsers([]);
        setCurrentChannel('');
        localStorage.removeItem('currentChannel');
      }
      setChannels((prevChannels) => {
        const updatedChannels = prevChannels.map((channel) => {
          if (channel.name === channelName) {
            return { ...channel, userRole: 'unstated' };
          }

          return channel;
        });

        return updatedChannels;
      });
    });

    socket.on('userRemoved', (deletedUsername: string) => {
      setActiveUsers((prevActiveUsers) => {
        return prevActiveUsers.filter(
          (username) => username !== deletedUsername,
        );
      });
    });

    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('loadMessages', (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
    });

    socket.on('channelCreated', (newChannel: ChannelResponse) => {
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
    });

    socket.on('updateChannelUsers', (usernames: string[]) => {
      setActiveUsers(usernames);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('loadMessages');
      socket.off('channelCreated');
      socket.off('updateChannelUsers');
      socket.off('userRemoved');
      socket.off('userKicked');

      socket.disconnect();
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
    } catch (error: any) {
      console.error('Error fetching channels:', error);
    }
  };

  const joinChannel = (channelName: string, userId: string) => {
    setCurrentChannel(channelName);
    setMessages([]);

    localStorage.setItem('currentChannel', channelName);

    socketRef.current?.emit('joinChannel', {
      channelName: channelName,
      userId,
    });
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
    console.log(newChannelName);

    if (newChannelName) {
      socketRef.current?.emit('createChannel', {
        name: newChannelName,
        creatorId: userData.id,
      });
    }
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
