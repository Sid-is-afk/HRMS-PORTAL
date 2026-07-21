import { storage } from '../mmkv';

const KEYS = {
  ACCESS_TOKEN: 'auth.accessToken',
  REFRESH_TOKEN: 'auth.refreshToken',
  USER: 'auth.user',
};

export const saveToken = (accessToken, refreshToken) => {
  storage.set(KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    storage.set(KEYS.REFRESH_TOKEN, refreshToken);
  }
};

export const getToken = () => {
  return {
    accessToken: storage.getString(KEYS.ACCESS_TOKEN),
    refreshToken: storage.getString(KEYS.REFRESH_TOKEN),
  };
};

export const clearToken = () => {
  storage.delete(KEYS.ACCESS_TOKEN);
  storage.delete(KEYS.REFRESH_TOKEN);
};

export const saveUser = (user) => {
  storage.set(KEYS.USER, JSON.stringify(user));
};

export const getUser = () => {
  const userStr = storage.getString(KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  clearToken();
  storage.delete(KEYS.USER);
};
