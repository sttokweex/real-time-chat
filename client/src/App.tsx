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

const socket = io('http://localhost:3001'); // Connect to Socket.IO server

const App: React.FC = () => {
    const [channels, setChannels] = useState<string[]>(['general']); // Example channel
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentChannel, setCurrentChannel] = useState<string>('general');
    const [messageInput, setMessageInput] = useState<string>('');
    const [username, setUsername] = useState<string>('Guest'); // Default username

    useEffect(() => {
        // Prompt for username only once when the component mounts
        const user = prompt("Enter your username") || "Guest";
        setUsername(user);

        // Join the default channel when component mounts
        socket.emit('joinChannel', currentChannel);

        // Listen for incoming messages
        socket.on('receiveMessage', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Load messages when joining a channel
        socket.on('loadMessages', (loadedMessages: Message[]) => {
            setMessages(loadedMessages);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('loadMessages');
        };
    }, []); // Empty dependency array ensures this runs only once

    const joinChannel = (channelId: string) => {
        setCurrentChannel(channelId);
        setMessages([]); // Clear previous messages when joining a new channel
        socket.emit('joinChannel', channelId); // Notify server about joining a channel
    };

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (messageInput && currentChannel) {
            socket.emit('sendMessage', { channelId: currentChannel, message: messageInput, username });
            setMessageInput('');
        }
    };

    return (
        <div>
            <h1>Real-Time Chat Application</h1>
            <div>
                <h2>Channels</h2>
                {channels.map((channel) => (
                    <button key={channel} onClick={() => joinChannel(channel)}>
                        {channel}
                    </button>
                ))}
            </div>
            <div>
                <h2>Messages in {currentChannel}</h2>
                <div>
                    {messages.map(msg => (
                        <div key={msg.id}><strong>{msg.username}:</strong> {msg.message}</div>
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
        </div>
    );
}

export default App;