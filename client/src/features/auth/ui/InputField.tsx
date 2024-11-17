import { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputFieldProps {
  register: UseFormRegister<any>;
  name: string;
  placeholder: string;
  type: string;
  error?: string;
}

const InputField: FC<InputFieldProps> = ({
  register,
  name,
  placeholder,
  type,
  error,
}) => {
  return (
    <div className="mb-4">
      <input
        {...register(name, { required: true })}
        placeholder={placeholder}
        type={type}
        className={`w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border ${error ? 'border-red-500' : 'border-gray-600'}`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default InputField;
