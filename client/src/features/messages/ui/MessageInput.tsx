import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface MessageInputProps {
  currentChannel: string;
  sendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  currentChannel,
  sendMessage,
}) => {
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (messageInput.trim() && currentChannel) {
      sendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex items-center w-full bg-gray-800  shadow-md"
    >
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type a message"
        required
        className="flex-grow h-full p-2 border border-gray-600 bg-gray-700 text-white  placeholder-gray-400 transition duration-200 ease-in-out focus:outline-none" // Removed focus ring styles
      />
      <button
        type="submit"
        className="flex items-center justify-center p-2  bg-yellow-500  hover:bg-yellow-400 transition duration-200 ease-in-out"
      >
        <FaPaperPlane className="h-5 w-5 text-white" />
      </button>
    </form>
  );
};

export default MessageInput;
