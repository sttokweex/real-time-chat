import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation, useRegistrationMutation } from '../../auth';
import InputField from './InputField';

interface FormData {
  username: string;
  password: string;
}

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm: FC<AuthFormProps> = ({ isLogin }) => {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        register={register}
        name="username"
        placeholder="Username"
        type="text"
        error={errors.username ? 'Username is required' : undefined}
      />
      <InputField
        register={register}
        name="password"
        placeholder="Password"
        type="password"
        error={errors.password ? 'Password is required' : undefined}
      />
      <button
        type="submit"
        className="w-full bg-yellow-500 text-black p-2 rounded-md hover:bg-yellow-600 transition duration-200"
      >
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;
