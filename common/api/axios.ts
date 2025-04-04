import { toast } from 'react-toastify';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {doLogout, getToken } from '@/Auth';

export interface ResponseData {
  statusCode?: number;
  message?: string;
  data: [];
  filePath: string;
}

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1'
  }
});

instance.interceptors.request.use(
  async function (config) {
    const token = await getToken();
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response && (response.status === 200 || response.status === 201 || response.status === 204)) {
      return response.data;
    } else {
      if (response && (response.status === 401 || response.status === 408)) {
        toast.error('Session Expire.');
      } else if (response && response.status >= 500) {
        toast.error('Internal Server Error.', {
          toastId: 'error',
          autoClose: 2000
        });
      } else {
        toast.error(response.data?.message ?? 'Unknown error', {
          toastId: 'response_data',
          autoClose: 2000
        });
      }
      return Promise.reject(response);
    }
  },
  (error: AxiosError<ResponseData>) => {
    if (error.response?.data) {
      if (error.response.data.statusCode === 401 || error.response.data.statusCode === 408) {
        toast.error(error.response.data.message ?? 'Unauthorized', {
          toastId: 'nodata',
          autoClose: 1000
        });
        setTimeout(() => {
          doLogout();
          window?.location?.replace('/');
        }, 1000);
      } else if (error.response.data.statusCode === 404) {
        if (!toast.isActive('nodata')) {
          toast.error(error.response.data.message ?? 'Not Found', {
            toastId: 'nodata',
            autoClose: 1000
          });
        } else {
          toast.update('nodata', {
            autoClose: 2000,
            render: error.response.data.message ?? 'Not Found',
            type: 'error'
          });
        }
      } else {
        toast.error(error.response.data.message ?? 'Unknown error', {
          toastId: 'error_response',
          autoClose: 2000
        });
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default instance;
