import React, { useState } from 'react';

interface MessageInputProps {
  currentChannel: string;
  username: string;
  sendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  currentChannel,
  sendMessage,
}) => {
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (messageInput && currentChannel) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type a message"
        required
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
