// src/features/auth/authHooks.ts

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { AuthResponse, Refetch } from '@/shared/types';

const API_URL = `http://79.141.65.250/api`;

const apiAuth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
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
      const res = await apiAuth.post<AuthResponse>(`/login`, data);

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
      await apiAuth.post(`/logout`, null);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
      localStorage.clear();
      refetchUserData();
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
      const res = await apiAuth.post<AuthResponse>(`/registration`, data);

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

export { useLoginMutation, useRegistrationMutation, useLogoutMutation };
