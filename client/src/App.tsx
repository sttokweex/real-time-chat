// src/App.tsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface Message {
  id: number;
  channel_id: string;
  message: string;
  username: string;
  timestamp: string;
}

interface Channel {
  id: number;
  name: string;
  creator: string;
}

const socket = io('http://localhost:3001'); // Connect to Socket.IO server

const App: React.FC = () => {
  const [channels, setChannels] = useState<string[]>([]); // Start with an empty array
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string>(''); // Initialize as empty
  const [messageInput, setMessageInput] = useState<string>('');
  const [username, setUsername] = useState<string>(''); // Default username
  const [newChannelName, setNewChannelName] = useState<string>(''); // State for new channel name
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // State to track registration

  useEffect(() => {
    // Fetch existing channels from the server when component mounts
    fetchChannels();

    // Listen for incoming messages
    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Load messages when joining a channel
    socket.on('loadMessages', (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
    });

    // Listen for newly created channels
    socket.on('channelCreated', (newChannel: Channel) => {
      setChannels((prevChannels) => [...prevChannels, newChannel.name]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('loadMessages');
      socket.off('channelCreated');
    };
  }, []); // Empty dependency array ensures this runs only once

  const fetchChannels = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/channels'); // Adjust this endpoint as needed
      if (!response.ok) throw new Error('Failed to fetch channels');
      const data = await response.json();
      const channelNames = data.map(
        (channel: { name: string }) => channel.name,
      ); // Assuming data contains an array of channels with a name property

      setChannels(channelNames); // Set the channels state

      // Automatically join the first channel if it exists
      if (channelNames.length > 0) {
        setCurrentChannel(channelNames[0]); // Set current channel to the first one
        socket.emit('joinChannel', channelNames[0]); // Join the first channel on load
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const joinChannel = (channelId: string) => {
    setCurrentChannel(channelId);
    setMessages([]); // Clear previous messages when joining a new channel
    socket.emit('joinChannel', channelId); // Notify server about joining a channel
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageInput && currentChannel) {
      socket.emit('sendMessage', {
        channelId: currentChannel,
        message: messageInput,
        username,
      });
      setMessageInput('');
    }
  };

  const createChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newChannelName) {
      socket.emit('createChannel', { name: newChannelName, creator: username });
      setNewChannelName(''); // Clear input after creating the channel
    }
  };

  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      setIsRegistered(true);
      socket.emit('joinChannel', currentChannel); // Join the default or first available channel after registration
    }
  };

  return (
    <div>
      <h1>Real-Time Chat Application</h1>

      {!isRegistered ? (
        <form onSubmit={handleRegistration}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <button type="submit">Register</button>
        </form>
      ) : (
        <>
          <div>
            <h2>Channels</h2>
            {channels.map((channel) => (
              <button key={channel} onClick={() => joinChannel(channel)}>
                {channel}
              </button>
            ))}
            <form onSubmit={createChannel}>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="New Channel Name"
                required
              />
              <button type="submit">Create Channel</button>
            </form>
          </div>
          <div>
            <h2>Messages in {currentChannel}</h2>
            <div>
              {messages.map((msg) => (
                <div key={msg.id}>
                  <strong>{msg.username}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message"
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
