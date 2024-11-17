import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AuthResponse, Refetch } from '../types';
import apiClient from './axios/axiosInstance';

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
export { refreshToken, useLogoutMutation };
