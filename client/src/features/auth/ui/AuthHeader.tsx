import { FC } from 'react';

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader: FC<AuthHeaderProps> = ({ isLogin }) => {
  return (
    <h2 className="text-2xl font-semibold mb-4 text-white text-center">
      {isLogin ? 'Login' : 'Registration'}
    </h2>
  );
};

export default AuthHeader;
