import axios from 'axios';

const API_URL = `${import.meta.env.VITE_DEV_PORT}/api`;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = JSON.parse(localStorage.getItem('token') || '{}')?.token;

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle error
    return Promise.reject(error);
  },
);

export default apiClient;
