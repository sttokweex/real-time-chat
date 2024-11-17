// src/features/auth/authHooks.ts

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import apiClient from '@/shared/http/axios/axiosInstance';
import { AuthResponse } from '@/shared/types';

export interface UserData {
  username: string;
  password: string;
}

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

export { useLoginMutation, useRegistrationMutation };
