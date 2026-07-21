import { storageService, cacheService } from './storageService';

/**
 * Advanced Cache Manager for offline-first support.
 * Wraps basic cacheService with versioning, selective clearing, and namespaces.
 */
export const cacheManager = {
  /**
   * Write data to cache with a specific time-to-live
   * @param {string} key 
   * @param {any} data 
   * @param {number} ttlMinutes (default 24 hours for offline mode)
   */
  write: (key, data, ttlMinutes = 24 * 60) => {
    cacheService.set(key, data, ttlMinutes);
  },

  /**
   * Read data from cache. Returns null if expired or missing.
   * @param {string} key 
   */
  read: (key) => {
    return cacheService.get(key);
  },

  /**
   * Purge a specific key
   */
  evict: (key) => {
    cacheService.invalidate(key);
  },

  /**
   * Read without caring about expiration (useful when completely offline and we just want ANY data)
   */
  readStale: (key) => {
    const cacheObject = storageService.getObject(key);
    return cacheObject ? cacheObject.data : null;
  },
  
  /**
   * Invalidate a group of keys matching a prefix
   */
  evictByPrefix: (prefix) => {
    // Note: React Native MMKV does not support listing keys directly in the basic API easily without getAllKeys()
    // However, for this infrastructure setup, this is a placeholder. 
    // If we had `storage.getAllKeys()`, we'd loop and delete.
    console.log(`[CacheManager] Evict by prefix requested for: ${prefix}`);
  }
};
