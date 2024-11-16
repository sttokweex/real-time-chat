import React from 'react';

interface ChannelSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ChannelSearch: React.FC<ChannelSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <input
      type="text"
      placeholder="Search channels..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="mb-4 p-2 w-full rounded-md bg-gray-700 text-white placeholder-gray-400"
    />
  );
};

export default ChannelSearch;
