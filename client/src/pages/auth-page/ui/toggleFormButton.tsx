import React from 'react';

interface ToggleFormButtonProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleFormButton: React.FC<ToggleFormButtonProps> = ({
  isLogin,
  setIsLogin,
}) => {
  return (
    <button
      type="button"
      onClick={() => setIsLogin(!isLogin)}
      className="mt-4 w-full bg-gray-700 text-white p-2 rounded-md hover:bg-gray-600 transition duration-200"
    >
      {isLogin
        ? "Don't have an account? Register"
        : 'Already have an account? Login'}
    </button>
  );
};

export default ToggleFormButton;
