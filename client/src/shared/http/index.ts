import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { Refetch } from '../type';
import apiClient from './axios/axiosInstance';

export interface UserData {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  expirationTime: number;
  user: {
    username: string;
    role: string;
  };
}

const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response = await apiClient.get<AuthResponse>(`/refresh`);
    const data = response.data;

    localStorage.setItem(
      'token',
      JSON.stringify({
        token: data.accessToken,
        exp: data.expirationTime,
      }),
    );

    return data;
  } catch (error) {
    localStorage.removeItem('token');
    throw error;
  }
};

const useLoginMutation = (): UseMutationResult<
  AuthResponse,
  unknown,
  UserData,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, UserData>({
    mutationFn: async (data: UserData): Promise<AuthResponse> => {
      const res = await apiClient.post<AuthResponse>(`/login`, data);

      return res.data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['user'], response.user);
      localStorage.setItem(
        'token',
        JSON.stringify({
          token: response.accessToken,
          exp: response.expirationTime,
        }),
      );
    },
  });
};

const useRegistrationMutation = (): UseMutationResult<
  AuthResponse,
  unknown,
  UserData
> => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, UserData>({
    mutationFn: async (data: UserData): Promise<AuthResponse> => {
      const res = await apiClient.post<AuthResponse>(`/registration`, data);

      return res.data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['user'], response.user);
      localStorage.setItem(
        'token',
        JSON.stringify({
          token: response.accessToken,
          exp: response.expirationTime,
        }),
      );
    },
  });
};

const useLogoutMutation = (
  refetchUserData: Refetch,
): UseMutationResult<void, unknown, void> => {
  const queryClient = useQueryClient();

  return useMutation<void>({
    mutationFn: async (): Promise<void> => {
      await apiClient.post(`/logout`, null);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
      localStorage.clear();
      refetchUserData();
    },
  });
};

export {
  useLoginMutation,
  useLogoutMutation,
  useRegistrationMutation,
  refreshToken,
};
