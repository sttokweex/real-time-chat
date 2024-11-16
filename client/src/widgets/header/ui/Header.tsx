import React from 'react';
import { useLogoutMutation } from '@/shared/http';
import { Refetch, User } from '@/shared/type';

export interface HeaderProps {
  userData: User;
  refetch: Refetch;
}

const Header: React.FC<HeaderProps> = ({ userData, refetch }) => {
  const mutationLogout = useLogoutMutation(refetch);

  const handleLogout = () => {
    mutationLogout.mutate();
  };

  return (
    <header className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center mb-4 border-b-2 border-gray-700">
      <div className="text-xl font-bold text-yellow-400">
        {userData.username}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
