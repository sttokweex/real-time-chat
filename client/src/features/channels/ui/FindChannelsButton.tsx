import React from 'react';

interface FindChannelsButtonProps {
  showFindChannels: boolean;
  toggleFindChannels: () => void;
}

const FindChannelsButton: React.FC<FindChannelsButtonProps> = ({
  showFindChannels,
  toggleFindChannels,
}) => {
  return (
    <button
      onClick={toggleFindChannels}
      className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
    >
      {showFindChannels ? 'Hide Channels' : 'Find Channels'}
    </button>
  );
};

export default FindChannelsButton;
