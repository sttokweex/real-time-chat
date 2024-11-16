import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (channelName: string) => void;
}

const CreateChannelModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onCreateChannel,
}) => {
  const [channelName, setChannelName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (channelName.trim()) {
      onCreateChannel(channelName);
      setChannelName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Create Channel
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter channel name"
            required
            className="border border-gray-600 rounded-md p-3 w-full mb-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-yellow-500 text-black p-2 rounded-md hover:bg-yellow-600 transition duration-200"
            >
              Create Channel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;
