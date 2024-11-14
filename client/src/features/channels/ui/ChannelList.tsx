import React, { useState } from 'react';
import { User } from '@/shared/type';

interface Channel {
  id: string;
  name: string;
  userRole: string;
}

interface ChannelListProps {
  userData: User;
  channels: Channel[];
  currentChannel: string;
  joinChannel: (channelId: string, userId: string) => void;
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
  createChannel: (channelName: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  joinChannel,
  currentChannel,
  userData,
  setChannels,
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
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            <span>{channel.name}</span>
            {channel.userRole !== 'unstated' ? (
              <>
                {currentChannel !== channel.name && (
                  <>
                    <button
                      onClick={() => {
                        joinChannel(channel.name, userData.id);
                      }}
                    >
                      Open Channel
                    </button>
                    <span> You are a {`${channel.userRole}`}</span>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  joinChannel(channel.name, userData.id);
                  setChannels((prevChannels) =>
                    prevChannels.map((ch) =>
                      ch.id === channel.id ? { ...ch, userRole: 'member' } : ch,
                    ),
                  );
                }}
              >
                Join Channel
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
