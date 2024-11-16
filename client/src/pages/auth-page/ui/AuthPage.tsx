import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation, useRegistrationMutation } from '@/shared/http';
import ToggleFormButton from './toggleFormButton';

interface FormData {
  username: string;
  password: string;
}

const AuthPage: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegistrationMutation();

  const onSubmit = async (data: FormData) => {
    try {
      if (isLogin) {
        await loginMutation.mutateAsync(data);
      } else {
        await registerMutation.mutateAsync(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {' '}
      {/* Centering the form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
        {' '}
        {/* Form container */}
        <h2 className="text-2xl font-semibold mb-4 text-white text-center">
          {isLogin ? 'Login' : 'Registration'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              {...register('username', { required: true })}
              placeholder="Username"
              type="text"
              className={`w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border ${errors.username ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors.username && (
              <span className="text-red-500 text-sm">Username is required</span>
            )}
          </div>
          <div className="mb-4">
            <input
              {...register('password', { required: true })}
              placeholder="Password"
              type="password"
              className={`w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">Password is required</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black p-2 rounded-md hover:bg-yellow-600 transition duration-200"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <ToggleFormButton isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
    </div>
  );
};

export default AuthPage;
