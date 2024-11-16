// ChannelItem.tsx
import React from 'react';
import { FaCrown, FaArrowRight } from 'react-icons/fa';

interface ChannelItemProps {
  channel: { id: string; name: string; userRole: string };
  isCurrent: boolean;
  onClick: () => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  isCurrent,
  onClick,
}) => {
  return (
    <li
      onClick={onClick}
      className={`relative flex items-center justify-between p-3 rounded-md shadow-lg transition duration-150 ${
        isCurrent ? 'bg-blue-600' : 'bg-gray-800'
      } ${!isCurrent ? 'hover:bg-gray-700 cursor-pointer' : ''} border border-gray-600`}
    >
      {channel.userRole === 'admin' && (
        <FaCrown className="absolute top-[-10px] left-[50%] transform -translate-x-[50%] h-6 w-6 text-yellow-500" />
      )}
      <span className="font-medium text-white">{channel.name}</span>
      <FaArrowRight className="text-yellow-500" />
    </li>
  );
};

export default ChannelItem;
