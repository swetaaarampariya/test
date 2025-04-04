import axios, { AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from 'axios';
import AxiosInstance, { ResponseData } from './axios';

export interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
  statusCode?: number;
  message?: string;
  filePath?: string;
  count: number;
}

export const AxiosPost = async <T>(
  URL: string,
  body: T,
  config?: any
): Promise<string | (AxiosResponse<any, any> & ResponseData) | undefined> => {
  try {
    return await AxiosInstance.post(URL, body, config);
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      return error?.response?.data.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'An unknown error occurred';
    }
  }
};

export const AxiosPut = async (URL: string, body: any): Promise<string | AxiosResponse<any, any> | undefined> => {
  try {
    return await AxiosInstance.put(URL, body);
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      return error?.response?.data.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'An unknown error occurred';
    }
  }
};

export const AxiosGet = async (URL: string): Promise<string | AxiosResponse<any, any> | undefined> => {
  try {
    return await AxiosInstance.get(URL);
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      return error?.response?.data.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'An unknown error occurred';
    }
  }
};

export const AxiosDelete = async (URL: string): Promise<string | AxiosResponse<any, any> | undefined> => {
  try {
    return await AxiosInstance.delete(URL);
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      return error?.response?.data.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'An unknown error occurred';
    }
  }
};

export const AxiosPatch = async (URL: string, body?: any): Promise<string | AxiosResponse<any, any> | undefined> => {
  try {
    return await AxiosInstance.patch(URL, body);
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      return error?.response?.data.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'An unknown error occurred';
    }
  }
};

