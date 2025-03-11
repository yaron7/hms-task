import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const createApiInstance = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = cookies.get('jwt');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response) {
        console.error('API response error:', error.response.data);
      } else if (error.request) {
        console.error('API request error:', error.request);
      } else {
        console.error('API error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

const defaultBaseURL = process.env.REACT_APP_API_BASE_URL || '/api';
const api = createApiInstance(defaultBaseURL);

export default api;