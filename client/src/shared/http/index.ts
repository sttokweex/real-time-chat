import axios from 'axios';
import { AuthResponse } from '../types';

const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get<AuthResponse>(`http://79.141.65.250:3001/api/refresh`);
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
