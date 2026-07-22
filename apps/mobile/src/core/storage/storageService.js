import { storage } from './mmkv';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';

/**
 * Generic Storage Service wrapping MMKV/localStorage
 * Provides a unified API with JSON parsing for complex objects.
 */
export const storageService = {
  /**
   * Store a string value
   */
  setItem: (key, value) => {
    storage.set(key, value);
  },

  /**
   * Get a string value
   */
  getItem: (key) => {
    return storage.getString(key);
  },

  /**
   * Store a JSON object
   */
  setObject: (key, object) => {
    try {
      storage.set(key, JSON.stringify(object));
    } catch (e) {
      console.error(`Error saving object to storage: ${key}`, e);
    }
  },

  /**
   * Retrieve and parse a JSON object
   */
  getObject: (key) => {
    try {
      const value = storage.getString(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error(`Error parsing object from storage: ${key}`, e);
      return null;
    }
  },

  /**
   * Store a boolean
   */
  setBoolean: (key, value) => {
    storage.set(key, value);
  },

  /**
   * Retrieve a boolean
   */
  getBoolean: (key) => {
    return storage.getBoolean(key);
  },

  /**
   * Delete an item by key
   */
  removeItem: (key) => {
    storage.delete(key);
  },

  /**
   * Clear all storage (use with caution)
   */
  clearAll: () => {
    storage.clearAll();
  },
};

/**
 * Cache Service built on top of storageService
 * Allows setting expiry times for cached data.
 */
export const cacheService = {
  set: (key, data, ttlMinutes = 60) => {
    const expiry = new Date().getTime() + ttlMinutes * 60 * 1000;
    const cacheObject = { data, expiry };
    storageService.setObject(key, cacheObject);
  },

  get: (key) => {
    const cacheObject = storageService.getObject(key);
    if (!cacheObject) return null;

    if (new Date().getTime() > cacheObject.expiry) {
      storageService.removeItem(key);
      return null;
    }
    return cacheObject.data;
  },
  
  invalidate: (key) => {
    storageService.removeItem(key);
  }
};
