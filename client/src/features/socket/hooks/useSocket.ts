import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Message, User } from '@/shared/type/index';

const useSocket = (socketUrl: string, userData: User) => {
  const [channels, setChannels] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string>('');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isCreatorChannel, setIsCreatorChannel] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(socketUrl);
    const socket = socketRef.current;

    fetchChannels();
    socket.on('userRemoved', (deletedUsername: string) => {
      if (deletedUsername === userData.username) {
        setMessages([]);
        setCurrentChannel('');
      }
      setActiveUsers((prevActiveUsers) =>
        prevActiveUsers.filter((username) => username !== deletedUsername),
      );
    });

    socket.on('isCreator', (isCreator: boolean) => {
      setIsCreatorChannel(isCreator);
    });
    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('loadMessages', (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
    });

    socket.on('channelCreated', (newChannel: { name: string }) => {
      setChannels((prevChannels) => [...prevChannels, newChannel.name]);
    });

    socket.on('updateChannelUsers', (usernames: string[]) => {
      setActiveUsers(usernames);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('loadMessages');
      socket.off('channelCreated');
      socket.off('updateChannelUsers');
      socket.disconnect();
    };
  }, [socketUrl]);

  const fetchChannels = async () => {
    try {
      const response = await fetch(`${socketUrl}/api/channels`);

      if (!response.ok) throw new Error('Failed to fetch channels');
      const data = await response.json();
      const channelNames = data.map(
        (channel: { name: string }) => channel.name,
      );
      setChannels(channelNames);

      if (channelNames.length > 0) {
        setCurrentChannel(channelNames[0]);
        joinChannel(channelNames[0], userData.id);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const joinChannel = (channelId: string, userId: string) => {
    setCurrentChannel(channelId);
    setMessages([]);

    socketRef.current?.emit('joinChannel', { channelName: channelId, userId });
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
        channelId: currentChannel,
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

  return {
    channels,
    messages,
    currentChannel,
    activeUsers,
    isRegistered,
    setIsRegistered,
    joinChannel,
    createChannel,
    sendMessage,
    isCreatorChannel,
    deleteUser,
  };
};

export default useSocket;
