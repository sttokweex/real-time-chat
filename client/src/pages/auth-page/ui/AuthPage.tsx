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
    <div>
      <h2>{isLogin ? 'Login' : 'Registration'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register('username', { required: true })}
            placeholder="Username"
            type="text"
          />
          {errors.username && <span>Username is required</span>}
          <input
            {...register('password', { required: true })}
            placeholder="Password"
            type="password"
          />
          {errors.password && <span>Password is required</span>}
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <ToggleFormButton isLogin={isLogin} setIsLogin={setIsLogin} />
    </div>
  );
};

export default AuthPage;
