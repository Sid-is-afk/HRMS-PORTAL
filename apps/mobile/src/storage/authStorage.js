import { storage } from './mmkv';

const KEYS = {
  ACCESS_TOKEN: 'auth.accessToken',
  REFRESH_TOKEN: 'auth.refreshToken',
  USER: 'auth.user',
};

const writeToken = (accessToken, refreshToken) => {
  storage.set(KEYS.ACCESS_TOKEN, accessToken ?? '');
  if (refreshToken) {
    storage.set(KEYS.REFRESH_TOKEN, refreshToken);
  } else {
    storage.delete(KEYS.REFRESH_TOKEN);
  }
};

export const saveToken = (accessToken, refreshToken) => {
  writeToken(accessToken, refreshToken);
};

export const getToken = () => ({
  accessToken: storage.getString(KEYS.ACCESS_TOKEN) || undefined,
  refreshToken: storage.getString(KEYS.REFRESH_TOKEN) || undefined,
});

export const clearToken = () => {
  storage.delete(KEYS.ACCESS_TOKEN);
  storage.delete(KEYS.REFRESH_TOKEN);
};

export const saveUser = (user) => {
  if (user) {
    storage.set(KEYS.USER, JSON.stringify(user));
  } else {
    storage.delete(KEYS.USER);
  }
};

export const getUser = () => {
  const userStr = storage.getString(KEYS.USER);
  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch {
    storage.delete(KEYS.USER);
    return null;
  }
};

export const logout = () => {
  clearToken();
  storage.delete(KEYS.USER);
};
