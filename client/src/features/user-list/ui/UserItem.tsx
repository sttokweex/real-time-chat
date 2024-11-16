import React from 'react';
import { FaUser, FaTrashAlt } from 'react-icons/fa';

interface UserItemProps {
  username: string;
  isCurrentUser: boolean;
  isAdmin: boolean;
  onDeleteUser: (username: string) => void;
}

const UserItem: React.FC<UserItemProps> = ({
  username,
  isCurrentUser,
  isAdmin,
  onDeleteUser,
}) => {
  return (
    <li
      className={`flex justify-between items-center p-3 rounded-lg transition duration-150 ${
        isCurrentUser ? 'bg-blue-600' : 'bg-gray-800'
      } hover:bg-gray-700 cursor-pointer border border-gray-600`}
    >
      <div className="flex items-center">
        <FaUser className="text-yellow-500 mr-2" />
        <span className="text-white">{username}</span>
      </div>
      {isAdmin && !isCurrentUser && (
        <button
          onClick={() => onDeleteUser(username)}
          className="text-red-400 hover:text-red-300 transition duration-200"
        >
          <FaTrashAlt />
        </button>
      )}
    </li>
  );
};

export default UserItem;
