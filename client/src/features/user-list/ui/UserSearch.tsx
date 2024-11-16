import React from 'react';

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <input
      type="text"
      placeholder="Search users..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="mb-4 p-2 w-full rounded-md bg-gray-800 text-white placeholder-gray-400"
    />
  );
};

export default UserSearch;
