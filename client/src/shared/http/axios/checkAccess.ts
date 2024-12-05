import { refreshToken } from '../index';

export interface TokenData {
  token: string;
  exp: number;
}
export const checkAccess = async (): Promise<string | null> => {
  const tokenData = localStorage.getItem('token');

  if (tokenData) {
    const { token, exp }: TokenData = JSON.parse(tokenData);
    const currentTime = Date.now() / 1000;

    if (exp <= currentTime) {
      try {
        const newTokenData = await refreshToken();

        return newTokenData.accessToken;
      } catch (error) {
        console.error('Ошибка обновления токена:', error);
      }
    } else {
      return token;
    }
  }

  return null;
};
