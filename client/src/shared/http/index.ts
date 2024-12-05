import axios from 'axios';
import { AuthResponse } from '../types';

const API_URL = `http://79.141.65.250/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response = await api.get<AuthResponse>(`/refresh`);
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
