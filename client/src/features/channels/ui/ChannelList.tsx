// src/features/channels/ChannelList.tsx
import React, { useState } from 'react';
import { User } from '@/shared/type';

interface ChannelListProps {
  userData: User;
  channels: string[];
  joinChannel: (channelId: string, userId: string) => void;
  createChannel: (channelName: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  joinChannel,
  userData,
  createChannel,
}) => {
  const [newChannelName, setNewChannelName] = useState('');

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();

    if (newChannelName.trim()) {
      createChannel(newChannelName);
      setNewChannelName('');
    }
  };

  return (
    <div>
      <h2>Channels</h2>
      <form onSubmit={handleCreateChannel}>
        <input
          type="text"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          placeholder="Enter channel name"
          required
        />
        <button type="submit">Create Channel</button>
      </form>
      {channels.map((channel) => (
        <button key={channel} onClick={() => joinChannel(channel, userData.id)}>
          {channel}
        </button>
      ))}
    </div>
  );
};

export default ChannelList;
