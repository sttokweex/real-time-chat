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
    <button type="button" onClick={() => setIsLogin(!isLogin)}>
      {isLogin
        ? "Don't have an account? Register"
        : 'Already have an account? Login'}
    </button>
  );
};

export default ToggleFormButton;
