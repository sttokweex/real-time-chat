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
    <header>
      <div>{userData.username}</div>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
