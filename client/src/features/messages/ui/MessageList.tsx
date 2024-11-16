import React from 'react';
import { Message } from '@/shared/type/index';

interface MessageListProps {
  messages: Message[];
  currentChannel: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentChannel,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-800 p-4 shadow-md overflow-y-auto">
      {currentChannel === '' ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400 text-center">
            Please join a channel to start chatting.
          </p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400 text-center">No messages yet.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <strong className="text-yellow-400">{msg.username}:</strong>
            <span className="ml-2 text-white">{msg.message}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
