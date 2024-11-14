import React from 'react';
import { Message } from '@/shared/type/index';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div>
      <h2>Messages</h2>
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.username}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
