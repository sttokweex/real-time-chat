// src/components/AuthPage/AuthPage.tsx

import { FC, useState } from 'react';
import { AuthForm, AuthHeader } from '@/features/auth';
import ToggleFormButton from './toggleFormButton';

const AuthPage: FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <AuthHeader isLogin={isLogin} />
        <AuthForm isLogin={isLogin} />
        <ToggleFormButton isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
    </div>
  );
};

export default AuthPage;
