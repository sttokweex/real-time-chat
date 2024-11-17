import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { refreshToken } from '@/shared/http';
import { useLogoutMutation } from '@/shared/http';
import { User } from '@/shared/types';

const useAuth = () => {
  const queryClient = useQueryClient();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery<User | undefined>({
    queryKey: ['user'],
    queryFn: () => {
      return queryClient.getQueryData<User>(['user']);
    },
    placeholderData: undefined,
    staleTime: Infinity,
  });

  const mutationLogout = useLogoutMutation(refetch);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      refreshToken()
        .then((response) => {
          if (response.user) {
            console.log(response.user);
            queryClient.setQueryData(['user'], response.user);
          }
        })
        .catch(() => {
          mutationLogout.mutate();
        })
        .finally(() => {
          setIsAuthLoading(false);
        });
    } else {
      setIsAuthLoading(false);
    }
  }, [queryClient]);

  return { userData, isLoading, isAuthLoading, refetch };
};

export default useAuth;
