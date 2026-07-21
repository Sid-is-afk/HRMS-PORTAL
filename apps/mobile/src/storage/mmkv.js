import { Platform } from 'react-native';

let storageInstance;

if (Platform.OS === 'web') {
  storageInstance = {
    set: (key, value) => {
      try {
        window.localStorage.setItem(key, value.toString());
      } catch (e) {}
    },
    getString: (key) => {
      try {
        return window.localStorage.getItem(key) || undefined;
      } catch (e) {
        return undefined;
      }
    },
    getBoolean: (key) => {
      try {
        return window.localStorage.getItem(key) === 'true';
      } catch (e) {
        return false;
      }
    },
    getNumber: (key) => {
      try {
        const val = window.localStorage.getItem(key);
        return val ? Number(val) : undefined;
      } catch (e) {
        return undefined;
      }
    },
    delete: (key) => {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {}
    },
    clearAll: () => {
      try {
        window.localStorage.clear();
      } catch (e) {}
    }
  };
} else {
  const { MMKV } = require('react-native-mmkv');
  storageInstance = new MMKV();
}

export const storage = storageInstance;
