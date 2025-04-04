'use server';

import { cookies } from 'next/headers';
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

const SECRET_KEY = 'your-secret-key-1234567890123456';
const COOKIE_NAME = 'data';
const FILE_PATH_COOKIE = 'filePath';

const encryptData = (data: string): string => CryptoJS.AES.encrypt(data, SECRET_KEY).toString();

const decryptData = (ciphertext: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

export const getCookieData = async (name: string): Promise<string | undefined> => {
  const cookieStore = await cookies();

  return cookieStore.get(name)?.value;
};


export const checkUserLoggedIn = async (): Promise<any | undefined> => {
  const sessionData = await getCookieData(COOKIE_NAME);

  if (!sessionData) return undefined;

  const decrypted = decryptData(sessionData);
  return decrypted ? JSON.parse(decrypted) : undefined;
};


export const isLoggedIn = async (): Promise<boolean> => {
  const sessionData = await getCookieData(COOKIE_NAME);
  return Boolean(sessionData);
};


export const getCurrentUserDetail = async (): Promise<any | undefined> => {
  return await checkUserLoggedIn();
};


export const doLogin = async (data: any): Promise<void> => {
  const encryptedData = encryptData(JSON.stringify(data));
  
  const cookieStore = await cookies(); 

  cookieStore.set(COOKIE_NAME, encryptedData, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24, // One day
    path: '/'
  });
};


export const loginFilepath = async (file: string): Promise<void> => {
  const encryptedFilePath = encryptData(file);

  const cookieStore = await cookies(); 

  cookieStore.set(FILE_PATH_COOKIE, encryptedFilePath, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24, // One day
    path: '/'
  });
};

export const getToken = async (): Promise<string | undefined> => {
  const userData = await checkUserLoggedIn();
  return userData?.token;
};

export const getUserId = async (): Promise<string | undefined> => {
  const userData = await checkUserLoggedIn();
  const token = userData?.token;

  if (!token) return undefined;

  try {
    const decoded: { userId?: string } = jwtDecode(token);
    return decoded.userId;
  } catch (error) {
    console.error("Invalid token", error);
    return undefined;
  }
};

export const doLogout = async (): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.delete(FILE_PATH_COOKIE);
  cookieStore.delete(COOKIE_NAME);
};

