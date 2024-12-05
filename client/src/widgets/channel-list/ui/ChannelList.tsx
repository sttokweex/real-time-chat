import React, { useState } from 'react';
import { FaDoorOpen } from 'react-icons/fa';
import {
  ChannelItem,
  ChannelSearch,
  CreateChannelModal,
  FindChannelsButton,
} from '@/features/channels';
import { User } from '../../../shared/types';

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
  changeChannel: (channelName: string) => void;
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
  createChannel: (channelName: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  joinChannel,
  currentChannel,
  userData,
  setChannels,
  changeChannel,
  createChannel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFindChannels, setShowFindChannels] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateChannel = (newChannelName: string) => {
    createChannel(newChannelName);
    setIsModalOpen(false);
  };

  const channelsWithNoRole = channels.filter(
    (channel) => channel.userRole === 'unstated',
  );

  const channelsWithRole = channels.filter(
    (channel) => channel.userRole !== 'unstated',
  );

  const filteredChannelsWithNoRole = channelsWithNoRole.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredChannels = channelsWithRole.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative p-4 pb-2 shadow-md bg-gray-900 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-white text-center">
        Channels
      </h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-yellow-500 w-full text-black p-2 rounded-md hover:bg-yellow-600 transition duration-200"
      >
        Create Channel
      </button>

      <CreateChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateChannel={handleCreateChannel}
      />

      {isModalOpen && (
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
      )}

      <ChannelSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div
        className={`overflow-y-auto transition-all duration-300 ${showFindChannels ? 'max-h-[0]' : 'max-h-[66.5vh]'}`}
      >
        <ul className="space-y-4 pt-2">
          {filteredChannels.map((channel) => {
            const isCurrent = currentChannel === channel.name;

            return (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isCurrent={isCurrent}
                onClick={() => {
                  if (!isCurrent) {
                    changeChannel(currentChannel);
                    joinChannel(channel.name, userData.id);
                  }
                }}
              />
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <FindChannelsButton
          showFindChannels={showFindChannels}
          toggleFindChannels={() => {
            setShowFindChannels(!showFindChannels);
            setSearchTerm('');
          }}
        />

        {showFindChannels && (
          <ul className="mt-2 space-y-2 overflow-y-auto max-h-[calc(65vh)]">
            {channelsWithNoRole.length > 0 ? (
              filteredChannelsWithNoRole.map((channel) => (
                <li
                  key={channel.id}
                  className="flex justify-between items-center p-3 rounded-md hover:bg-gray-700 cursor-pointer border border-gray-600"
                  onClick={() => {
                    joinChannel(channel.name, userData.id);
                    setChannels((prevChannels) =>
                      prevChannels.map((ch) =>
                        ch.id === channel.id
                          ? { ...ch, userRole: 'member' }
                          : ch,
                      ),
                    );
                    setShowFindChannels(false);
                  }}
                >
                  <span className="text-white">{channel.name}</span>
                  <FaDoorOpen className="text-white" />
                </li>
              ))
            ) : (
              <li className="p-3 text-white text-center">
                No channels available to join.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChannelList;
