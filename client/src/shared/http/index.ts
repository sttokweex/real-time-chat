import axios from 'axios';
import { AuthResponse } from '../types';

const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get<AuthResponse>(`/refresh`);
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
export { refreshToken };
