import React, { useState } from 'react';
import UserItem from './UserItem';
import UserSearch from './UserSearch';

interface UsersListProps {
  activeUsers: string[];
  currentChannel: string;
  userData: { username: string; id: string };
  isAdmin: boolean;
  onDeleteUser: (username: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  activeUsers,
  currentChannel,
  userData,
  isAdmin,
  onDeleteUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = activeUsers.filter((username) =>
    username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-gray-900 shadow-md p-4 h-full">
      {filteredUsers.length !== 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-white text-center">
            Users on {currentChannel}
          </h2>

          <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </>
      )}

      {filteredUsers.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400 text-center">
            No active users. Please join a channel to see active users.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredUsers.map((username) => (
            <UserItem
              key={username}
              username={username}
              isCurrentUser={username === userData.username}
              isAdmin={isAdmin}
              onDeleteUser={onDeleteUser}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersList;
